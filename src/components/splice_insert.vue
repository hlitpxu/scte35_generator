<template>
  <h6>Splice Insert</h6>
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">event_id</span>
    </div>
    <input type="number" class="form-control" v-model="value.event_id" />
  </div>

  <div>
    <input type="checkbox" class="custom-control-input" v-model="value.splice_cancel">
    <label class="custom-control-label">splice_cancel</label>
  </div>

  <div v-if="!value.splice_cancel">
    <div class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">program_id</span>
      </div>
      <input type="number" class="form-control" v-model="value.program_id" />
    </div>

    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" v-model="value.out_of_network">
      <label class="custom-control-label">out_of_network</label>
    </div>

    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" v-model="value.duration_flag">
      <label class="custom-control-label">duration_flag</label>
    </div>

    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" v-model="value.splice_immediate">
      <label class="custom-control-label">splice_immediate</label>
    </div>

    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" v-model="value.program_splice" disabled>
      <label class="custom-control-label">program_splice</label>
    </div>

    <div v-if="value.program_splice && !value.splice_immediate">
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