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
      <div class="border rounded display-block">
        <table class="table table-bordered">
          <thead>
            <th>#</th>
            <th>tag</th>
            <th>splice time</th>
          </thead>
          <tbody>
            <tr v-for="(comp, index) in value.components" :key="index">
              <td>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="value.components.splice(index, 1);">
                  X
                </button>
              </td>
              <td><input type="number" class="form-control" v-model="comp.tag" /></td>
              <td>
                <SpliceTime v-if="!value.splice_immediate" v-model="comp.splice_time" />
              </td>
            </tr>
            <tr>
              <td>
                <button type="button" class="btn btn-outline-primary btn-sm"
                  @click="value.components.push(JSON.parse(JSON.stringify(newComponent)));">
                  +
                </button>
              </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
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