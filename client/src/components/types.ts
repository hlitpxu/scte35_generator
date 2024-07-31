
export enum COMMAND_TYPE {
	SPLICE_INSERT = 0x05,
	TIME_SIGNAL = 0x06,
}

export enum DESCRIPTOR_TYPE {
	SEGMENTATION_DESCIPTOR = 0x02,
}

export enum SEGMENTATION_TYPE_ID {
	NOT_INDICATED = 0x00,
	CONTENT_IDENTIFICATION = 0x01,
	PROGRAM_START = 0x10,
	PROGRAM_END = 0x11,
	PROGRAM_EARLY_TERMINATION = 0x12,
	PROGRAM_BREAKAWAY = 0x13,
	PROGRAM_RESUMPTION = 0x14,
	PROGRAM_RUNOVER_PLANNED = 0x15,
	PROGRAM_RUNOVER_UNPLANNED = 0x16,
	PROGRAM_OVERLAP_START = 0x17,
	PROGRAM_BLACKOUT_OVERRIDE = 0x18,
	PROGRAM_START_IN_PROGRESS = 0x19,
	CHAPTER_START = 0x20,
	CHAPTER_END = 0x21,
	BREAK_START = 0x22,
	BREAK_END = 0x23,
	OPENING_CREDIT_START = 0x24,
	OPENING_CREDIT_END = 0x25,
	CLOSING_CREDIT_START = 0x26,
	CLOSING_CREDIT_END = 0x27,
	PROVIDER_ADVERTISEMENT_START = 0x30,
	PROVIDER_ADVERTISEMENT_END = 0x31,
	DISTRIBUTOR_ADVERTISEMENT_START = 0x32,
	DISTRIBUTOR_ADVERTISEMENT_END = 0x33,
	PROVIDER_PLACEMENT_OPPORTUNITY_START = 0x34,
	PROVIDER_PLACEMENT_OPPORTUNITY_END = 0x35,
	DISTRIBUTOR_PLACEMENT_OPPORTUNITY_START = 0x36,
	DISTRIBUTOR_PLACEMENT_OPPORTUNITY_END = 0x37,
	PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY_START = 0x38,
	PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY_END = 0x39,
	DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY_START = 0x3A,
	DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY_END = 0x3B,
	UNSCHEDULED_EVENT_START = 0x40,
	UNSCHEDULED_EVENT_END = 0x41,
	NETWORK_START = 0x50,
	NETWORK_END = 0x51,
}

export enum SEGMENTATION_UPID_TYPE {
	NOT_USED = 0x00,
	USER_DEFINED = 0x01,
	ISCI = 0x02,
	AD_ID = 0x03,
	UMID = 0x04,
	ISAN_5 = 0x05,
	ISAN_6 = 0x06,
	TID = 0x07,
	TI = 0x08,
	ADI = 0x09,
	EIDR = 0x0A,
	ATSC_CONTENT_IDENTIFIER = 0x0B,
	MPU = 0x0C,
	MID = 0x0D,
	ADS_INFORMATION = 0x0E,
	URI = 0x0F,
}

export namespace SEGMENTATION_UPID_TYPE {
	const lenth_limit_map = new Map([
		[SEGMENTATION_UPID_TYPE.NOT_USED, 0],
		[SEGMENTATION_UPID_TYPE.USER_DEFINED, -1],
		[SEGMENTATION_UPID_TYPE.ISCI, 8],
		[SEGMENTATION_UPID_TYPE.AD_ID, 12],
		[SEGMENTATION_UPID_TYPE.UMID, 32],
		[SEGMENTATION_UPID_TYPE.ISAN_5, 8],
		[SEGMENTATION_UPID_TYPE.ISAN_6, 12],
		[SEGMENTATION_UPID_TYPE.TID, 12],
		[SEGMENTATION_UPID_TYPE.TI, 8],
		[SEGMENTATION_UPID_TYPE.ADI, -1],
		[SEGMENTATION_UPID_TYPE.EIDR, 12],
		[SEGMENTATION_UPID_TYPE.ATSC_CONTENT_IDENTIFIER, -1],
		[SEGMENTATION_UPID_TYPE.MPU, -1],
		[SEGMENTATION_UPID_TYPE.MID, -1],
		[SEGMENTATION_UPID_TYPE.ADS_INFORMATION, -1],
		[SEGMENTATION_UPID_TYPE.URI, -1],
	])
	export function lenth_limit(type: SEGMENTATION_UPID_TYPE): number | undefined {
		return lenth_limit_map.get(type)
	}
}

export enum DEVICE_RESTRICTION {
	GROUP_0 = 0,
	GROUP_1 = 1,
	GROUP_2 = 2,
	NONE = 3,
}