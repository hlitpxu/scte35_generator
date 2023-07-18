<script setup>
import { reactive, ref } from "vue";

const COMMAND_TYPES = {
    SPLICE_INSERT: 0x05,
    TIME_SIGNAL: 0x06,
};
const COMMAND_TYPES_STR = {
    SPLICE_INSERT: "splice_insert",
    TIME_SIGNAL: "time_signal",
};

var enable_debug = ref(true);
var splice_info = reactive({
    command: COMMAND_TYPES.SPLICE_INSERT,
    splice_insert: reactive({
        inputs: {
            event_id: 1,
        },
        flags: {
            splice_cancel: false,
        },
        optional: {
            inputs: {
                program_id: 1,
            },
            flags: {
                out_of_network: false,
                duration: false,
                splice_immediate: false,
            },
            program_splice: true,
            splice_time: {
                time_specified: false,
                pts_time: 0,
            },
            break_duration: {
                auto_return: false,
                duration: 0,
            },

        }
    }),
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
                    <select class="custom-select" id="select_command" v-model="splice_info.command">
                        <option v-for="(type, index) in COMMAND_TYPES" :key="index" :value="type">
                            {{ COMMAND_TYPES_STR[index] }}
                        </option>
                    </select>
                </div>
                <!-- command content -->
                <div v-if="splice_info.command == COMMAND_TYPES.SPLICE_INSERT">
                    <SpliceInsert v-model="splice_info.splice_insert" />
                </div>
            </div>
            <div class="col-6">Descriptors todo</div>
        </div>


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
    </div>
</template>

<script>
import SpliceInsert from "./splice_insert.vue"
export default {
    name: "SpliceInfo",
    components: {
        SpliceInsert,
    },
};
</script>