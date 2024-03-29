import { isReactive, toDisplayString } from "vue";

// splice command type
export const COMMAND_TYPES_VAL = {
	SPLICE_INSERT: 0x05,
	TIME_SIGNAL: 0x06,
};
export const COMMAND_TYPES_VAL_TO_STR = {
	0x05: "splice_insert",
	0x06: "time_signal",
}
export const COMMAND_TYPES = {
	SPLICE_INSERT: "splice_insert",
	TIME_SIGNAL: "time_signal",
};


// descriptor type 
export const DESCRIPTOR_TYPES_VAL = {
	SEGMENTATION_DESC: 0x02,
};

export const DESCRIPTOR_VAL_TO_STR = {
	2: "segmentation_descriptor",
}


// segmentation descriptor type id
export const SEGMENTATION_TYPES_VAL = {
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
export const SEGMENTATION_TYPES = {
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
export const SEGMENTATION_TYPES_VAL_TO_STR = {
	0x00: "not_indicated",
	0x01: "content_identification",
	0x10: "program_start",
	0x11: "program_end",
	0x12: "program_early_termination",
	0x13: "program_breakaway",
	0x14: "program_resumption",
	0x15: "program_runover_planned",
	0x16: "program_runover_unplanned",
	0x17: "program_overlap_start",
	0x18: "program_blackout_override",
	0x19: "program_start_in_progress",
	0x20: "chapter_start",
	0x21: "chapter_end",
	0x22: "break_start",
	0x23: "break_end",
	0x24: "opening_credit_start",
	0x25: "opening_credit_end",
	0x26: "closing_credit_start",
	0x27: "closing_credit_end",
	0x30: "provider_advertisement_start",
	0x31: "provider_advertisement_end",
	0x32: "distributor_advertisement_start",
	0x33: "distributor_advertisement_end",
	0x34: "provider_placement_opportunity_start",
	0x35: "provider_placement_opportunity_end",
	0x36: "distributor_placement_opportunity_start",
	0x37: "distributor_placement_opportunity_end",
	0x38: "provider_overlay_placement_opportunity_start",
	0x39: "provider_overlay_placement_opportunity_end",
	0x3A: "distributor_overlay_placement_opportunity_start",
	0x3B: "distributor_overlay_placement_opportunity_end",
	0x40: "unscheduled_event_start",
	0x41: "unscheduled_event_end",
	0x50: "network_start",
	0x51: "network_end",
};

// segmentation descriptor upid type
export const SEGMENTATION_UPID_TYPES_VAL = {
	NOT_USED: 0x00,
	USER_DEFINED: 0x01,
	ISCI: 0x02,
	AD_ID: 0x03,
	UMID: 0x04,
	ISAN_5: 0x05,
	ISAN_6: 0x06,
	TID: 0x07,
	TI: 0x08,
	ADI: 0x09,
	EIDR: 0x0A,
	ATSC_CONTENT_IDENTIFIER: 0x0B,
	MPU: 0x0C,
	MID: 0x0D,
	ADS_INFORMATION: 0x0E,
	URI: 0x0F,
};

export const SEGMENTATION_UPID_TYPES_VAL_TO_STR = {
	0x00: "not_used",
	0x01: "user_defined",
	0x02: "isci",
	0x03: "ad_id",
	0x04: "umid",
	0x05: "isan_5",
	0x06: "isan_6",
	0x07: "tid",
	0x08: "ti",
	0x09: "adi",
	0x0A: "eidr",
	0x0B: "atsc_content_identifier",
	0x0C: "mpu",
	0x0D: "mid",
	0x0E: "ads_information",
	0x0F: "uri",
};

export const SEGMENTATION_UPID_TYPES_VAL_TO_LEN = {
	0x00: 0,
	0x01: -1,
	0x02: 8,
	0x03: 12,
	0x04: 32,
	0x05: 8,
	0x06: 12,
	0x07: 12,
	0x08: 8,
	0x09: -1,
	0x0A: 12,
	0x0B: -1,
	0x0C: -1,
	0x0D: -1,
	0x0E: -1,
	0x0F: -1,
};

// device restriction
export const DEVICE_RESTRICTION_VAL = {
	GROUP_0: 0,
	GROUP_1: 1,
	GROUP_2: 2,
	NONE: 3,
};

export const DEVICE_RESTRICTION_VAL_TO_STR = {
	0: "group 0",
	1: "group 1",
	2: "group 2",
	3: "none",
};