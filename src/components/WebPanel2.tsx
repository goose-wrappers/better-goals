import {FC, ReactElement, useEffect, useState} from "react";
import React from "react";
import {WebPanel} from "./WebPanel";
import {QueryParserService} from "../services/query-parser-service";

export const WebPanel2: FC = (): ReactElement => {

	const [lic, setLic] = useState<string>("none");

	useEffect(() => {
		const parsed = QueryParserService.parse(document.location.search);
		const lic = parsed.get("lic") || "none";
		setLic(lic);
	}, []);

	return (
		<WebPanel lic={lic}></WebPanel>
	);
};
