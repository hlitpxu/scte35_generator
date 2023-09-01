<script setup>
import { reactive } from 'vue';
import esamService from '@/services/Esam.js'

const TIME_MODE = {
    ABSOLUTE: 0,
    RELATIVE: 1,
};

const TIME_MODE_TO_STR = {
    0: "utc",
    1: "from_now",
};

var esam_request_response = reactive({
    has_data: false,
    data: {},
    has_esam_command: false,
    esam_command: "",
});

var oob_request = reactive({
    ip: "198.18.12.151",
    port: 8088,
    acq_id: "VOSTEST1",
    time_mode: TIME_MODE.RELATIVE,
    from_now: 10,
    utc_date: new Date(),
});

var waitForResponse = false;
async function sendOobRequest(base64str) {
    esam_request_response.has_data = false;

    var utc_time = new Date();
    switch (oob_request.time_mode) {
        case TIME_MODE.ABSOLUTE:
            utc_time = oob_request.utc_date;
            break;
        case TIME_MODE.RELATIVE:
            utc_time.setSeconds(utc_time.getSeconds() + oob_request.from_now);
            break;
    }
    const utc_time_str = utc_time.toISOString();
    const binary_str = base64str;
    const acq_id = oob_request.acq_id;
    const url = "http://" + oob_request.ip + ":" + oob_request.port.toString() + "/";

    try {
        waitForResponse = true;
        var response = await esamService.post({
            url: url,
            method: "POST",
            utc_time: utc_time_str,
            scte35_binary: binary_str,
            acq_id: acq_id,
        });
        console.log(response);

        esam_request_response.has_data = true;
        esam_request_response.data = response.data.server_response;

        esam_request_response.has_esam_command = true;
        esam_request_response.esam_command = response.data.esam_command;
    } catch (e) {
        console.log(e);
    } finally {
        waitForResponse = false;
    }
}

</script>

<template>
    <div class="row">
        <div class="col">
            <h6 style="text-align: center;">ESAM OOB Sender</h6>
        </div>
    </div>

    <div class="row">
        <div class="col-12 col-lg-6">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">IP</span>
                </div>
                <input type="text" class="form-control" v-model="oob_request.ip" />
            </div>

            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">port</span>
                </div>
                <input type="text" class="form-control" v-model="oob_request.port" />
            </div>

            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">acq_id</span>
                </div>
                <input type="text" class="form-control" v-model="oob_request.acq_id" />
            </div>

            <div class="input-group">
                <div class="col-5">
                    <label class="input-group-text" for="descritor_type">time mode</label>
                </div>
                <div class="col-7">
                    <select class="form-select form-select" v-model="oob_request.time_mode">
                        <option v-for="val, index in TIME_MODE" :key="index" :value="val">
                            {{ TIME_MODE_TO_STR[val] }}</option>
                    </select>
                </div>
            </div>

            <div class="input-group">
                <div v-if="oob_request.time_mode == TIME_MODE.ABSOLUTE">
                    <VueDatePicker v-model="oob_request.utc_date" timezone="UTC" enable-seconds text-input vertical />
                </div>
                <div class="input-group" v-else-if="oob_request.time_mode == TIME_MODE.RELATIVE">
                    <div class="input-group-prepend">
                        <span class="input-group-text">sec_from_now</span>
                    </div>
                    <input type="number" class="form-control" v-model="oob_request.from_now" />
                </div>
            </div>
        </div>

        <div class="col-12 col-lg-6">
            <div class="input-group">
                <button type="button" class="btn btn-outline-primary" @click="sendOobRequest(modelValue.binary_base64)" :disabled="waitForResponse">
                    Send ESAM Request
                </button>
            </div>

            <div class="border rounded" style="margin-top: 10px; min-height: 150px;">
                <pre v-if="esam_request_response.has_data">{{ esam_request_response.data }}</pre>
            </div>
        </div>
    </div>

    <div v-if="esam_request_response.has_esam_command">
        <div class="row input-group">
            <div class="col" style="text-align: center;">
                <span>ESAM Command</span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <prism-editor class="my-editor prism-editor-wrapper border rounded"
                    v-model="esam_request_response.esam_command" :highlight="highlighter" language="xml" lineNumbers
                    readonly></prism-editor>
            </div>
        </div>
    </div>
</template>
    
<script>

// import Prism Editor
import { PrismEditor } from 'vue-prism-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';
import 'vue-prism-editor/dist/prismeditor.min.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    name: "EsamOobPlayer",
    components: {
        PrismEditor,
        VueDatePicker,
    },
    props: {
        modelValue: Object,
    },
    methods: {
        highlighter(code) {
            return highlight(code, languages.xml, "xml");
        }
    }
};
</script>

<style>
.my-editor {
    background-color: #fafafa;
    max-height: 350px;
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px 10px;
}

.prism-editor-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    overflow: auto;
    -o-tab-size: 1.5em;
    tab-size: 1.5em;
    -moz-tab-size: 1.5em;
}

.input-group {
    margin-top: 5px;
}
</style>