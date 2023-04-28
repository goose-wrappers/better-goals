import {AtlassianClient} from "./atlassian-client";
import {AtlassianResponse} from "./atlassian-response";

export class ProjectProperties {

	public constructor(private projectKey: string) {
	}

	public deleteProperty(name: string): Promise<AtlassianResponse> {
		return AtlassianClient.request({
			url: `/rest/api/3/project/${this.projectKey}/properties/${name}`,
			type: "DELETE",
			contentType: "application/json",
		});
	}

	public putProperty(name: string, data: object): Promise<AtlassianResponse> {
		return AtlassianClient.request({
			url: `/rest/api/3/project/${this.projectKey}/properties/${name}`,
			type: "PUT",
			contentType: "application/json",
			data: JSON.stringify(data)
		});
	}

	public getProperty<T>(name: string): Promise<T> {
		return new Promise((resolve, reject) => {
			AtlassianClient.request({
				url: `/rest/api/3/project/${this.projectKey}/properties/${name}`,
			}).then((response: any) => {
				const json = JSON.parse(response.body);
				resolve(json.value);
			}).catch(reject);
		});
	}
}
