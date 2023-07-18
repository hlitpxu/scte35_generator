<template>
    <hr />
    <h6>Break Duration</h6>
    <div class="cuscom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" v-model="value.auto_return" />
        <label class="custom-control-label">auto_return</label>
    </div>

    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">duration</span>
        </div>
        <input type="number" class="form-control" v-model="value.duration" />
    </div>
</template>
    
<script>
export default {
    name: "BreakDuration",
    props: {
        modelValue: Object,
    },
    computed: {
        value: {
            get() {
                var v = this.modelValue
                v.auto_return = false;
                v.duration = 0;
                return v;
            },
            set(value) {
                this.$emit("upate:modelValue", value);
            },
        },
    },
};
</script>