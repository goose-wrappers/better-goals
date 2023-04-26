import React, {FC, ReactElement, useEffect, useState} from "react";
import PageHeader from "@atlaskit/page-header";
import DynamicTable from "@atlaskit/dynamic-table";
import {HeadType, RowType} from "@atlaskit/dynamic-table/types";
import {AtlassianClient} from "../services/atlassian-client";
import {JiraProject} from "../models/jira-project";
import {ToggleWithSpinner} from "./TriggerWithSpinner";
import {LoggerService} from "../services/logger-service";

interface BetterGoalsProjectConfiguration {
	version: number;
	isVisible: boolean;
}

interface JiraProjectSearchResult {
	isLast: boolean;
	maxResults: number;
	startAt: number;
	total: number;
	values: Array<JiraProject>;
}

export const GlobalConfigurationPage: FC = (): ReactElement => {

	// const DEFAULT_ADDON_KEY = "com.wandering.better-goals";

	const [rows, setRows] = useState<Array<RowType>>([]);

	const head: HeadType = {
		cells: [
			{
				key: "project-name",
				content: "Project Name",
				isSortable: true,
				width: undefined,
			},
			{
				key: "project-key",
				content: "Project Key",
				shouldTruncate: true,
				isSortable: true,
				width: undefined,
			},
			{
				key: "project-lead",
				content: "Project Lead",
				shouldTruncate: true,
				isSortable: true,
				width: undefined,
			},
			{
				key: "better-goals",
				content: "Better Goals",
				shouldTruncate: false,
			},
		],
	};

	const updateProjectKey = (projectKey: string, checked: boolean) => {

		const dummy: BetterGoalsProjectConfiguration = {
			version: 1,
			isVisible: checked,
		};

		AtlassianClient.request({
			url: `/rest/api/3/project/${projectKey}/properties/better-goals-admin-settings`,
			type: "PUT",
			contentType: "application/json",
			data: JSON.stringify(dummy),
		}).then();
	};

	useEffect(() => {

		// only needed if used under local development
		// AtlassianClient.getLocation().then((location) => {
		// 	const address = new URL(location);
		// 	const re = new RegExp("^/plugins/servlet/ac/([^/]+)/global-configuration");
		// 	const matches = re.exec(address.pathname);
		// 	if (matches) {
		// 		LoggerService.log(`[GlobalConfiguration] Found addon key to be ${matches[1]}`);
		// 	}
		// });

		const avatarSize = "16x16";
		const url = "/rest/api/3/project/search?expand=lead&properties=better-goals-admin-settings";
		AtlassianClient.request({url}).then((response) => {
			console.dir(response);
			const result: JiraProjectSearchResult = JSON.parse(response.body);

			const newRows = result.values.map((project) => {

				let defaultChecked = true;
				if ("better-goals-admin-settings" in project.properties) {
					const settings = project.properties["better-goals-admin-settings"];
					if ("isVisible" in settings) {
						defaultChecked = settings.isVisible as boolean;
					}
				}

				return {
					key: `row_${project.key}`,
					isHighlighted: false,
					cells: [
						{
							key: `row_${project.key}_name`,
							content:
								<div style={{height: "40px", display: "flex"}}>
									<img src={project.avatarUrls[avatarSize]} alt="" className="project-avatar-img" />
									<div>
										{project.name}
									</div>
								</div>
						},
						{
							key: `row_${project.key}_key`,
							content: project.key,
						},
						{
							key: `row_${project.key}_display`,
							content: project.lead?.displayName || ""
						},
						{
							key: `row_${project.key}_toggle`,
							content: <ToggleWithSpinner defaultChecked={defaultChecked} onChange={(checked) => updateProjectKey(project.key, checked)} />
						}
					]
				};
			});

			setRows(newRows);
		});

	}, []);

	return (
		<div id="page" className="ac-content global-configuration-view" style={{padding: "40px"}}>
			<section id="content" role="main">
				<header className="aui-page-header">
					<div className="aui-page-header-inner">
						<div className="aui-page-header-main">
							<div style={{float: "left"}}>
								<PageHeader>
									Better Goals 🎯
								</PageHeader>
							</div>

							<br style={{clear: "both"}}/>

							<p>
								Enable or Disable <strong>Better Goals</strong> for the selected projects in your organization:
							</p>
						</div>
					</div>
				</header>
				<div className="aui-page-panel" style={{paddingTop: "24px"}}>
					<div className="aui-page-panel-inner">
						<section className="aui-page-panel-content">

							<div style={{maxWidth: "1200px"}}>
								<DynamicTable
									head={head}
									rows={rows}
									rowsPerPage={50}
									defaultPage={1}
									loadingSpinnerSize="large"
									isRankable
								/>
							</div>

						</section>
					</div>
				</div>
			</section>
		</div>
	);
};
