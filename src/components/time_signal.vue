<template>
  <h6>Time Signal</h6>
  <SpliceTime v-model="value.splice_time" />
</template>
  
<script>
import SpliceTime from './splice_time.vue'
export default {
  name: "TimeSignal",
  components: {
    SpliceTime,
  },
  props: {
    modelValue: Object,
  },
  computed: {
    value: {
      get() {
        var v = this.modelValue;
        v.splice_time = {};
        return v;
      },
      set(value) {
        this.$emit("upate:modelValue", value);
      },
    },
  },
  get_time_signal_binary(data) {
    return SpliceTime.get_splice_time_binary(data.splice_time);
  }
};
</script>