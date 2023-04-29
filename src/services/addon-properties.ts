import {AtlassianClient} from "./atlassian-client";
import {AtlassianResponse} from "./atlassian-response";

export interface AddonPropertiesResult
{
	keys: Array<{
		key: string;
		self: string;
	}>;
}

export class AddonProperties {

	public constructor(private addonKey: string) {
	}

	public deleteProperty(name: string): Promise<AtlassianResponse> {
		return AtlassianClient.request({
			url: `/rest/atlassian-connect/1/addons/${this.addonKey}/properties/${name}`,
			type: "DELETE",
			contentType: "application/json",
		});
	}

	public putProperty(name: string, data: any): Promise<AtlassianResponse> {
		return AtlassianClient.request({
			url: `/rest/atlassian-connect/1/addons/${this.addonKey}/properties/${name}`,
			type: "PUT",
			contentType: "application/json",
			data: JSON.stringify(data)
		});
	}

	public getProperties(): Promise<AddonPropertiesResult> {
		return new Promise((resolve, reject) => {
			AtlassianClient.request({
				url: `/rest/atlassian-connect/1/addons/${this.addonKey}/properties/`,
			}).then((response: AtlassianResponse) => {
				const json = JSON.parse(response.body);
				resolve(json);
			}).catch(reject);
		});
	}

	public getProperty<T>(name: string): Promise<T> {
		return new Promise((resolve, reject) => {
			AtlassianClient.request({
				url: `/rest/atlassian-connect/1/addons/${this.addonKey}/properties/${name}`,
			}).then((response: AtlassianResponse) => {
				const json = JSON.parse(response.body);
				resolve(json.value);
			}).catch(reject);
		});
	}
}
