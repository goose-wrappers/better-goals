import React, {FC, ReactElement, useEffect, useState} from "react";
import Tabs, {Tab, TabList, TabPanel} from "@atlaskit/tabs";
import {MutableGoalList} from "./MutableGoalList";
import Button from "@atlaskit/button";
import {BetterGoalsLogo} from "./BetterGoalsLogo";
import {Goal} from "../models/goal";
import {AtlassianClient} from "../services/atlassian-client";
import {AddonConfiguration} from "../models/addon-configuration";
import {BoardService} from "../services/board-service";
import {LoggerService} from "../services/logger-service";
import Spinner from "@atlaskit/spinner";
import {HistoryTabPanel} from "./HistoryTabPanel";
import {IterationDurationUtils} from "../services/iteration-duration-utils";
import {SelectWithBlanket} from "./SelectWithBlanket";
import {DatePickerWithBlanket} from "./DatePickerWithBlanket";

export const EditView: FC<{
	boardService: BoardService;
	onIterationStarted: () => void;
}> = ({boardService, onIterationStarted}): ReactElement => {

	const [showSpinner, setShowSpinner] = useState(false);
	const [minimumDateInPicker, setMinimumDateInPicker] = useState("");
	const [isInvalidDate, setIsInvalidDate] = useState(false);
	const [addonConfiguration, setAddonConfiguration] = useState<AddonConfiguration>();
	const [datePickerVisible, setDatePickerVisible] = useState(false);
	const [lengthPickerVisible, setLengthPickerVisible] = useState(false);
	const [isInvalidGoal, setInvalidGoal] = useState(false);

	const handleCloseDialog = () => {
		AtlassianClient.closeDialog();
	};

	const onIterationLengthChanged = (item: any) => {
		setIsInvalidDate(false);
		setLengthPickerVisible(false);
		if (addonConfiguration) {
			const newConfiguration: AddonConfiguration = {...addonConfiguration};
			newConfiguration.iterationLengthWeeks = parseInt(item.value);
			setAddonConfiguration(newConfiguration);
		}
	};

	const onDateChanged = (value: string) => {
		LoggerService.log(`onDateChanged: ${value}`);
		setIsInvalidDate(false);

		setDatePickerVisible(false);

		const newConfiguration: AddonConfiguration = {...addonConfiguration!};
		newConfiguration.iterationStartDate = value;
		setAddonConfiguration(newConfiguration);
	};

	const handleListChanged = (goals: Array<Goal>) => {
		LoggerService.log("[EditView] Goals have changed to:", goals);

		if (addonConfiguration) {
			const newConfiguration = {...addonConfiguration};
			newConfiguration.goals = goals;
			setAddonConfiguration(newConfiguration);
		}
	};

	const isNewDateValid = () => {
		if (addonConfiguration) {
			const iterationEndDate = IterationDurationUtils.iterationEndDate(addonConfiguration.iterationStartDate, addonConfiguration.iterationLengthWeeks);
			return iterationEndDate > (new Date());
		}

		return true;
	};


	const onReadyToStartClicked = () => {
		if (addonConfiguration) {

			let isValid = true;

			if (addonConfiguration.goals.length === 0) {
				isValid = false;
				setInvalidGoal(true);
			}

			if (!isNewDateValid()) {
				isValid = false;
				setIsInvalidDate(true);
			}

			if (!isValid) {
				return;
			}

			setShowSpinner(true);
			boardService.saveConfiguration(addonConfiguration).then(() => {
				setShowSpinner(false);
				onIterationStarted();
			});
		}
	};

	const iterationLengthClicked = () => {
		setLengthPickerVisible(true);
	};

	const iterationStartClicked = () => {
		setDatePickerVisible(true);
	};

	const onBlanketClicked = () => {
		setDatePickerVisible(false);
		setLengthPickerVisible(false);
	};

	useEffect(() => {
		boardService.getConfiguration().then((configuration: AddonConfiguration) => {
			LoggerService.log("[WebPanel] loaded configuration", configuration);
			setAddonConfiguration(configuration);
		});

		const fourWeeksAgo = new Date(+new Date() - 86400 * 4 * 7 * 1000).toISOString();
		LoggerService.log("[EditView] Setting minimum date to " + fourWeeksAgo);
		setMinimumDateInPicker(fourWeeksAgo);
	}, []);

	return (
		<div className="edit-view">
			<div style={{position: "absolute", right: "1em", fontSize: "1.5em", zIndex: "100"}}>
				<span style={{cursor: "pointer", color: "black"}} onClick={handleCloseDialog}>&times;</span>
			</div>
			<div style={{flex: 1}} className="tabs-container">
				<Tabs id="default">
					<TabList>
						<Tab>Goals</Tab>
						<Tab>History</Tab>
						<Tab>Configuration</Tab>
					</TabList>
					<TabPanel>
						{addonConfiguration &&
							<div style={{marginTop: "1.5em", width: "100%", display: "flex", flexDirection: "column"}}>
								<div style={{flex: 1}}>
									<div className={isInvalidGoal ? "field-validation-failed" : ""} onClick={() => setInvalidGoal(false)}>
										<MutableGoalList list={addonConfiguration.goals} onListChanged={handleListChanged} maxItems={3}/>
									</div>

									<div style={{width: "50%", marginTop: "2.5em"}}>
										<div>
											<div className="iteration-select-label">
												Iteration start date:
											</div>
											<div className="iteration-select-value" onClick={iterationStartClicked}>
												<div className={isInvalidDate ? "field-validation-failed" : ""} style={{padding: "4px"}}>
													{addonConfiguration.iterationStartDate}
												</div>
											</div>
										</div>

										<div>
											<div className="iteration-select-label">
												Iteration length:
											</div>
											<div className="iteration-select-value" onClick={iterationLengthClicked}>
												<div className={isInvalidDate ? "field-validation-failed" : ""} style={{padding: "4px"}}>
													{addonConfiguration.iterationLengthWeeks} Weeks
												</div>
											</div>
										</div>
									</div>

									{datePickerVisible &&
										<DatePickerWithBlanket
											minDate={minimumDateInPicker}
											defaultValue={addonConfiguration.iterationStartDate}
											onChange={(value) => onDateChanged(value)}
											onBlankedClicked={onBlanketClicked}
										/>
									}

									{lengthPickerVisible &&
										<SelectWithBlanket
											placeholder="Select iteration length"
											defaultValue={{
												label: `${addonConfiguration.iterationLengthWeeks} Weeks`,
												value: addonConfiguration.iterationLengthWeeks
											}}
											options={[
												{label: "1 Week", value: 1},
												{label: "2 Weeks", value: 2},
												{label: "3 Weeks", value: 3},
												{label: "4 Weeks", value: 4},
											]}
											onChange={onIterationLengthChanged}
											onBlanketClicked={onBlanketClicked}
										/>
									}
								</div>
							</div>
						}
					</TabPanel>
					<TabPanel>
						<div style={{marginTop: "2em", width: "100%"}}>
							<HistoryTabPanel boardService={boardService}/>
						</div>
					</TabPanel>
					<TabPanel>
						<div style={{marginTop: "1.5em", width: "100%", textAlign: "center", fontSize: "1em"}}>
							We are adding more configuration options soon! 🎉
						</div>
					</TabPanel>
				</Tabs>
			</div>
			<div className="dialog-footer">
				<div style={{display: "flex"}}>
					{addonConfiguration &&

						<div style={{flex: "50%", marginTop: "auto"}}>
							<Button appearance={"primary"} onClick={onReadyToStartClicked} isDisabled={showSpinner}>
								Ready to Start?
							</Button>
							<span style={{marginLeft: "1em", visibility: (showSpinner ? "visible" : "hidden")}}>
								<Spinner></Spinner>
							</span>
						</div>
					}

					<div style={{flex: "50%"}}>
						<BetterGoalsLogo/>
					</div>
				</div>
			</div>
		</div>
	);
};
