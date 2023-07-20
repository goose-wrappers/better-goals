import React, {FC, ReactElement, useEffect, useState} from "react";
//import WarningIcon from "@atlaskit/icon/glyph/warning";
import InfoIcon from "@atlaskit/icon/glyph/info";
import WarningIcon from "@atlaskit/icon/glyph/info";
import {P300,Y300} from "@atlaskit/theme/colors";
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
import {Goal} from "../models/goal";
import CrossIcon from "@atlaskit/icon/glyph/cross";
import {UserPropertiesService} from "../services/user-properties-service";

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
	const [showConfetti, setShowConfetti] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);


	const handleCloseDialog = () => {
		AtlassianClient.closeDialog();
	};

	const onCloseFlag = () => {
		setShowFlag(false);
	};

	const onConfigure = () => {
		setShowConfetti(false);

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

		// show confetti animation if new item checked, stop confetti otherwise
		setShowConfetti(isComplete);
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

		AtlassianClient.getCurrentUser().then(accountId => {
			const userService = new UserPropertiesService(accountId);
			userService.getProperties().then(result => {
				const keys = result.keys.map(pair => pair.key);
				LoggerService.log("Received these user properties:", keys);
				if (!keys.includes("better-goals-first-time")) {
					setShowFirstIterationCongrats(true);
					// hack: so we don't re-render this flag on checkbox change
					setTimeout(() => setShowFirstIterationCongrats(false), 5000);

					userService.putProperty("better-goals-first-time", true).then();
				}
			});
		});
	}, []);

	const IterationViewHeader = () => {
		return <>
			<div style={{float: "left"}}>
				<BetterGoalsLogo/>
			</div>
			<div style={{float: "right", cursor: "pointer"}} onClick={handleCloseDialog}>
				<CrossIcon label="" />
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
			<FadeOutFlag title="Congratulations! Enjoy your first iteration 🥳" appearance="success" duration={4000}/>
		);
	};

	function shouldShowPopup() {
		const today = new Date();
		const lastPopup = localStorage.getItem("lastPopup");
	
		if (lastPopup) {
			const lastPopupDate = new Date(parseInt(lastPopup));
			// Calculate the difference in months
			const diffInMonths = (today.getFullYear() * 12 + today.getMonth()) - 
				(lastPopupDate.getFullYear() * 12 + lastPopupDate.getMonth());
			
			if (diffInMonths >= 1) {
				// More than a month has passed
				localStorage.setItem("lastPopup", today.getTime().toString());
				return true;
			} else {
				// Less than a month has passed
				return false;
			}
		} else {
			// User has never seen the popup
			localStorage.setItem("lastPopup", today.getTime().toString());
			return true;
		}
	}
	
	const FeedbackCollector = () => {
		const onReviewClick = () => {
			window.open("https://marketplace.atlassian.com/apps/1231053/better-goals-for-kanban-boards?tab=reviews", "_blank");
		};
		
		const onContactUs = () => {
			window.open("https://goose-wrappers.atlassian.net/servicedesk/customer/portal/1/group/1/create/8","_blank");
		};
		return <>
			<Blanket isTinted={true} onBlanketClicked={onBlanketClicked}></Blanket>
			<div style={{position: "absolute", left: "25%", width: "50%"}}>
				<Flag icon={<InfoIcon primaryColor={token("color.icon.information", P300)} label="Info"/>} id="1" appearance="normal" title="Got a minute?? 🥺"
					description="Share your thoughts and help us make our product even better!"
					actions={[
						{content: "🎯 Review us!", onClick: onReviewClick},
						{content: "📩 Contact us", onClick: onContactUs},
					]}
				/>
			</div>
		</>;
	};

	useEffect(() => {
		if (shouldShowPopup()) {
			setShowFeedback(true);
		}
	},
	[]);

	const ConfettiGifForList: FC<{
		list: Array<Goal>;
		onAnimationEnd: () => void;
	}> = ({list, onAnimationEnd}): ReactElement => {

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

		const [visible, setVisible] = useState(true);

		const fadeOut = () => {
			setVisible(false);
			onAnimationEnd();
		};

		useEffect(() => {
			const timeoutId = setTimeout(() => fadeOut(), 3000);
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
		const top = cones >= 4;

		return (
			<div>
				{bottomLeft &&
					<img src="https://i.imgur.com/gWIch1F.gif" alt="" className="confetti-gif confetti-gif-bl"/>
				}

				{bottomRight &&
					<img src="https://i.imgur.com/gWIch1F.gif" alt="" className="confetti-gif confetti-gif-br"/>
				}

				{top &&
					<img src="https://i.imgur.com/gWIch1F.gif" alt="" className="confetti-gif confetti-gif-tl"/>
				}

				{top &&
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
			{showFeedback && <FeedbackCollector/>}

			<div style={{width: "100%", display: "flex", flexDirection: "column", height: "100%"}}>
				<div className="dialog-header">
					<IterationViewHeader/>
				</div>
				{addonConfiguration && showConfetti &&
					<ConfettiGifForList list={addonConfiguration.goals} onAnimationEnd={() => setShowConfetti(false)}/>
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
