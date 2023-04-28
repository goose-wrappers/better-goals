import React, {FC, ReactElement} from "react";
import {Goal} from "../models/goal";
import Checkbox from "@atlaskit/checkbox";

export const GoalItem: FC<{
	goal: Goal;
	onChange: (id: string, isComplete: boolean) => void;
}> = ({goal, onChange}): ReactElement => {

	const handleCheckboxClicked = (goal: Goal, checked: boolean) => {
		goal.isComplete = checked;
		onChange(goal.id, checked);
	};

	return (
		<div className="trimmed-checkbox">
			<Checkbox name={goal.label} label={goal.label} defaultChecked={goal.isComplete} onClick={(e: any) => handleCheckboxClicked(goal, e.target.checked)} size="large"/>
		</div>
	);
};

