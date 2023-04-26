import React, {FC, ReactElement, useEffect, useState} from "react";
import {LoggerService} from "../services/logger-service";
import ProgressBar from "@atlaskit/progress-bar";
import {IterationDurationUtils} from "../services/iteration-duration-utils";

export const DaysLeft: FC<{
	iteration_start_date: string;
	iteration_length_weeks: number;
	onNewIteration: () => void;
}> = ({iteration_start_date, iteration_length_weeks, onNewIteration}): ReactElement => {

	const [daysLeft, setDaysLeft] = useState(0);
	const [iterationProgress, setIterationProgress] = useState(0.0);
	const [iterationStartedAlready, setIterationStartedAlready] = useState(true);
	const [daysUntilIterationStarts, setDaysUntilIterationStarts] = useState(0);

	useEffect(() => {

		const now = new Date();
		LoggerService.log(`Calculating days left between now=${now}, startDate=${iteration_start_date}, lengthWeeks=${iteration_length_weeks}`);
		const daysLeft = IterationDurationUtils.daysUntilIterationEnds(now, iteration_start_date, iteration_length_weeks);
		setDaysLeft(daysLeft);

		const secondsElapsed = +now - +new Date(iteration_start_date);
		const secondsInIteration = 86400 * 1000 * (7 * iteration_length_weeks);
		const progress = Math.max(0.0, Math.min(1.0, secondsElapsed / secondsInIteration));
		setIterationProgress(progress);

		if (secondsElapsed < 0) {
			// haven't started yet
			const daysUntilStart = Math.floor((-secondsElapsed) / 1000 / 86400);
			setIterationStartedAlready(false);
			setDaysUntilIterationStarts(daysUntilStart);
		}

		LoggerService.log("Rendering DaysLeft with", daysLeft);
		LoggerService.log("Rendering progress with", progress);
	}, []);

	return (
		<div>
			<ProgressBar appearance={iterationProgress >= 1 ? "success" : "default"} value={iterationProgress}/>
			<div style={{paddingTop: "8px"}}>

				<div style={{fontSize: "1em", cursor: "default"}}>

					{iterationStartedAlready &&
						<>
							{daysLeft >= 1 &&
								<>{daysLeft} days left</>
							}

							{daysLeft >= 0 && daysLeft < 1 &&
								<>You have 1 day left 😱</>
							}

							{daysLeft < 0 &&
								<>Iteration ended ✅, <a style={{cursor: "pointer"}} onClick={onNewIteration}>start new iteration 🥳</a></>
							}
						</>
					}

					{!iterationStartedAlready &&
						<>
							Iteration starts in {daysUntilIterationStarts} days 🚀
						</>
					}
				</div>
			</div>
		</div>
	);
};
