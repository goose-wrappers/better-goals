import {AtlassianClient} from "./atlassian-client";
import {AtlassianResponse} from "./atlassian-response";
import {JiraPropertiesResult} from "../models/jira-properties-result";

export class UserPropertiesService {

	public constructor(private accountId: string) {
	}

	public deleteProperty(name: string): Promise<AtlassianResponse> {
		return AtlassianClient.request({
			url: `/rest/api/3/user/properties/${name}?accountId=${this.accountId}`,
			type: "DELETE",
			contentType: "application/json",
		});
	}

	public putProperty(name: string, data: any): Promise<AtlassianResponse> {
		return AtlassianClient.request({
			url: `/rest/api/3/user/properties/${name}?accountId=${this.accountId}`,
			type: "PUT",
			contentType: "application/json",
			data: JSON.stringify(data)
		});
	}

	public getProperties(): Promise<JiraPropertiesResult> {
		return new Promise((resolve, reject) => {
			AtlassianClient.request({
				url: `/rest/api/3/user/properties/?accountId=${this.accountId}`,
			}).then((response: AtlassianResponse) => {
				const json = JSON.parse(response.body);
				resolve(json);
			}).catch(reject);
		});
	}

	public getProperty<T>(name: string): Promise<T> {
		return new Promise((resolve, reject) => {
			AtlassianClient.request({
				url: `/rest/api/3/user/properties/${name}`,
			}).then((response: AtlassianResponse) => {
				const json = JSON.parse(response.body);
				resolve(json.value);
			}).catch(reject);
		});
	}
}
