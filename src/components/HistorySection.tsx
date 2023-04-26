import React, {FC, ReactElement} from "react";
import Checkbox from "@atlaskit/checkbox";
import {Goal} from "../models/goal";
import {GoalsIteration} from "../models/goals-history";

export const HistorySection: FC<{
	data: GoalsIteration;
}> = ({data}): ReactElement => {

	const options: Intl.DateTimeFormatOptions = {year: "numeric", month: "long", day: "numeric"};
	const startDate = (new Date(data.startDate)).toLocaleDateString("en-US", options);
	const endDate = (new Date(data.endDate)).toLocaleDateString("en-US", options);

	return (
		<>
			<h3>{startDate} &rarr; {endDate}</h3>
			<div style={{marginTop: "0.5em"}}>
				{data.goals.map((goal: Goal) =>
					<Checkbox label={goal.label} defaultChecked={goal.isComplete} isChecked={goal.isComplete} key={goal.id} />
				)}
			</div>
		</>
	);
};
