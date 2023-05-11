import React, {FC, ReactElement, useEffect, useRef, useState} from "react";
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
import SectionMessage from "@atlaskit/section-message";
import CrossIcon from "@atlaskit/icon/glyph/cross";

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
	const [showFirstTip, setShowFirstTip] = useState(false);
	const [showWelcomeToFirstIteration, setShowWelcomeToFirstIteration] = useState(false);

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

		if (addonConfiguration) {
			const newConfiguration: AddonConfiguration = {...addonConfiguration};
			newConfiguration.iterationStartDate = value;
			setAddonConfiguration(newConfiguration);
		}
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

	const FirstTipView = () => {

		const ref = useRef<HTMLDivElement>(null);

		const onGotchaClicked = () => {
			if (ref.current) {
				ref.current.style.opacity = "0";
				setTimeout(() => setShowFirstTip(false), 1000);
			}
		};

		return (
			<div ref={ref} style={{transitionDuration: "0.25s"}}>
				<SectionMessage appearance={"discovery"} title="Tips! 🤔">
					<ul style={{padding: "0"}}>
						<li>Keep it short and measurable!</li>
						<li>Ensure your goals are descriptive!</li>
						<li>Make sure everybody understand the lingo!</li>
					</ul>
					<p>
						<a href="#" onClick={onGotchaClicked}>Gotcha!</a>
					</p>
				</SectionMessage>
			</div>
		);
	};

	useEffect(() => {

		boardService.getGoalHistory().then(goalHistory => {

			if (goalHistory.iterations.length === 0) {
				setShowFirstTip(true);
				setShowWelcomeToFirstIteration(true);
			}

			boardService.getConfiguration().then((configuration: AddonConfiguration) => {
				LoggerService.log("[WebPanel] loaded configuration", configuration);
				setAddonConfiguration(configuration);
			});
		});

		const fourWeeksAgo = new Date(+new Date() - 86400 * 4 * 7 * 1000).toISOString();
		LoggerService.log("[EditView] Setting minimum date to " + fourWeeksAgo);
		setMinimumDateInPicker(fourWeeksAgo);
	}, []);

	return (
		<div className="edit-view" style={{position: "relative"}}>
			<div style={{position: "absolute", right: "1em", zIndex: "100", cursor: "pointer"}} onClick={handleCloseDialog}>
				<CrossIcon label=""/>
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
							<div style={{width: "100%", display: "flex", flexDirection: "column"}}>
								{showWelcomeToFirstIteration &&
									<div style={{width: "100%", textAlign: "center", marginTop: "0.66em", fontSize: "1.15em"}}>
										Welcome to your first iteration! 🚀 🎉 🥰
									</div>
								}
								<div style={{flex: 1, marginTop: "1.25em"}}>

									<div style={{display: "flex", flexDirection: "row"}}>
										<div style={{flex: "2"}}>
											<div className={isInvalidGoal ? "field-validation-failed" : ""} onClick={() => setInvalidGoal(false)}>
												<MutableGoalList list={addonConfiguration.goals} onListChanged={handleListChanged} maxItems={3}/>
											</div>
											<div style={{width: "100%", marginTop: "2.5em"}}>
												<div>
													<div className="iteration-select-label">
														Iteration start date:
													</div>
													<div className="iteration-select-value" onClick={iterationStartClicked}>
														<div className={isInvalidDate ? "field-validation-failed" : ""}
															style={{padding: "4px"}}>
															{addonConfiguration.iterationStartDate}
														</div>
													</div>
												</div>

												<div>
													<div className="iteration-select-label">
														Iteration length:
													</div>
													<div className="iteration-select-value" onClick={iterationLengthClicked}>
														<div className={isInvalidDate ? "field-validation-failed" : ""}
															style={{padding: "4px"}}>
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
										<div style={{flex: "1"}}>
											{showFirstTip &&
												<FirstTipView/>
											}
										</div>
									</div>
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

					<div style={{flex: "50%", marginTop: "auto"}}>
						<BetterGoalsLogo/>
					</div>
				</div>
			</div>
		</div>
	);
};
