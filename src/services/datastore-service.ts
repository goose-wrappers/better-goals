import {AddonConfiguration} from "../models/addon-configuration";
import {GoalsHistory} from "../models/goals-history";
import {AtlassianResponse} from "./atlassian-response";
import {AddonProperties} from "./addon-properties";

export class DatastoreService {

	public constructor(private addonProperties: AddonProperties, private projectKey: string, private boardId: string) {
	}

	public saveGoalHistory(goalsHistory: GoalsHistory): Promise<AtlassianResponse> {
		return this.addonProperties.putProperty(`goal_history_${this.projectKey}_${this.boardId}`, goalsHistory);
	}

	public getGoalHistory(): Promise<GoalsHistory> {
		return this.addonProperties.getProperty<GoalsHistory>(`goal_history_${this.projectKey}_${this.boardId}`);
	}

	public saveConfiguration(configuration: AddonConfiguration): Promise<AtlassianResponse> {
		return this.addonProperties.putProperty(`config_${this.projectKey}_${this.boardId}`, configuration);
	}

	public getConfiguration(): Promise<AddonConfiguration> {
		return this.addonProperties.getProperty<AddonConfiguration>(`config_${this.projectKey}_${this.boardId}`);
	}

	public deleteGoalHistory(): Promise<AtlassianResponse> {
		return this.addonProperties.deleteProperty(`goal_history_${this.projectKey}_${this.boardId}`);
	}

	public deleteConfiguration(): Promise<AtlassianResponse> {
		return this.addonProperties.deleteProperty(`config_${this.projectKey}_${this.boardId}`);
	}
}
