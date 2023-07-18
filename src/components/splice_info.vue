<script setup>
import { reactive, ref } from "vue";


const COMMAND_TYPES = {
    SPLICE_INSERT: "splice_insert",
    TIME_SIGNAL: "time_signal",
};

const DESCRIPTOR_TYPES = {
    SEGMENTATION_DESC: "segmentation_descriptor",
}

var enable_debug = ref(true);
var splice_info = reactive({
    splice_command: {
        type: COMMAND_TYPES.SPLICE_INSERT,
        data: {},
    },
    new_descriptor: {
        tag: DESCRIPTOR_TYPES.SEGMENTATION_DESC,
        data: {
            init: false,
        }
    },
    descriptors: [],
});
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
                        <option v-for="(type, index) in COMMAND_TYPES" :key="index" :value="type">
                            {{ COMMAND_TYPES[index] }}
                        </option>
                    </select>
                </div>
                <!-- command content -->
                <div v-if="splice_info.splice_command.type == COMMAND_TYPES.SPLICE_INSERT">
                    <SpliceInsert v-model="splice_info.splice_command.data" />
                </div>
            </div>
            <div class="col-6">
                <!-- select descriptor type -->
                <div class="input-group">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="descritor_type">Descriptor Tag</label>
                    </div>
                    <select class="custom-select" id="descritor_type" v-model="splice_info.new_descriptor.tag">
                        <option v-for="(type, index) in DESCRIPTOR_TYPES" :key="index" :value="type">
                            {{ DESCRIPTOR_TYPES[index] }}
                        </option>
                    </select>
                </div>

                <div>
                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
                        data-bs-target="#descriptorView" @click="splice_info.new_descriptor.data.init=false;sendDesc(splice_info.new_descriptor, true)">Add</button>
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
                                        {{ d.tag }}
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
            <div class="col">
                Ouput todo
            </div>
        </div>

        <!-- debug panel -->
        <div class="row">
            <hr />
            <div class="col-2">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" v-model="enable_debug">
                    <label class="custom-control-label">Debug</label>
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
                        <SegmentationDescriptor v-if="this.show_descriptor" v-model="this.descriptor.data" />
                    </div>
                    <div class="modal-footer">
                        <button v-if="this.is_create" type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            @click="splice_info.descriptors.push(JSON.parse(JSON.stringify(this.descriptor)))">Create</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SpliceInsert from "./splice_insert.vue"
import SegmentationDescriptor from "./seg_descriptor.vue"
export default {
    name: "SpliceInfo",
    components: {
        SpliceInsert,
        SegmentationDescriptor,
    },
    data: function () {
        return {
            is_create: false,
            show_descriptor: false,
            descriptor: {},
        };
    },
    methods: {
        sendDesc(d, is_create = false) {
            this.is_create = is_create;
            this.show_descriptor = true;
            this.descriptor = d;
        }
    }
};
</script>

<style scoped>
.scrollable {
    max-height: 300px;
    overflow: auto;
}
</style>