import {IncomingMessage, RequestOptions} from "http";

const morgan = require('morgan');
const ngrok = require('ngrok');
const http = require('http');
const fs = require("fs");
const compression = require('compression');
const os = require("os");

import express, {Request, Response} from 'express';

const localFetch = (url: string, options: RequestOptions) => {
	return new Promise((resolve, reject) => {
		http.get(url, options, (response: IncomingMessage) => {
			response.setEncoding('utf8');
			let rawData = '';
			response.on('data', (chunk) => rawData += chunk);
			response.on('end', () => resolve(rawData));
		}).on('error', (err: Error) => {
			reject(err);
		});
	});
}

class LocalDevSetup {

	private ngrokUrl = "";

	private onGetAtlassianConnect(req: Request, res: Response) {
		const text = fs.readFileSync("./atlassian-connect.json", {encoding: "utf8"});
		const json = JSON.parse(text);
		json.baseUrl = this.ngrokUrl;
		json.name += " (" + os.hostname() + ")";
		json.key += "-" + os.hostname().toLowerCase();

		if (json.modules.webSections) {
			for (let i = 0; i < json.modules.webSections.length; i++) {
				json.modules.webSections[i].name.value += " (" + os.hostname() + ")";
			}
		}

		if (json.modules.webItems) {
			for (let i = 0; i < json.modules.webItems.length; i++) {
				json.modules.webItems[i].name.value += " (" + os.hostname() + ")";
				json.modules.webItems[i].url += "&addon-name=" + json.key;
			}
		}

		for (let i = 0; i < json.modules.webPanels.length; i++) {
			json.modules.webPanels[i].name.value += " (" + os.hostname() + ")";
			json.modules.webPanels[i].url += "&addon-name=" + json.key;
		}

		res.send(JSON.stringify(json));
	}

	private onAppInstalledCallback(req: Request, res: Response) {
		console.log("Received installed callback with this request");
		console.dir(req.headers);
		console.dir(req.body);
		res.send('OK!')
	}

	public run() {

		const app = express();
		const port = 8000;

		app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'));
		app.use(compression());
		app.use(express.json())

		app.get("/atlassian-connect.json", (req, res) => this.onGetAtlassianConnect(req, res));

		app.post('/app-installed-callback', (req, res) => this.onAppInstalledCallback(req, res));

		app.get("*", async (req, res) => {
			localFetch('http://localhost:8001' + req.url, {headers: {"Accept": "*/*"}}).then((body) => {
				res.send(body);
			});
		});

		localFetch("http://localhost:8001/", {headers: {"Accept": "*/*"}}).then((body) => {
			ngrok.connect({addr: port, region: 'eu'}).then((url: string) => {
				app.listen(port, () => {
					this.ngrokUrl = url;
					console.log(`Install addon at url ${url}/atlassian-connect.json`);
				});
			});
		}).catch((e) => {
			console.error("Please run `npm start` in another window and then run this tool again");
			process.exit(1);
		});
	}

	public static main() {
		const ref = new LocalDevSetup();
		ref.run();
	}
}

LocalDevSetup.main();
