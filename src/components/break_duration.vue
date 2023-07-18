<template>
    <hr />
    <h6>Break Duration</h6>
    <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" v-model="value.auto_return">
        <label class="form-check-label">auto_return</label>
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
    get_break_duration_binary(data) {
        var rv = [0x00, 0x00, 0x00, 0x00, 0x00];
        if (data.auto_return) {
            rv[0] |= 0x80;
        }
        if ((data.duration & 0x100000000) > 0) {
            rv[0] |= 0x01;
        }
        rv[1] |= (data.duration & 0xFF000000) >>> 24;
        rv[2] |= (data.duration & 0xFF0000) >>> 16;
        rv[3] |= (data.duration & 0xFF00) >>> 8;
        rv[4] |= (data.duration & 0xFF);
        return rv;
    },
};
</script>