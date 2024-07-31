<script setup>
import { reactive, ref } from "vue";
import crc32mpeg2 from 'crc/calculators/crc32mpeg2';
import {
    COMMAND_TYPE,
    DESCRIPTOR_TYPE,
    SEGMENTATION_TYPE_ID,
} from './types.ts';

var enable_debug = ref(false);
var splice_info = reactive({
    splice_command: {
        type: COMMAND_TYPE.SPLICE_INSERT,
        data: {},
    },
    new_descriptor: {
        tag: DESCRIPTOR_TYPE.SEGMENTATION_DESCIPTOR,
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

const generatedData = reactive({
    binary_str: "",
    binary_base64: "",
});


function get_binary(data) {
    var binary = [0xFC, 0x30, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xF0, 0x00];
    var offset = 0;

    // command part
    binary.push(data.splice_command.type);
    var splice_command_length = 0;
    var result = [];
    switch (data.splice_command.type) {
        case COMMAND_TYPE.SPLICE_INSERT:
            result = SpliceInsert.get_binary(data.splice_command.data);
            splice_command_length = result.length;
            binary.push(...result);
            break;
        case COMMAND_TYPE.TIME_SIGNAL:
            result = TimeSignal.get_binary(data.splice_command.data);
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
            case DESCRIPTOR_TYPE.SEGMENTATION_DESCIPTOR:
                result = SegmentationDescriptor.get_binary(d.data);
                desc_length += result.length;
                binary.push(...result);
                break;
            default:
                break;
        }
    }
    binary[offset] |= (desc_length & 0xFF00) >>> 8;
    binary[offset + 1] |= (desc_length & 0xFF);

    // section length
    var section_length = binary.length + 1;
    binary[1] |= (section_length & 0x0F00) >>> 8;
    binary[2] |= (section_length & 0xFF);

    // tail
    offset = binary.length;
    var crc_val = crc32mpeg2(binary) >>> 0;
    splice_info.crc = crc_val;
    binary.push(0x00, 0x00, 0x00, 0x00);
    binary[offset] |= (crc_val & 0xFF000000) >>> 24;
    binary[offset + 1] |= (crc_val & 0xFF0000) >>> 16;
    binary[offset + 2] |= (crc_val & 0xFF00) >>> 8;
    binary[offset + 3] |= (crc_val & 0xFF);

    generatedData.binary_str = to_hex_str(binary);
    generatedData.binary_base64 = btoa(String.fromCharCode.apply(binary, binary)).replace(/.{76}(?=.)/g, '$&\n');
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
        <br>
        <h5 style="text-align: center;">Scte35 Generator</h5>
        <div class="row">
            <!-- Command -->
            <div class="col-12 col-lg-6">
                <!-- select command type -->
                <div class="border rounded display-block">
                    <div class="row">
                        <div class="col-4">
                            <label class="input-group-text" for="command type">Command Type</label>
                        </div>
                        <div class="col-8">
                            <select class="form-select form-select" v-model="splice_info.splice_command.type">
                                <option v-for="type, index in Object.keys(COMMAND_TYPE).filter(key => isNaN(Number(key)))"
                                    :key="index" :value="COMMAND_TYPE[type]">
                                    {{ type.toLowerCase() }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <!-- command content -->
                    <div v-if="splice_info.splice_command.type == COMMAND_TYPE.SPLICE_INSERT">
                        <hr />
                        <SpliceInsert v-model="splice_info.splice_command.data" />
                    </div>
                    <div v-else-if="splice_info.splice_command.type == COMMAND_TYPE.TIME_SIGNAL">
                        <hr />
                        <TimeSignal v-model="splice_info.splice_command.data" />
                    </div>
                </div>
            </div>

            <!-- Descriptor -->
            <div class="col-12 col-lg-6">
                <!-- select descriptor type -->
                <div class="border rounded display-block">
                    <div class="row">
                        <div class="col-4">
                            <label class="input-group-text" for="descritor_type">Descriptor Tag</label>
                        </div>
                        <div class="col-6">
                            <select class="form-select form-select" v-model="splice_info.new_descriptor.tag">
                                <option
                                    v-for="type, index in Object.keys(DESCRIPTOR_TYPE).filter(key => isNaN(Number(key)))"
                                    :key="index" :value="DESCRIPTOR_TYPE[type]">
                                    {{ type.toLowerCase() }}</option>
                            </select>
                        </div>

                        <div class="col-2">
                            <div>
                                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
                                    data-bs-target="#descriptorView"
                                    @click="splice_info.new_descriptor.data.init = false; sendDesc(splice_info.new_descriptor, true)">Add</button>
                            </div>
                        </div>
                    </div>

                    <!-- decriptor display -->
                    <hr />
                    <div class="table-responsive scrollable">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="position: sticky; top:0;">Descriptor</th>
                                    <th style="position: sticky; top:0;">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(d, i) in splice_info.descriptors" :key="i">
                                    <td>
                                        <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal"
                                            data-bs-target="#descriptorView" @click="sendDesc(splice_info.descriptors[i])"
                                            style="text-align: left;">
                                            {{ DESCRIPTOR_TYPE[d.tag] }}
                                            <br />
                                            <div style="margin-left: 10px; text-align: left;">
                                                <div v-if="d.tag == DESCRIPTOR_TYPE.SEGMENTATION_DESCIPTOR">
                                                    type_id: {{ SEGMENTATION_TYPE_ID[d.data.type_id] }}
                                                    <br />
                                                    duraion: {{ d.data.duration }}
                                                </div>
                                            </div>
                                        </button>

                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-outline-danger btn-sm"
                                            @click="splice_info.descriptors.splice(i, 1)">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- SCTE35 output -->
            <div class="col-12">
                <div class="border rounded display-block">
                    <div class="row gy-2">
                        <div class="col-12">
                            <div>
                                <button type="button" class="btn btn-outline-primary btn-lg"
                                    @click="get_binary(splice_info)">Generate
                                    SCTE35</button>
                            </div>
                        </div>

                        <div class="col-4 col-md-4 col-xl-2">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">SCTE35 Binary</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-5 col-md-6 col-xl-9">
                            <textarea class="form-control" aria-label="With textarea" rows="2"
                                v-model="generatedData.binary_str" disabled></textarea>
                        </div>
                        <div class="col-3 col-md-2 col-xl-1">
                            <button type="button" class="btn btn-outline-primary"
                                @click="copy_to_clipboard(generatedData.binary_str)">Copy</button>
                        </div>

                        <div class="col-4 col-md-4 col-xl-2">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">SCTE35 Base64</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-5 col-md-6 col-xl-9">
                            <textarea class="form-control" aria-label="With textarea" rows=""
                                v-model="generatedData.binary_base64" disabled></textarea>
                        </div>
                        <div class="col-3 col-md-2 col-xl-1">
                            <button type="button" class="btn btn-outline-primary"
                                @click="copy_to_clipboard(generatedData.binary_base64)">Copy</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ESAM OOB -->
            <div v-if="false" class="col-12">
                <div class="border rounded display-block">
                    <EsamOobPlayer v-model="generatedData" />
                </div>
            </div>

            <!-- debug panel -->
            <div v-if="false" class="col-12">
                <div class="border rounded display-block">
                    <div class="col-2">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" v-model="enable_debug">
                            <label class="form-check-label">debug</label>
                        </div>
                    </div>
                    <div class="col-8">
                        <div v-show="enable_debug">
                            <pre>{{ splice_info }}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="d-flex flex-wrap justify-content-between align-items-center py-1 my-5 border-top">
            <div class="col-md-4 d-flex align-items-center">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github"
                        viewBox="0 0 16 16">
                        <path
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                </span>
                <span class="mx-1">
                    <a href="https://github.com/hlitpxu/scte35_generator"
                        class="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">hlitpxu/scte35_generator</a>
                </span>
            </div>
        </footer>

        <!-- Decriptor modal -->
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
import EsamOobPlayer from './esam_oob_player.vue';
export default {
    name: "SpliceInfo",
    components: {
        SpliceInsert,
        TimeSignal,
        SegmentationDescriptor,
        EsamOobPlayer,
    },
};
</script>
