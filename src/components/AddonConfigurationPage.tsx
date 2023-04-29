import React, {FC, ReactElement, useEffect, useState} from "react";
import PageHeader from "@atlaskit/page-header";
import DynamicTable from "@atlaskit/dynamic-table";
import {HeadType, RowType} from "@atlaskit/dynamic-table/types";
import {AtlassianClient} from "../services/atlassian-client";
import {JiraProject} from "../models/jira-project";
import {ToggleWithSpinner} from "./TriggerWithSpinner";
import Toggle from "@atlaskit/toggle";
import Spinner from "@atlaskit/spinner";
import Flag from "@atlaskit/flag";
import Blanket from "@atlaskit/blanket";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import {token} from "@atlaskit/tokens";
import {LoggerService} from "../services/logger-service";
import {AddonProperties} from "../services/addon-properties";

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

export const AddonConfigurationPage: FC = (): ReactElement => {

	// const DEFAULT_ADDON_KEY = "com.wandering.better-goals";
	const ADDON_KEY_BETTER_GOALS_DISABLED = "better-goals-disabled";

	const [addonKey, setAddonKey] = useState("");
	const [isBetterGoalsEnabled, setIsBetterGoalsEnabled] = useState(true);
	const [isLoadingDone, setIsLoadingDone] = useState(false);
	const [isDisableFlagVisible, setIsDisableFlagVisible] = useState(false);

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

	const onConfirmDisable = () => {
		setIsDisableFlagVisible(false);
		setIsBetterGoalsEnabled(false);

		const addonProperties = new AddonProperties(addonKey);
		addonProperties.putProperty(ADDON_KEY_BETTER_GOALS_DISABLED, true).then();
	};

	const onBetterGoalsEnabledChange = (event: React.ChangeEvent<HTMLInputElement>) => {

		// we do not let <toggle> ever change its state. defaultChecked will change after confirmation.
		event.preventDefault();
		event.stopPropagation();

		if (isBetterGoalsEnabled) {
			// are we disabling better goals?
			setIsDisableFlagVisible(true);
		} else {
			// we're enabling better goals!
			setIsBetterGoalsEnabled(true);

			const addonProperties = new AddonProperties(addonKey);
			addonProperties.deleteProperty(ADDON_KEY_BETTER_GOALS_DISABLED).then();
		}
	};

	const refreshProjectList = () => {
		const avatarSize = "16x16";
		const url = "/rest/api/3/project/search?expand=lead&properties=better-goals-admin-settings";
		AtlassianClient.request({url}).then((response) => {
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
									<img src={project.avatarUrls[avatarSize]} alt="" className="project-avatar-img"/>
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
							content: <ToggleWithSpinner defaultChecked={defaultChecked} onChange={(checked) => updateProjectKey(project.key, checked)}/>
						}
					]
				};
			});

			setRows(newRows);
			setIsLoadingDone(true);
		});
	};

	useEffect(() => {

		// only needed if used under local development
		AtlassianClient.getLocation().then((location) => {
			const address = new URL(location);
			const re = new RegExp("^/plugins/servlet/ac/([^/]+)/");
			const matches = re.exec(address.pathname);
			if (matches) {
				LoggerService.log(`[AddonConfiguration] Found addon key to be ${matches[1]}`);
				setAddonKey(matches[1]);

				// see if we're enabled by default. if property exists, then we're disabled.
				// it's implemented this way, so it's opt-out and not opt-in
				const addonProperties = new AddonProperties(matches[1]);
				addonProperties.getProperties()
					.then(result => {
						const found = result.keys
							.map(k => k.key)
							.filter(key => key === ADDON_KEY_BETTER_GOALS_DISABLED)
							.length > 0;
						setIsBetterGoalsEnabled(!found);
					});

				if (address) {
					// disabled for the time being
					refreshProjectList();
				}
				setIsLoadingDone(true);
			}
		});
	}, []);

	return (
		<div id="page" className="ac-content global-configuration-view" style={{padding: "40px"}}>
			<section id="content" role="main">
				<header className="aui-page-header">
					<div className="aui-page-header-inner">
						<div className="aui-page-header-main">
							<PageHeader>
								Better Goals 🎯
							</PageHeader>
						</div>
					</div>
				</header>
				<div className="aui-page-panel" style={{marginTop: "2em"}}>
					<div className="aui-page-panel-inner">
						<section className="aui-page-panel-content" style={{position: "relative"}}>

							{isDisableFlagVisible &&
								<>
									<Blanket isTinted={true} onBlanketClicked={() => setIsDisableFlagVisible(false)}/>

									<div style={{width: "800px", position: "absolute", zIndex: "999"}}>
										<Flag title="Disable Better Goals?" description="Users will not be able to access their checklists. Are you sure?"
											id={1}
											icon={<WarningIcon primaryColor={token("color.icon.warning")} label="Warning"/>}
											actions={[
												{content: "Yes", onClick: onConfirmDisable},
												{content: "Not now", onClick: () => setIsDisableFlagVisible(false)},
											]}
										/>
									</div>
								</>
							}

							{!isLoadingDone &&
								<Spinner delay={0} size="large"/>
							}

							{isLoadingDone &&
								<>
									<div style={{marginBottom: "1em"}}>
										<strong>
											Welcome to the configuration page for Better Goals 🎯
										</strong>
									</div>

									<div style={{marginBottom: "1em"}}>
										{isBetterGoalsEnabled &&
											<>Currently Better Goals is enabled</>
										}

										{!isBetterGoalsEnabled &&
											<>Currently Better Goals is disabled</>
										}

										<Toggle id="toggle-large" size="large" isChecked={isBetterGoalsEnabled} onChange={onBetterGoalsEnabledChange}/>
									</div>

									<div style={{marginTop: "32em"}}>
										<div style={{fontWeight: "bold"}}>
											Do you want to disable it per project base?
										</div>
										<div>
											Let us know here: <a href="mailto:support@goosewrappers.dev?subject=I+want+to+disable+per+project+please"
											target="_blank">support@goosewrappers.dev</a>
										</div>
									</div>

									{false && isBetterGoalsEnabled &&
										<>
											<div style={{marginBottom: "1em"}}>
												Enable or Disable <strong>Better Goals</strong> for the selected projects in your organization:
											</div>

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
										</>
									}
								</>
							}
						</section>
					</div>
				</div>
			</section>
		</div>
	);
};
