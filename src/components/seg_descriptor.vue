<template>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">event_id</span>
        </div>
        <input type="number" class="form-control" v-model="value.event_id" />
    </div>
    <div class="cuscom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" v-model="value.event_cancel" />
        <label class="custom-control-label">event_cancel</label>
    </div>
</template>
    
<script>
export default {
    name: "SegmentationDescriptor",
    props: {
        modelValue: Object,
    },
    computed: {
        value: {
            get() {
                var v = this.modelValue;
                if (!v.init) {
                    v.init = true;
                    v.event_id = 1;
                    v.event_cancel = false;
                }
                return v;
            },
            set(value) {
                this.$emit("upate:modelValue", value);
            },
        },
    },
};
</script>