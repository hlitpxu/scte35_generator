<template>
  <h6>Splice Insert</h6>
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

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" v-model="value.splice_immediate">
      <label class="form-check-label">splice_immediate</label>
    </div>

    <div class="form-check form-switch">
      <input class="form-check-input" type="checkbox" v-model="value.program_splice" disabled>
      <label class="form-check-label">program_splice</label>
    </div>

    <div v-if="value.program_splice && !value.splice_immediate">
      <hr />
      <SpliceTime v-model="value.splice_time" />
    </div>

    <BreakDuration v-if="value.duration_flag" v-model="value.break_duration" />
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
        v.duraiton_flag = false;
        v.splice_immediate = false;
        v.program_splice = true;
        v.splice_time = {};
        v.break_duration = {};
        return v;
      },
      set(value) {
        this.$emit("upate:modelValue", value);
      },
    },
  },
};
</script>