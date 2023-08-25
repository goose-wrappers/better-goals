import React, {FC, MouseEventHandler, ReactElement, useEffect, useState} from "react";
import {DatastoreService} from "../services/datastore-service";
import {AddonConfiguration} from "../models/addon-configuration";
import {LoggerService} from "../services/logger-service";
import {QueryParserService} from "../services/query-parser-service";
import {BoardService} from "../services/board-service";
import {EditView} from "./EditView";
import {IterationView} from "./IterationView";
import {GoalsHistory, GoalsIteration} from "../models/goals-history";
import {AtlassianClient} from "../services/atlassian-client";
import {DateUtils} from "../services/date-utils";
import {IterationDurationUtils} from "../services/iteration-duration-utils";
import {UserPropertiesService} from "../services/user-properties-service";
import {environment} from "../environments/environment";
import {AddonProperties} from "../services/addon-properties";
import {LicenseMissing} from "./LicenseMissing";

export const WebPanel: FC<{
	lic?: string;
}> = ({lic}): ReactElement => {

	// warning! only use this for debugging
	const DEBUG_WIPE_CONFIGURATON = false;

	const [boardService, setBoardService] = useState<BoardService>();
	const [isConfigMode, setConfigMode] = useState(true);
	const [configurationLoaded, setConfigurationLoaded] = useState(false);

	const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
		// default, every click on the webpanel will close it. so we stop propagation.
		event.stopPropagation();
	};

	const onConfigureClicked = () => {
		setConfigMode(true);
	};

	const onStartNewIterationClicked = () => {

		// copy current iteration into history
		if (boardService) {

			boardService.getGoalHistory().then(oldGoalHistory => {
				boardService.getConfiguration().then(oldConfiguration => {

					const newAddonConfiguration: AddonConfiguration = {
						version: 1,
						goals: [],
						iterationStartDate: DateUtils.getDateAsIso(),
						iterationLengthWeeks: oldConfiguration.iterationLengthWeeks
					};

					oldConfiguration.goals
						.filter(goal => !goal.isComplete)
						.forEach(goal => newAddonConfiguration.goals.push(goal));

					const endDate = IterationDurationUtils.iterationEndDate(oldConfiguration.iterationStartDate, oldConfiguration.iterationLengthWeeks);

					const newIteration: GoalsIteration = {
						startDate: oldConfiguration.iterationStartDate,
						endDate: endDate.toISOString(),
						goals: oldConfiguration.goals.filter(goal => goal.isComplete),
					};

					// only create history section if at least one goal was completed
					if (newIteration.goals.length > 0) {
						const newGoalHistory: GoalsHistory = {
							iterations: [newIteration, ...oldGoalHistory.iterations],
						};

						boardService.saveGoalHistory(newGoalHistory).then();
					}

					boardService.saveConfiguration(newAddonConfiguration).then(() => {
						// turn into edit mode after property updated; otherwise we see old data
						setConfigMode(true);
					});
				});
			});
		}
	};

	const onIterationStated = () => {
		setConfigMode(false);
	};

	const handleDebugMode = (datastoreService: DatastoreService): Promise<void> => {
		return new Promise((resolve) => {
			if (DEBUG_WIPE_CONFIGURATON) {
				AtlassianClient.getCurrentUser().then(accountId => {

					// remove per-user first-time cookie
					const userService = new UserPropertiesService(accountId);
					userService.deleteProperty("better-goals-first-time").then();

					datastoreService.deleteConfiguration().finally(() => {
						datastoreService.deleteGoalHistory().finally(() => {
							resolve();
						});
					});
				});
			} else {
				resolve();
			}
		});
	};

	const initializeBoardService = (addonKey: string, projectKey: string, boardId: string) => {
		const addonProperties = new AddonProperties(addonKey);
		const datastore = new DatastoreService(addonProperties, projectKey, boardId);
		const boardService = new BoardService(datastore);

		setBoardService(boardService);

		handleDebugMode(datastore).finally(() => {
			boardService.getConfiguration().then((configuration: AddonConfiguration) => {
				LoggerService.log("[WebPanel] loaded configuration", configuration);

				if (configuration && configuration.goals && configuration.goals.length > 0) {
					setConfigMode(false);
				}

				setConfigurationLoaded(true);
			});
		});
	};

	useEffect(() => {

		const parsed = QueryParserService.parse(document.location.search);
		const addonKey = parsed.get("addon-name") || environment.addonKey;

		AtlassianClient.getLocation().then((url: string) => {
			LoggerService.log("[WebPanel useEffect] AtlassianConnect says url is " + url);

			const address = new URL(url);
			// const instanceName = address.hostname;
			const args = address.pathname.split("/");
			if (args.length >= 8 && args[1] === "jira" && args[2] == "software" && args[3] === "c" && args[4] === "projects" && args[6] === "boards") {
				const projectKey = args[5];
				const boardId = args[7];

				LoggerService.log("[WebPanel useEffect] addonKey=" + addonKey + " projectKey=" + projectKey + " boardId=" + boardId);

				// const configurationUrl = `https://${instanceName}/jira/software/c/projects/${projectKey}/boards/${boardId}?config=${addonKey}__-configuation-page&insightsConfigTab=board`;
				// setConfigurationUrl(configurationUrl);

				initializeBoardService(addonKey, projectKey, boardId);
			}
		});
	}, []);

	return (
		<div className="ac-content" onClick={handleClick}>
			<div className="dialog-wrapper">

				{lic === "none" &&
					<>
						<LicenseMissing/>

						{configurationLoaded && boardService &&
							<EditView boardService={boardService} onIterationStarted={onIterationStated} lic="none"/>
						}
					</>
				}

				{(lic === undefined || lic === "active") &&
					<>
						{configurationLoaded && isConfigMode && boardService &&
							<EditView boardService={boardService} onIterationStarted={onIterationStated} lic="active"/>
						}

						{configurationLoaded && !isConfigMode && boardService &&
							<IterationView boardService={boardService} onConfigureClicked={onConfigureClicked} onStartNewIterationClicked={onStartNewIterationClicked}/>
						}
					</>
				}
			</div>
		</div>
	);
};
