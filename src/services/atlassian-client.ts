import {AtlassianRequest} from "./atlassian-request";
import {AtlassianResponse} from "./atlassian-response";

declare global {
	interface Window {
		AP: {
			getLocation(callback: (url: string) => void): void;
			request(options: AtlassianRequest): Promise<AtlassianResponse>;
			resize(width: string, height: string): void;
			dialog: {
				close(): void;
			}
		}
	}
}

export class AtlassianClient {

	static request(options: AtlassianRequest): Promise<AtlassianResponse> {
		return window.AP.request(options);
	}

	static resize(width: string, height: string) {
		window.AP.resize(width, height);
	}

	static closeDialog() {
		window.AP.dialog.close();
	}

	static resizeToContent() {
		const el = document.getElementById("root");
		if (el) {
			this.resize("100%", `${el.clientHeight}px`);
		}
	}

	static getLocation(): Promise<string> {
		return new Promise((resolve) => {
			window.AP.getLocation((url: string) => {
				resolve(url);
			});
		});
	}
}
