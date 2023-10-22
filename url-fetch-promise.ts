import https from "https";
import {RequestOptions} from "http";
import * as http from "http";

export class UrlFetchPromise {
	public static async getHttp(url: string, options: RequestOptions): Promise<string> {
		return new Promise((resolve, reject) => {
			http.get(url, options, (res) => {
				let rawData = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => rawData += chunk);
				res.on("end", () => resolve(rawData));
			}).on("error", (err) => {
				reject(err);
			});
		});
	}

	public static async getHttps(url: string, options: RequestOptions): Promise<string> {
		return new Promise((resolve, reject) => {
			https.get(url, options, (res) => {
				let rawData = "";
				res.setEncoding("utf8");
				res.on("data", (chunk) => rawData += chunk);
				res.on("end", () => resolve(rawData));
			}).on("error", (err) => {
				reject(err);
			});
		});
	}

	public static async get(url: string, options: RequestOptions): Promise<string> {
		if (url.startsWith("http://")) {
			return this.getHttp(url, options);
		} else {
			return this.getHttps(url, options);
		}
	}
}
