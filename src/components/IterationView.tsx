import React, {FC, ReactElement, useEffect, useState} from "react";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import {Y300} from "@atlaskit/theme/colors";
import {token} from "@atlaskit/tokens";
import {AtlassianClient} from "../services/atlassian-client";
import {BetterGoalsLogo} from "./BetterGoalsLogo";
import {DaysLeft} from "./DaysLeft";
import {BoardService} from "../services/board-service";
import {AddonConfiguration} from "../models/addon-configuration";
import {LoggerService} from "../services/logger-service";
import Settings from "@atlaskit/icon/glyph/editor/settings";
import {GoalList} from "./GoalList";
import Flag from "@atlaskit/flag";
// import {RecommendationView} from "./RecommendationView";
import Blanket from "@atlaskit/blanket";
import Spinner from "@atlaskit/spinner";
import Button from "@atlaskit/button";
import {TipView} from "./TipView";
import {FadeOutFlag} from "./FadeOutFlag";
import {GoalsHistory} from "../models/goals-history";
import {Goal} from "../models/goal";

export const IterationView: FC<{
	boardService: BoardService;
	onConfigureClicked: () => void;
	onStartNewIterationClicked: () => void;
}> = ({boardService, onConfigureClicked, onStartNewIterationClicked}): ReactElement => {

	const [showFlag, setShowFlag] = useState(false);
	const [addonConfiguration, setAddonConfiguration] = useState<AddonConfiguration>();
	// const [showRecommendations, setShowRecommendations] = useState(false);
	const [showTips, setShowTips] = useState(false);
	const [showStartNewIteration, setShowStartNewIteration] = useState(false);
	const [showFirstIterationCongrats, setShowFirstIterationCongrats] = useState(false);

	const handleCloseDialog = () => {
		AtlassianClient.closeDialog();
	};

	const onCloseFlag = () => {
		setShowFlag(false);
	};

	const onConfigure = () => {
		if (addonConfiguration) {
			const now = new Date().toISOString();
			const iterationStarted = now >= addonConfiguration.iterationStartDate;

			if (iterationStarted) {
				// already started with this iteration, present an alert
				setShowFlag(true);
			} else {
				// starts in the future, then go directly into edit mode
				onConfigureClicked();
			}
		}
	};

	const onBlanketClicked = () => {
		setShowFlag(false);
	};

	const onGoalListChanged = (id: string, isComplete: boolean) => {
		if (addonConfiguration) {

			const newConfiguration = {...addonConfiguration};

			newConfiguration.goals.forEach((goal) => {
				if (goal.id === id) {
					goal.isComplete = isComplete;
				}
			});

			setAddonConfiguration(newConfiguration);

			const allDone = newConfiguration.goals.filter(goal => goal.isComplete).length == newConfiguration.goals.length;
			setShowStartNewIteration(allDone);

			boardService.saveConfiguration(newConfiguration).then();
		}
	};

	useEffect(() => {
		boardService.getConfiguration().then((configuration: AddonConfiguration) => {
			LoggerService.log("[WebPanel] loaded configuration", configuration);
			setAddonConfiguration(configuration);

			const allDone = configuration.goals.filter(goal => goal.isComplete).length == configuration.goals.length;
			setShowStartNewIteration(allDone);

			// setShowRecommendations(true);
			setShowTips(true);
		});

		boardService.getGoalHistory().then((result: GoalsHistory) => {
			if (result.iterations.length === 0) {
				setShowFirstIterationCongrats(true);
				// hack: so we don't re-render this flag on checkbox change
				setTimeout(() => setShowFirstIterationCongrats(false), 5000);
			}
		});
	}, []);

	const IterationViewHeader = () => {
		return <>
			<div style={{float: "left"}}>
				<BetterGoalsLogo/>
			</div>
			<div style={{float: "right", fontSize: "1.5em"}}>
				<span style={{cursor: "pointer", color: "black"}} onClick={handleCloseDialog}>&times;</span>
			</div>
			<br style={{clear: "both"}}/>
		</>;
	};

	const IterationViewFooter = () => {
		return (<>
			<div style={{display: "flex", flexDirection: "row"}}>
				<div style={{flex: "50%"}}>
					{!showStartNewIteration && showTips && <TipView daysLeft={4}/>}
				</div>
				<div style={{flex: "25%", marginTop: "auto"}}>
					<div style={{display: "table", marginLeft: "auto", marginRight: "0"}}>
						<div style={{display: "table-cell", verticalAlign: "middle"}}>
							<Settings label="Configure" primaryColor="#333"/>
						</div>
						<div style={{display: "table-cell", verticalAlign: "middle", paddingLeft: "0.1em", paddingBottom: "0.19em"}}>
							<a style={{cursor: "pointer", textDecoration: "none", color: "#333"}} onClick={onConfigure}>Edit Goals</a>
						</div>
					</div>
				</div>
			</div>
		</>);
	};

	const EditIterationFlag = () => {
		return <>
			<Blanket isTinted={true} onBlanketClicked={onBlanketClicked}></Blanket>
			<div style={{position: "absolute", width: "100%"}}>
				<Flag icon={<WarningIcon primaryColor={token("color.icon.information", Y300)} label="Warning"/>} id="1" appearance="normal" title="Oh Oh!"
					description="Are you sure you want to edit your ongoing iteration?"
					actions={[
						{content: "Yes!", onClick: onConfigureClicked},
						{content: "Not now", onClick: onCloseFlag},
					]}
				/>
			</div>
		</>;
	};

	const StartNewIteration = (): ReactElement => {

		const [showSpinner, setShowSpinner] = useState(false);

		const handleStartNewIteration = () => {
			setShowSpinner(true);
			onStartNewIterationClicked();
		};

		return <>
			<div style={{textAlign: "center", width: "100%"}}>
				<Button appearance={"primary"} onClick={handleStartNewIteration} isDisabled={showSpinner}>
					Start a new iteration! 🥳
				</Button>

				{showSpinner &&
					<div style={{display: "inline-block", marginLeft: "1em"}}>
						<Spinner delay={0}/>
					</div>
				}
			</div>
		</>;
	};

	const FirstIterationCongratulations = (): ReactElement => {
		return (
			<FadeOutFlag title="Congratulations! Enjoy your first iteration 🥳" appearance="success" duration={3000}/>
		);
	};

	const ConfettiGifForList: FC<{
		list: Array<Goal>
	}> = ({list}): ReactElement => {

		let cones = 0;

		if (list.length > 0) {
			const itemsDone = list.filter(goal => goal.isComplete).length;
			if (itemsDone == list.length) {
				// 1/1, 2/2, 3/3
				cones = 4;
			} else {
				if (itemsDone === 1 && list.length === 2) {
					// 1/2
					cones = 2;
				} else {
					// 1/3, 2/3
					cones = itemsDone;
				}
			}
		}

		const [timeoutId, setTimeoutId] = useState<NodeJS.Timer>();
		const [visible, setVisible] = useState(true);

		const fadeOut = () => {
			setVisible(false);
		};

		useEffect(() => {
			const id = setTimeout(() => fadeOut(), 3000);
			setTimeoutId(id);

			return () => {
				clearTimeout(timeoutId);
			};
		}, []);

		return (
			<>
				{visible &&
					<ConfettiGif cones={cones}/>
				}
			</>
		);
	};

	const ConfettiGif: FC<{
		cones: number;
	}> = ({cones}): ReactElement => {

		const bottomLeft = cones >= 1;
		const bottomRight = cones >= 2;
		const topLeft = cones >= 4;
		const topRight = topLeft;

		return (
			<div>
				{bottomLeft &&
					<img src="https://i.imgur.com/gWIch1F.gif" alt="" className="confetti-gif confetti-gif-bl"/>
				}

				{bottomRight &&
					<img src="https://i.imgur.com/gWIch1F.gif" alt="" className="confetti-gif confetti-gif-br"/>
				}

				{topLeft &&
					<img src="https://i.imgur.com/gWIch1F.gif" alt="" className="confetti-gif confetti-gif-tl"/>
				}

				{topRight &&
					<img src="https://i.imgur.com/gWIch1F.gif" alt="" className="confetti-gif confetti-gif-tr"/>
				}
			</div>
		);
	};

	return (
		<div style={{position: "relative", height: "100%"}} className="iteration-view">

			{/* flag modal to bail out into configuration view */}
			{showFlag && <EditIterationFlag/>}

			{showFirstIterationCongrats && <FirstIterationCongratulations/>}

			<div style={{width: "100%", display: "flex", flexDirection: "column", height: "100%"}}>
				<div className="dialog-header">
					<IterationViewHeader/>
				</div>
				{addonConfiguration &&
					<ConfettiGifForList list={addonConfiguration.goals}/>
				}
				<div style={{flex: 1}}>
					<div style={{height: "100%"}}>

						{/* show spinner until configuration loaded */}
						{!addonConfiguration && <Spinner/>}

						{/* the dialog content itself */}
						{addonConfiguration &&
							<>
								<div style={{marginTop: "1.5em", width: "100%", display: "flex", flexDirection: "column", height: "100%"}}>
									<div style={{flex: 1, fontSize: "1.2em"}}>
										<GoalList list={addonConfiguration.goals} onChange={onGoalListChanged}/>
									</div>

									<div style={{flex: 1}}>
										<div style={{width: "75%", margin: "auto", textAlign: "center", marginTop: "2em", paddingBottom: "1em"}}>
											<DaysLeft iteration_length_weeks={addonConfiguration.iterationLengthWeeks}
												iteration_start_date={addonConfiguration.iterationStartDate}
												onNewIteration={onStartNewIterationClicked}/>
										</div>

										{/* start new iteration button when all tasks complete */}
										{showStartNewIteration && <StartNewIteration/>}

										{/* recommendations carousel */}
										{/* !showStartNewIteration && showRecommendations && <RecommendationView/> */}

									</div>
								</div>
							</>
						}
					</div>
				</div>
				<div className="dialog-footer">
					<IterationViewFooter/>
				</div>
			</div>
		</div>
	);
};
