<script setup>
import { reactive, ref } from 'vue';

const TIME_MODE = {
    ABSOLUTE: 0,
    RELATIVE: 1,
};

const TIME_MODE_TO_STR = {
    0: "utc",
    1: "from_now",
};

const ESAM_OOB_TEMPLATE = `<?xml version="1.0"?>  
<ns2:SignalProcessingNotification acquisitionPointIdentity="REPLACE_ACQ_ID"
	xmlns="urn:cablelabs:md:xsd:core:3.0"
	xmlns:ns2="urn:cablelabs:iptvservices:esam:xsd:signal:1"
	xmlns:ns3="urn:cablelabs:md:xsd:content:3.0"
	xmlns:ns5="urn:cablelabs:iptvservices:esam:xsd:common:1"
	xmlns:sig="urn:cablelabs:md:xsd:signaling:3.0">
	<ns5:StatusCode classCode="0" />
	<ns2:ResponseSignal acquisitionPointIdentity="REPLACE_ACQ_ID" acquisitionSignalID="uyg9LWOMSW-Lm-l_7is1WA"
        action="create" signalPointID="PV19JDLZREi8qxrMi2iceA">
		<sig:UTCPoint utcPoint="REPLACE_TIME" />
		<sig:BinaryData signalType="SCTE35">REPLACTE_BINARY</sig:BinaryData>
	</ns2:ResponseSignal>
</ns2:SignalProcessingNotification>
`;
const xml_template = ref("");
xml_template.value = ESAM_OOB_TEMPLATE;

var oob_request = reactive({
    ip: "198.18.12.151",
    port: 8088,
    acq_id: "VOSTEST1",
    time_mode: TIME_MODE.ABSOLUTE,
    from_now: 10,
    utc_date: new Date(),
});

function sendOobRequest(base64str) {
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

    var xml = xml_template.value;
    xml = xml.replaceAll("REPLACE_TIME", utc_time_str);
    xml = xml.replaceAll("REPLACTE_BINARY", binary_str);
    xml = xml.replaceAll("REPLACE_ACQ_ID", acq_id);

    console.log("send to ", url, "oob request", xml);

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/xml',
        },
        body: xml,
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .catch(e => console.log(e));

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
        </div>

        <div class="col-12 col-lg-6">
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

            <div class="input-group">
                <button type="button" class="btn btn-outline-primary" @click="sendOobRequest(modelValue.binary_base64)">
                    Send
                </button>
            </div>
        </div>
    </div>

    <div class="row input-group">
        <div class="col">
            <span>XML Template</span>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <prism-editor class="my-editor prism-editor-wrapper border rounded" v-model="xml_template"
                :highlight="highlighter" language="xml" lineNumbers readonly></prism-editor>
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