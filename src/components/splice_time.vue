<template>
  <h6>Splice Time</h6>
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" v-model="value.time_specified">
    <label class="form-check-label">time_specified</label>
  </div>

  <div v-if="value.time_specified" class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">pts_time</span>
    </div>
    <input type="number" class="form-control" v-model="value.pts_time" />
  </div>
</template>
  
<script>
export default {
  name: "SpliceTime",
  props: {
    modelValue: Object,
  },
  computed: {
    value: {
      get() {
        var v = this.modelValue;
        v.time_specified = false;
        v.pts_time = 0;
        return v;
      },
      set(value) {
        this.$emit("upate:modelValue", value);
      },
    },
  },
};
</script>