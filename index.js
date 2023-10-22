const fs = require("fs");
const {JwtVerify} = require("./jwt-verify");

exports.handler = async function (event) {

	const CLOUDFRONT_BASE_URL = "https://d2kzuxik6m89nh.cloudfront.net/";

	const AUTHORIZATION_FAILED_RESPONSE = {
		statusCode: 403,
	};

	const SUCCESSFUL_CALLBACK_RESPONSE = {
		statusCode: 200,
		body: "OK!",
	};

	const REDIRECT_TO_ATLASSIAN_CONNECT_JSON_RESPONSE = {
		statusCode: 302,
		headers: {
			location: "/atlassian-connect.json",
		},
	};

	const handleAtlassianConnectJson = (event) => {
		return fs.readFileSync("./atlassian-connect.json", {encoding: "utf8"});
	};

	const handleAppInstalledCallback = async (event) => {
		return SUCCESSFUL_CALLBACK_RESPONSE;
	};

	console.log("Handing request", event);

	if ("authorization" in event.headers) {
		const verifier = new JwtVerify();
		if (!(await verifier.isJwtAuthenticated(event))) {
			return AUTHORIZATION_FAILED_RESPONSE;
		}
	}

	if (event.rawPath === "/atlassian-connect.json") {
		return handleAtlassianConnectJson(event);
	}

	if (event.rawPath === "/app-installed-callback") {
		return handleAppInstalledCallback(event);
	}

	if (event.rawPath.startsWith("/webpanel") || event.rawPath.startsWith("/configuration") || event.rawPath.startsWith("/addon-configuration")) {

		let data = fs.readFileSync("./build/index.html", {encoding: "utf8"});
		data = data.replace("<head>", "<head><base href='" + CLOUDFRONT_BASE_URL + "'>");

		return {
			statusCode: 200,
			headers: {
				"content-type": "text/html",
			},
			body: data,
		};
	}

	return REDIRECT_TO_ATLASSIAN_CONNECT_JSON_RESPONSE;
};
