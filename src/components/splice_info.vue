<script setup>
import { reactive, ref } from "vue";
import crc32mpeg2 from 'crc/calculators/crc32mpeg2';

const COMMAND_TYPES = {
    SPLICE_INSERT: "splice_insert",
    TIME_SIGNAL: "time_signal",
};

const COMMAND_TYPES_VAL = {
    SPLICE_INSERT: 0x05,
    TIME_SIGNAL: 0x06,
};

const DESCRIPTOR_TYPES_VAL = {
    SEGMENTATION_DESC: 0x02,
};

const DESCRIPTOR_VAL_TO_STR = {
    2: "segmentation_descriptor",
}

var enable_debug = ref(true);
var splice_info = reactive({
    splice_command: {
        type: COMMAND_TYPES_VAL.TIME_SIGNAL,
        data: {},
    },
    new_descriptor: {
        tag: DESCRIPTOR_TYPES_VAL.SEGMENTATION_DESC,
        data: {
            init: false,
        }
    },
    descriptors: [],
});

var display_descriptor = reactive({
    is_create: false,
    show_descriptor: false,
    descriptor: {},
});
function sendDesc(d, is_create = false) {
    display_descriptor.is_create = is_create;
    display_descriptor.show_descriptor = true;
    display_descriptor.descriptor = d;
}

function to_hex_str(bytes) {
    return Array.from(bytes, (byte) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
}

const binary_str = ref("");
const binary_base64 = ref("");

function get_binary(data) {
    var binary = [0xFC, 0x0F, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    var offset = 0;

    // command part
    binary.push(data.splice_command.type);
    var splice_command_length = 0;
    switch (data.splice_command.type) {
        case COMMAND_TYPES_VAL.SPLICE_INSERT:
            break;
        case COMMAND_TYPES_VAL.TIME_SIGNAL:
            var result = TimeSignal.get_time_signal_binary(data.splice_command.data);
            splice_command_length = result.length;
            binary.push(...result);
            break;
        default:
            break;
    }
    binary[11] |= (splice_command_length & 0xF00) >> 8;
    binary[12] |= (splice_command_length & 0xFF);

    // descriptor part
    offset = binary.length;
    binary.push(0x00, 0x00);
    var desc_length = 0;
    for (var i = 0; i < data.descriptors.length; ++i) {
        var d = data.descriptors[i];
        switch (d.tag) {
            case DESCRIPTOR_TYPES_VAL.SEGMENTATION_DESC:
                result = SegmentationDescriptor.get_seg_descriptor_binary(d.data);
                desc_length += result.length;
                binary.push(...result);
                break;
            default:
                break;
        }
    }
    binary[offset] |= (desc_length & 0xFF00) >>> 8;
    binary[offset + 1] |= (desc_length & 0xFF);

    // tail
    offset = binary.length;
    var crc_val = crc32mpeg2(binary) >>> 0;
    splice_info.crc = crc_val;
    binary.push(0x00, 0x00, 0x00, 0x00);
    binary[offset] |= (crc_val & 0xFF000000) >>> 24;
    binary[offset + 1] |= (crc_val & 0xFF0000) >>> 16;
    binary[offset + 2] |= (crc_val & 0xFF00) >>> 8;
    binary[offset + 3] |= (crc_val & 0xFF);

    var section_length = binary.length - 2;
    binary[1] |= (section_length & 0x0F00) >>> 8;
    binary[2] |= (section_length & 0xFF);

    binary_str.value = to_hex_str(binary);
    binary_base64.value = btoa(String.fromCharCode.apply(binary, binary)).replace(/.{76}(?=.)/g, '$&\n');
}

function copy_to_clipboard(text) {
    if (!navigator.clipboard) {
        var copyhelper = document.createElement("input");
        copyhelper.className = 'copyhelper'
        document.body.appendChild(copyhelper);
        copyhelper.value = text;
        copyhelper.select();
        document.execCommand("copy");
        document.body.removeChild(copyhelper);
    } else {
        navigator.clipboard.writeText(text);
    }
}
</script>

<template>
    <div class="container">
        <h5>Splice Info</h5>
        <div class="row">
            <div class="col-6">
                <!-- select command type -->
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="select_command">Command</label>
                    </div>
                    <select class="custom-select" id="select_command" v-model="splice_info.splice_command.type">
                        <option v-for="(type, index) in COMMAND_TYPES" :key="index" :value="COMMAND_TYPES_VAL[index]">
                            {{ COMMAND_TYPES[index] }}
                        </option>
                    </select>
                </div>
                <!-- command content -->
                <div v-if="splice_info.splice_command.type == COMMAND_TYPES_VAL.SPLICE_INSERT">
                    <hr />
                    <SpliceInsert v-model="splice_info.splice_command.data" />
                </div>
                <div v-else-if="splice_info.splice_command.type == COMMAND_TYPES_VAL.TIME_SIGNAL">
                    <hr />
                    <TimeSignal v-model="splice_info.splice_command.data" />
                </div>
            </div>
            <div class="col-6">
                <!-- select descriptor type -->
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="descritor_type">Descriptor Tag</label>
                    </div>
                    <select class="custom-select" id="descritor_type" v-model="splice_info.new_descriptor.tag">
                        <option v-for="(type, index) in DESCRIPTOR_TYPES_VAL" :key="index" :value="type">
                            {{ DESCRIPTOR_VAL_TO_STR[type] }}
                        </option>
                    </select>
                </div>

                <div>
                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
                        data-bs-target="#descriptorView"
                        @click="splice_info.new_descriptor.data.init = false; sendDesc(splice_info.new_descriptor, true)">Add</button>
                </div>

                <!-- decriptor display -->
                <div class="table-responsive scrollable">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Descriptor Tag</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(d, i) in splice_info.descriptors" :key="i">
                                <td>
                                    <button type="button" class="btn btn-primary" data-bs-toggle="modal"
                                        data-bs-target="#descriptorView" @click="sendDesc(splice_info.descriptors[i])">
                                        {{ DESCRIPTOR_VAL_TO_STR[d.tag] }}
                                    </button>

                                </td>
                                <td>
                                    <button type="button" class="btn btn-outline-danger"
                                        @click="splice_info.descriptors.splice(i, 1)">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <br />
        <div class="row">
            <hr />
            <div class="row">
                <div>
                    <button type="button" class="btn btn-outline-primary" @click="get_binary(splice_info)">Generate
                        SCTE35</button>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">SCTE35 Binary</span>
                        </div>
                        <textarea class="form-control" aria-label="With textarea" rows="1" v-model="binary_str"
                            disabled></textarea>
                    </div>
                </div>
                <div class="col-1">
                    <button type="button" class="btn btn-outline-primary"
                        @click="copy_to_clipboard(binary_str)">Copy</button>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">SCTE35 Base64</span>
                        </div>
                        <textarea class="form-control" aria-label="With textarea" rows="1" v-model="binary_base64"
                            disabled></textarea>
                    </div>
                </div>
                <div class="col-1">
                    <button type="button" class="btn btn-outline-primary"
                        @click="copy_to_clipboard(binary_base64)">Copy</button>
                </div>
            </div>
        </div>

        <!-- debug panel -->
        <div class="row">
            <hr />
            <div class="col-3">
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" v-model="enable_debug">
                    <label class="form-check-label">debug</label>
                </div>
            </div>
            <div class="col">
                <div v-show="enable_debug">
                    {{ splice_info }}
                </div>
            </div>
        </div>


        <div class="modal fade" id="descriptorView" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Descriptor</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <SegmentationDescriptor v-if="display_descriptor.show_descriptor"
                            v-model="display_descriptor.descriptor.data" />
                    </div>
                    <div class="modal-footer">
                        <button v-if="display_descriptor.is_create" type="button" class="btn btn-primary"
                            data-bs-dismiss="modal"
                            @click="splice_info.descriptors.push(JSON.parse(JSON.stringify(display_descriptor.descriptor)))">Create</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SpliceInsert from "./splice_insert.vue"
import TimeSignal from "./time_signal.vue"
import SegmentationDescriptor from "./seg_descriptor.vue"
export default {
    name: "SpliceInfo",
    components: {
        SpliceInsert,
        TimeSignal,
        SegmentationDescriptor,
    },
};
</script>

<style scoped>
.scrollable {
    max-height: 300px;
    overflow: auto;
}
</style>