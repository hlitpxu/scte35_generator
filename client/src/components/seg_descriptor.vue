<script setup>
import {
    SEGMENTATION_TYPES_VAL,
    SEGMENTATION_TYPES_VAL_TO_STR,
    SEGMENTATION_UPID_TYPES_VAL,
    SEGMENTATION_UPID_TYPES_VAL_TO_STR,
    SEGMENTATION_UPID_TYPES_VAL_TO_LEN,
    DEVICE_RESTRICTION_VAL,
    DEVICE_RESTRICTION_VAL_TO_STR,
} from './types.ts';

var newComponent = {
    tag: 0,
    pts_offset: 0,
};
</script>

<template>
    <div class="row gy-2">
        <div class="col-12">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">event_id</span>
                </div>
                <input type="number" class="form-control" v-model="value.event_id" />
            </div>

            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="value.event_cancel">
                <label class="form-check-label">event_cancel</label>
            </div>

            <div v-show="!value.event_cancel">

                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="value.program_segmentation_flag">
                    <label class="form-check-label">program_segmentation_flag</label>
                </div>
                <div v-if="!value.program_segmentation_flag" class="border rounded display-block">
                    <table class="table table-bordered">
                        <thead>
                            <th>#</th>
                            <th>tag</th>
                            <th>pts offset</th>
                        </thead>
                        <tbody>
                            <tr v-for="(comp, index) in value.components" :key="index">
                                <td>
                                    <button type="button" class="btn btn-outline-danger btn-sm"
                                        @click="value.components.splice(index, 1);">
                                        X
                                    </button>
                                </td>
                                <td><input type="number" class="form-control" v-model="comp.tag" /></td>
                                <td><input type="number" class="form-control" v-model="comp.pts_offset" /></td>
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

                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="value.duration_flag">
                    <label class="form-check-label">duration_flag</label>
                </div>
                <div v-show="value.duration_flag">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">duration</span>
                        </div>
                        <input type="number" class="form-control" v-model="value.duration" />
                    </div>
                </div>

                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="value.delivery_not_restricted_flag">
                    <label class="form-check-label">delivery_not_restricted_flag</label>
                </div>

                <div v-show="!value.delivery_not_restricted_flag">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" v-model="value.web_delivery_allowed_flag">
                        <label class="form-check-label">web_delivery_allowed_flag</label>
                    </div>


                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" v-model="value.no_regional_blackout_flag">
                        <label class="form-check-label">no_regional_blackout_flag</label>
                    </div>


                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" v-model="value.archive_allowed_flag">
                        <label class="form-check-label">archive_allowed_flag</label>
                    </div>

                    <div class="row" style="margin-top: 10px;">
                        <div class="col-6">
                            <label class="input-group-text" for="restrictions">device_restrictions</label>
                        </div>
                        <div class="col-6">
                            <select class="form-select form-select" v-model="value.device_restrictions">
                                <option v-for="val, index in DEVICE_RESTRICTION_VAL" :key="index" :value="val">
                                    {{ DEVICE_RESTRICTION_VAL_TO_STR[val] }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row" style="margin-top: 10px;">
                    <div class="col-4">
                        <label class="input-group-text" for="upid_type">upid_type</label>
                    </div>
                    <div class="col-8">
                        <select class="form-select form-select" v-model="value.upid_type">
                            <option v-for="val, index in SEGMENTATION_UPID_TYPES_VAL" :key="index" :value="val">
                                {{ SEGMENTATION_UPID_TYPES_VAL_TO_STR[val] }}</option>
                        </select>
                    </div>
                    <div v-if="value.upid_type != SEGMENTATION_UPID_TYPES_VAL.NOT_USED" class="col-12">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">upid</span>
                            </div>
                            <input type="text" class="form-control" v-model="value.upid" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-5">
            <label class="input-group-text" for="descritor_type">segment_type</label>
        </div>
        <div class="col-7">
            <select class="form-select form-select" v-model="value.type_id">
                <option v-for="type, index in SEGMENTATION_TYPES_VAL" :key="index" :value="type">
                    {{ SEGMENTATION_TYPES_VAL_TO_STR[type] }}</option>
            </select>
        </div>

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
                    v.program_segmentation_flag = true;
                    v.duration_flag = false;
                    v.delivery_not_restricted_flag = false;
                    v.web_delivery_allowed_flag = false;
                    v.no_regional_blackout_flag = false;
                    v.archive_allowed_flag = false;
                    v.device_restrictions = DEVICE_RESTRICTION_VAL.NONE;
                    v.components = [];
                    v.duration = 0;
                    v.upid_type = SEGMENTATION_UPID_TYPES_VAL.NOT_USED;
                    v.upid = "";
                    v.type_id = 0;
                    v.segment_num = 0;
                    v.segments_expcted = 0;
                    v.sub_segment_num = 0;
                    v.sub_segments_expcted = 0;
                }
                return v;
            },
            set(value) {
                this.$emit("upate:modelValue", value);
            },
        },
    },
    get_binary(data) {
        var rv = [0x02, 0x00, 0x43, 0x55, 0x45, 0x49];

        var offset = rv.length;
        rv.push(0x00, 0x00, 0x00, 0x00);
        rv[offset] |= (data.event_id & 0xFF000000) >>> 24;
        rv[offset + 1] |= (data.event_id & 0xFF0000) >>> 16;
        rv[offset + 2] |= (data.event_id & 0xFF00) >>> 8;
        rv[offset + 3] |= (data.event_id & 0xFF);

        offset = rv.length;
        rv.push(0x7F);
        if (data.event_cancel) {
            rv[offset] |= 0x80;
        } else {
            offset = rv.length;
            rv.push(0x00);
            if (data.program_segmentation_flag) {
                rv[offset] |= 0x80;
            }
            if (data.duration_flag) {
                rv[offset] |= 0x40
            }
            if (data.delivery_not_restricted_flag) {
                rv[offset] |= 0x3F;
            } else {
                if (data.web_delivery_allowed_flag) {
                    rv[offset] |= 0x10;
                }
                if (data.no_regional_blackout_flag) {
                    rv[offset] |= 0x08;
                }
                if (data.archive_allowed_flag) {
                    rv[offset] |= 0x04;
                }
                rv[offset] |= (data.device_restrictions & 0x03);
            }

            // program_segmentation_flag hardcode to true now
            if (!data.program_segmentation_flag) {
                rv.push(data.components.length);
                for (let i = 0; i < data.components.length; ++i) {
                    rv.push(data.components[i].tag);
                    offset = rv.length;
                    rv.push(0xFE, 0x00, 0x00, 0x00, 0x00);
                    rv[offset] |= (data.components[i].pts_offset & 0x0100000000) >>> 32;
                    rv[offset + 1] |= (data.components[i].pts_offset & 0xFF000000) >>> 24;
                    rv[offset + 2] |= (data.components[i].pts_offset & 0xFF0000) >>> 16;
                    rv[offset + 3] |= (data.components[i].pts_offsetue & 0xFF00) >>> 8;
                    rv[offset + 4] |= (data.components[i].pts_offset & 0xFF);
                }
            }

            if (data.duration_flag) {
                offset = rv.length;
                rv.push(0x00, 0x00, 0x00, 0x00, 0x00);
                rv[offset] |= (data.duration & 0xFF00000000) >>> 32;
                rv[offset + 1] |= (data.duration & 0xFF000000) >>> 24;
                rv[offset + 2] |= (data.duration & 0xFF0000) >>> 16;
                rv[offset + 3] |= (data.duration & 0xFF00) >>> 8;
                rv[offset + 4] |= (data.duration & 0xFF);
            }

            let upid_length = SEGMENTATION_UPID_TYPES_VAL_TO_LEN[data.upid_type];
            let upid_data = data.upid;
            if (upid_length >= 0) {
                if (upid_data.length < upid_length) {
                    upid_data = data.upid.padStart(upid_length, 0x00);
                } else {
                    upid_data = upid_data.slice(0, upid_length);
                }
            } else {
                upid_length = data.upid.length;
            }
            rv.push(data.upid_type);
            rv.push(upid_length);
            for (let i = 0; i < upid_length; ++i) {
                rv.push(upid_data.charCodeAt(i));
            }
            // rv.push(...upid_data);

            rv.push(data.type_id & 0xFF);
            rv.push(0x01, 0x01);

            switch (data.type_id) {
                case 0x34:
                case 0x36:
                case 0x38:
                case 0x3A:
                    rv.push(0x00, 0x00);
                    break;
                default:
                    break;
            }

            rv[1] |= (rv.length - 2) & 0xFF;
        }
        return rv
    }
};
</script>