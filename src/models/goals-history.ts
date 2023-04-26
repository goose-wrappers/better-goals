import {Goal} from "./goal";

export interface GoalsIteration {
	startDate: string;
	endDate: string;
	goals: Array<Goal>;
}

export interface GoalsHistory {
	iterations: Array<GoalsIteration>;
}
