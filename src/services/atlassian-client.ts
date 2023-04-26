import {AtlassianRequest} from "./atlassian-request";
import {AtlassianResponse} from "./atlassian-response";

interface WindowWithAtlassianClient {
	AP: {
		getLocation(callback: any): void;
		request(options: AtlassianRequest): Promise<AtlassianResponse>;
		resize(width: string, height: string): void;
		dialog: {
			close(): void;
		}
	}
}

export class AtlassianClient {

	static request(options: AtlassianRequest): Promise<AtlassianResponse> {
		return (<WindowWithAtlassianClient>(window as any)).AP.request(options);
	}

	static resize(width: string, height: string) {
		(<WindowWithAtlassianClient>(window as any)).AP.resize(width, height);
	}

	static closeDialog() {
		(<WindowWithAtlassianClient>(window as any)).AP.dialog.close();
	}

	static resizeToContent() {
		const el = document.getElementById("root");
		if (el) {
			this.resize("100%", `${el.clientHeight}px`);
		}
	}

	static getLocation(): Promise<string> {
		return new Promise((resolve) => {
			(<WindowWithAtlassianClient>(window as any)).AP.getLocation((url: string) => {
				resolve(url);
			});
		});
	}
}
