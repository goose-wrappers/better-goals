export interface AtlassianRequest {
	url: string;
	type?: string;
	contentType?: string;
	data?: string;
	cache?: boolean;
	responseType?: string; // json|text
	headers?: object;
}
