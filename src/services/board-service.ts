import {DatastoreService} from "./datastore-service";
import {AddonConfiguration} from "../models/addon-configuration";
import {GoalsHistory} from "../models/goals-history";
import {DateUtils} from "./date-utils";

export class BoardService {

	public constructor(private datastoreService: DatastoreService) {
	}

	private emptyGoalHistory(): GoalsHistory {
		return {
			iterations: [],
		};
	}

	private emptyConfiguration(): AddonConfiguration {
		return {
			version: 1,
			goals: [],
			iterationLengthWeeks: 1,
			iterationStartDate: DateUtils.getDateAsIso(),
		};
	}

	public getGoalHistory(): Promise<GoalsHistory> {
		return new Promise((resolve) => {
			this.datastoreService.getGoalHistory()
				.then(resolve)
				.catch(() => resolve(this.emptyGoalHistory()));
		});
	}

	public saveGoalHistory(goalHistory: GoalsHistory): Promise<GoalsHistory> {
		return this.datastoreService.saveGoalHistory(goalHistory);
	}

	public getConfiguration(): Promise<AddonConfiguration> {
		return new Promise((resolve) => {
			this.datastoreService.getConfiguration()
				.then(resolve)
				.catch(() => resolve(this.emptyConfiguration()));
		});
	}

	public saveConfiguration(configuration: AddonConfiguration): Promise<void> {
		return this.datastoreService.saveConfiguration(configuration);
	}
}
