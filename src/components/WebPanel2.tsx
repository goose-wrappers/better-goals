import React, {FC, ReactElement, useEffect, useState} from "react";
import {QueryParserService} from "../services/query-parser-service";
import {AtlassianClient} from "../services/atlassian-client";

export const WebPanel2: FC = (): ReactElement => {

	const [lic, setLic] = useState<string>("none");

	const callbackFunc = (e: any) => {
		// nope;
		console.log("callback called", e);
	};

	useEffect(() => {
		const parsed = QueryParserService.parse(document.location.search);
		// const lic = parsed.get("lic") || "none";
		const lic = "active";
		setLic(lic);

		AtlassianClient.createDialog({
			key: "better-goals-web-panel-dialog",
			width: "800px",
			height: "400px",
			chrome: false,
		}).on("close", callbackFunc);
	}, []);

	return (
		<div></div>
	);
};
