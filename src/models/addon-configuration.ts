import {Goal} from "./goal";

export interface AddonConfiguration {
	version: number; // for future upgrades of the schema
	goals: Array<Goal>;
	iterationLengthWeeks: number; // 1,2,3,4 or 0 if unset
	iterationStartDate: string; // yyyy-mm-dd
}
