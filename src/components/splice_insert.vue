<template>
  <h6>Splice Insert</h6>
  <div v-for="(v, k) in value.inputs" :key="k" class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">{{ k }}</span>
    </div>
    <input type="number" class="form-control" v-model="value.inputs[k]" />
  </div>

  <div class="custom-control custom-checkbox" v-for="(v, k) in value.flags" :key="k">
    <input type="checkbox" class="custom-control-input" v-model="value.flags[k]">
    <label class="custom-control-label">{{ k }}</label>
  </div>

  <div v-if="!value.flags.splice_cancel">
    <div v-for="(v, k) in value.optional.inputs" :key="k" class="input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">{{ k }}</span>
      </div>
      <input type="number" class="form-control" v-model="value.optional.inputs[k]" />
    </div>

    <div class="custom-control custom-checkbox" v-for="(v, k) in value.optional.flags" :key="k">
      <input type="checkbox" class="custom-control-input" v-model="value.optional.flags[k]">
      <label class="custom-control-label">{{ k }}</label>
    </div>
    <div class="custom-control custom-checkbox">
      <input type="checkbox" class="custom-control-input" v-model="value.optional.program_splice" disabled>
      <label class="custom-control-label">program_splice</label>
    </div>

    <div v-if="value.optional.program_splice && !value.optional.flags.splice_immediate">
      <SpliceTime v-model="value.optional.splice_time" />
    </div>

    <BreakDuration v-if="value.optional.flags.duration" v-model="value.optional.break_duration" />
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
        return this.modelValue;
      },
      set(value) {
        this.$emit("upate:modelValue", value);
      },
    },
  },
};
</script>