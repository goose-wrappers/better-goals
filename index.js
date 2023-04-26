const fs = require('fs');

exports.handler = async function (event, context) {
	if (event.rawPath === '/atlassian-connect.json') {
		return fs.readFileSync('./atlassian-connect.json', {encoding: 'utf8'});
	}

	if (event.rawPath === '/app-installed-callback') {
		return "OK!";
	}

	if (event.rawPath.startsWith('/webpanel') || event.rawPath.startsWith("/configuration")) {

		let data = fs.readFileSync("./build/index.html", {encoding: 'utf8'});
		data = data.replace("<head>", "<head><base href='https://better-goals-jira-addon.s3.amazonaws.com/'>");

		return {
			statusCode: 200,
			headers: {
				"content-type": "text/html",
			},
			body: data,
		};
	}

	return "A5=>" + context.logStreamName;
}
