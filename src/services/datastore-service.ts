import {AddonConfiguration} from "../models/addon-configuration";
import {ProjectProperties} from "./project-properties";
import {GoalsHistory} from "../models/goals-history";

export class DatastoreService {

	private projectProperties: ProjectProperties;

	public constructor(private projectKey: string, private boardId: string) {
		this.projectProperties = new ProjectProperties(projectKey);
	}

	public saveGoalHistory(goalsHistory: GoalsHistory): Promise<GoalsHistory> {
		return this.projectProperties.putProperty(`goal_history_${this.boardId}`, goalsHistory);
	}

	public getGoalHistory(): Promise<GoalsHistory> {
		return this.projectProperties.getProperty<GoalsHistory>(`goal_history_${this.boardId}`);
	}

	public saveConfiguration(configuration: AddonConfiguration): Promise<void> {
		return this.projectProperties.putProperty(`config_${this.boardId}`, configuration);
	}

	public getConfiguration(): Promise<AddonConfiguration> {
		return this.projectProperties.getProperty<AddonConfiguration>(`config_${this.boardId}`);
	}

	public deleteGoalHistory(): Promise<void> {
		return this.projectProperties.deleteProperty(`goal_history_${this.boardId}`);
	}

	public deleteConfiguration(): Promise<void> {
		return this.projectProperties.deleteProperty(`config_${this.boardId}`);
	}
}
