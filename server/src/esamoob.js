const ESAM_OOB_TEMPLATE = `<?xml version="1.0"?>  
<ns2:SignalProcessingNotification acquisitionPointIdentity="REPLACE_ACQ_ID"
	xmlns="urn:cablelabs:md:xsd:core:3.0"
	xmlns:ns2="urn:cablelabs:iptvservices:esam:xsd:signal:1"
	xmlns:ns3="urn:cablelabs:md:xsd:content:3.0"
	xmlns:ns5="urn:cablelabs:iptvservices:esam:xsd:common:1"
	xmlns:sig="urn:cablelabs:md:xsd:signaling:3.0">
	<ns5:StatusCode classCode="0" />
	REPLACE_RESPONSE_SIGNAL
</ns2:SignalProcessingNotification>
`;

const SCTE35_TEMPLATE = `
<ns2:ResponseSignal acquisitionPointIdentity="REPLACE_ACQ_ID" acquisitionSignalID="uyg9LWOMSW-Lm-l_7is1WA"
	action="create" signalPointID="PV19JDLZREi8qxrMi2iceA">
	<sig:UTCPoint utcPoint="REPLACE_TIME" />
	<sig:BinaryData signalType="SCTE35">REPLACE_BINARY</sig:BinaryData>
</ns2:ResponseSignal>
`;

function make_esam_request(acq_id, utc_time, scte35_binary) {
	var scte35_signal = SCTE35_TEMPLATE
		.replaceAll("REPLACE_TIME", utc_time)
		.replaceAll("REPLACE_BINARY", scte35_binary);
	var reponse_signal = scte35_signal;
	var esam_request = ESAM_OOB_TEMPLATE
		.replaceAll("REPLACE_RESPONSE_SIGNAL", reponse_signal)
		.replaceAll("REPLACE_ACQ_ID", acq_id);

	console.log(esam_request);
	return esam_request;
}

module.exports = {
	make_esam_request,
};