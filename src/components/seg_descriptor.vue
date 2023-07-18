<script setup>
const SEGMENTATION_TYPES = {
    NOT_INDICATED: "not_indicated",
    CONTENT_IDENTIFICATION: "content_identification",
    PROGRAM_START: "program_start",
    PROGRAM_END: "program_end",
    PROGRAM_EARLY_TERMINATION: "program_early_termination",
    PROGRAM_BREAKAWAY: "program_breakaway",
    PROGRAM_RESUMPTION: "program_resumption",
    PROGRAM_RUNOVER_PLANNED: "program_runover_planned",
    PROGRAM_RUNOVER_UNPLANNED: "program_runover_unplanned",
    PROGRAM_OVERLAP_START: "program_overlap_start",
    PROGRAM_BLACKOUT_OVERRIDE: "program_blackout_override",
    PROGRAM_START_IN_PROGRESS: "program_start_in_progress",
    CHAPTER_START: "chapter_start",
    CHAPTER_END: "chapter_end",
    BREAK_START: "break_start",
    BREAK_END: "break_end",
    OPENING_CREDIT_START: "opening_credit_start",
    OPENING_CREDIT_END: "opening_credit_end",
    CLOSING_CREDIT_START: "closing_credit_start",
    CLOSING_CREDIT_END: "closing_credit_end",
    PROVIDER_ADVERTISEMENT_START: "provider_advertisement_start",
    PROVIDER_ADVERTISEMENT_END: "provider_advertisement_end",
    DISTRIBUTOR_ADVERTISEMENT_START: "distributor_advertisement_start",
    DISTRIBUTOR_ADVERTISEMENT_END: "distributor_advertisement_end",
    PROVIDER_PLACEMENT_OPPORTUNITY_START: "provider_placement_opportunity_start",
    PROVIDER_PLACEMENT_OPPORTUNITY_END: "provider_placement_opportunity_end",
    DISTRIBUTOR_PLACEMENT_OPPORTUNITY_START: "distributor_placement_opportunity_start",
    DISTRIBUTOR_PLACEMENT_OPPORTUNITY_END: "distributor_placement_opportunity_end",
    PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY_START: "provider_overlay_placement_opportunity_start",
    PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY_END: "provider_overlay_placement_opportunity_end",
    DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY_START: "distributor_overlay_placement_opportunity_start",
    DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY_END: "distributor_overlay_placement_opportunity_end",
    UNSCHEDULED_EVENT_START: "unscheduled_event_start",
    UNSCHEDULED_EVENT_END: "unscheduled_event_end",
    NETWORK_START: "network_start",
    NETWORK_END: "network_end",
};

const SEGMENTATION_TYPES_VAL = {
    NOT_INDICATED: 0x00,
    CONTENT_IDENTIFICATION: 0x01,
    PROGRAM_START: 0x10,
    PROGRAM_END: 0x11,
    PROGRAM_EARLY_TERMINATION: 0x12,
    PROGRAM_BREAKAWAY: 0x13,
    PROGRAM_RESUMPTION: 0x14,
    PROGRAM_RUNOVER_PLANNED: 0x15,
    PROGRAM_RUNOVER_UNPLANNED: 0x16,
    PROGRAM_OVERLAP_START: 0x17,
    PROGRAM_BLACKOUT_OVERRIDE: 0x18,
    PROGRAM_START_IN_PROGRESS: 0x19,
    CHAPTER_START: 0x20,
    CHAPTER_END: 0x21,
    BREAK_START: 0x22,
    BREAK_END: 0x23,
    OPENING_CREDIT_START: 0x24,
    OPENING_CREDIT_END: 0x25,
    CLOSING_CREDIT_START: 0x26,
    CLOSING_CREDIT_END: 0x27,
    PROVIDER_ADVERTISEMENT_START: 0x30,
    PROVIDER_ADVERTISEMENT_END: 0x31,
    DISTRIBUTOR_ADVERTISEMENT_START: 0x32,
    DISTRIBUTOR_ADVERTISEMENT_END: 0x33,
    PROVIDER_PLACEMENT_OPPORTUNITY_START: 0x34,
    PROVIDER_PLACEMENT_OPPORTUNITY_END: 0x35,
    DISTRIBUTOR_PLACEMENT_OPPORTUNITY_START: 0x36,
    DISTRIBUTOR_PLACEMENT_OPPORTUNITY_END: 0x37,
    PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY_START: 0x38,
    PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY_END: 0x39,
    DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY_START: 0x3A,
    DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY_END: 0x3B,
    UNSCHEDULED_EVENT_START: 0x40,
    UNSCHEDULED_EVENT_END: 0x41,
    NETWORK_START: 0x50,
    NETWORK_END: 0x51,
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
                    <input class="form-check-input" type="checkbox" v-model="value.program_segmentation_flag" disabled>
                    <label class="form-check-label">program_segmentation_flag</label>
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

                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">device_restrictions</span>
                        </div>
                        <input type="number" class="form-control" v-model="value.device_restrictions" />
                    </div>
                </div>

                <!--  set to 0 now
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">upid_type</span>
                    </div>
                    <input type="number" class="form-control" v-model="value.upid_type" />
                </div> -->
            </div>
        </div>
        <div class="col-4">
            <label class="input-group-text" for="descritor_type">segment_type</label>
        </div>
        <div class="col-8">
            <select class="form-select form-select" v-model="value.type_id">
                <option v-for="type, index in SEGMENTATION_TYPES_VAL" :key="index" :value="type">
                    {{ SEGMENTATION_TYPES[index] }}</option>
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
                    v.device_restrictions = 0;
                    // todo: component
                    v.duration = 0;
                    v.upid_type = 0;
                    // todo: upid
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
        rv.push(0x00);
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
                rv[offset] |= 0x20;
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

            if (data.duration_flag) {
                offset = rv.length;
                rv.push(0x00, 0x00, 0x00, 0x00, 0x00);
                rv[offset] |= (data.duration & 0xFF00000000) >>> 32;
                rv[offset + 1] |= (data.duration & 0xFF000000) >>> 24;
                rv[offset + 2] |= (data.duration & 0xFF0000) >>> 16;
                rv[offset + 3] |= (data.duration & 0xFF00) >>> 8;
                rv[offset + 4] |= (data.duration & 0xFF);
            }

            // upid type and length set to 0
            rv.push(0x00, 0x00);

            rv.push(data.type_id & 0xFF);
            rv.push(0x00, 0x00);

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