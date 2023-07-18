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
  get_splice_time_binary(data) {
    var rv = [0x00];
    if (data.time_specified) {
      rv[0] |= 0x80;
      rv.push(0x00, 0x00, 0x00, 0x00);
      if ((data.pts_time & 0x100000000) > 0) {
        rv[0] |= 0x01;
      }
      rv[1] |= (data.pts_time & 0xFF000000) >>> 24;
      rv[2] |= (data.pts_time & 0xFF0000) >>> 16;
      rv[3] |= (data.pts_time & 0xFF00) >>> 8;
      rv[4] |= (data.pts_time & 0xFF);
    }
    return rv;
  },
};
</script>