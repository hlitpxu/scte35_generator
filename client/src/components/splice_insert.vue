<script setup>
var newComponent = {
  tag: 0,
  splice_time: {}
};
</script>

<template>
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">event_id</span>
    </div>
    <input type="number" class="form-control" v-model="value.event_id" />
  </div>

  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" v-model="value.splice_cancel">
    <label class="form-check-label">splice_cancel</label>
  </div>

  <div v-if="!value.splice_cancel">
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">program_id</span>
      </div>
      <input type="number" class="form-control" v-model="value.program_id" />
    </div>

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" v-model="value.out_of_network">
      <label class="form-check-label">out_of_network</label>
    </div>

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" v-model="value.duration_flag">
      <label class="form-check-label">duration_flag</label>
    </div>
    <BreakDuration v-if="value.duration_flag" v-model="value.break_duration" />

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" v-model="value.splice_immediate">
      <label class="form-check-label">splice_immediate</label>
    </div>

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" v-model="value.program_splice">
      <label class="form-check-label">program_splice</label>
    </div>

    <div v-if="!value.program_splice">
      <div class="border rounded container">
        <div class="row align-items-center" v-for="(comp, index) in value.components" :key="index">
          <div class="col-5">
            <div style="height: 95px;" class="d-flex align-items-center">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">tag</span>
                </div>
                <input type="number" class="form-control" v-model="comp.tag" />
              </div>
            </div>
          </div>
          <div class="col-5">
            <SpliceTime v-if="!value.splice_immediate" v-model="comp.splice_time" />
          </div>
          <div class="col-2">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="value.components.splice(index, 1);">
              X
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col-2">
            <button type="button" class="btn btn-outline-primary btn-sm"
              @click="value.components.push(JSON.parse(JSON.stringify(newComponent)));">+</button>
          </div>
          <div class="col-5">
          </div>
          <div class="col-5">
          </div>
        </div>
      </div>
      <br />
    </div>

    <div v-if="value.program_splice && !value.splice_immediate">
      <SpliceTime v-model="value.splice_time" />
    </div>

    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">unique_id</span>
      </div>
      <input type="number" class="form-control" v-model="value.unique_id" />
    </div>
  </div>
</template>

<script>
import SpliceTime from './splice_time.vue'
import BreakDuration from './break_duration.vue';
export default {
  name: "SpliceInsert",
  components: {
    SpliceTime,
    BreakDuration,
  },
  props: {
    modelValue: Object,
  },
  computed: {
    value: {
      get() {
        var v = this.modelValue;
        v.event_id = 1;
        v.splice_cancel = false;
        v.program_id = 1;
        v.out_of_network = false;
        v.duration_flag = false;
        v.splice_immediate = false;
        v.program_splice = true;
        v.components = [];
        v.splice_time = {};
        v.break_duration = {};
        v.unique_id = 1;
        return v;
      },
      set(value) {
        this.$emit("upate:modelValue", value);
      },
    },
  },
  get_binary(data) {
    var rv = [0x00, 0x00, 0x00, 0x00, 0x7F];
    rv[0] |= (data.event_id & 0xFF000000) >>> 24;
    rv[1] |= (data.event_id & 0xFF0000) >>> 16;
    rv[2] |= (data.event_id & 0xFF00) >>> 8;
    rv[3] |= (data.event_id & 0xFF);
    if (data.splice_cancel) {
      rv[4] |= 0x80;
    } else {
      var offset = rv.length;
      rv.push(0x0F);
      if (data.out_of_network) {
        rv[offset] |= 0x80;
      }
      if (data.program_splice) {
        rv[offset] |= 0x40;
      }
      if (data.duration_flag) {
        rv[offset] |= 0x20;
      }
      if (data.splice_immediate) {
        rv[offset] |= 0x10;
      }
      if (data.program_splice && !data.splice_immediate) {
        rv.push(...SpliceTime.get_binary(data.splice_time));
      }
      if (!data.program_splice) {
        rv.push(data.components.length);
        for (let i = 0; i < data.components.length; ++i) {
          console.log(data.components[i]);
          rv.push(data.components[i].tag);
          if (!data.splice_immediate) {
            rv.push(...SpliceTime.get_binary(data.components[i].splice_time));
          }
        }
      }
      if (data.duration_flag) {
        rv.push(...BreakDuration.get_binary(data.break_duration));
      }

      offset = rv.length;
      rv.push(0x00, 0x00, 0x00, 0x00);
      rv[offset] |= (data.unique_id & 0xFF00) >>> 8;
      rv[offset + 1] |= (data.unique_id & 0xFF);
    }
    return rv;
  },
};
</script>