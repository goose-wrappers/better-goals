import {AtlassianRequest} from "./atlassian-request";
import {AtlassianResponse} from "./atlassian-response";

interface GetCurrentUserResponse {
	atlassianAccountId: string;
}

export interface AtlassiaDialog {
	on(event: string, callback: (data: any) => void): void;
}

declare global {
	interface Window {
		AP: {
			getLocation(callback: (url: string) => void): void;
			request(options: AtlassianRequest): Promise<AtlassianResponse>;
			resize(width: string, height: string): void;
			dialog: {
				close(): void;
				create(options: any): AtlassiaDialog;
			};
			getCurrentUser(callback: (user: GetCurrentUserResponse) => void): void;
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

	static createDialog(options: any): AtlassiaDialog {
		return window.AP.dialog.create(options);
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

	static getCurrentUser(): Promise<string> {
		return new Promise((resolve) => {
			window.AP.getCurrentUser(result => {
				resolve(result.atlassianAccountId);
			});
		});
	}

	static getLocation(): Promise<string> {
		return new Promise((resolve) => {
			window.AP.getLocation((url: string) => {
				resolve(url);
			});
		});
	}
}
