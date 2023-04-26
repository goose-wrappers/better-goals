import {LoggerService} from "./logger-service";

export class IterationDurationUtils {

	private static DAYS_IN_A_WEEK = 7;
	private static SECONDS_IN_A_DAY = 86400;

	public static daysUntilIterationEnds(now: Date, iteration_start_date: string, iteration_length_weeks: number): number {
		// we add one more day minus one second, so two weeks is 14 days and not 13 days
		const iterationEndTime = this.iterationEndDate(iteration_start_date, iteration_length_weeks);
		const secondsUntilEnd = +iterationEndTime - (+new Date());
		LoggerService.log("Seconds until end of iteration: " + secondsUntilEnd);
		return Math.floor(secondsUntilEnd / 1000 / 86400);
	}

	public static iterationEndDate(iteration_start_date: string, iteration_length_weeks: number): Date {
		const ts = +new Date(iteration_start_date) + this.SECONDS_IN_A_DAY * 1000 * ((this.DAYS_IN_A_WEEK + 1) * iteration_length_weeks) - 1;
		return new Date(ts);
	}

}
