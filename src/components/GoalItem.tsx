import React, {FC, ReactElement} from "react";
import {Goal} from "../models/goal";
import Checkbox from "@atlaskit/checkbox";

export const GoalItem: FC<{
	goal: Goal;
	onChange: (id: string, isComplete: boolean) => void;
}> = ({goal, onChange}): ReactElement => {

	const onCheckboxClicked = (e: any) => {
		const checked = e.target.checked;
		goal.isComplete = checked;
		onChange(goal.id, checked);
	};

	return (
		<div className="trimmed-checkbox">
			<Checkbox name={goal.label} label={goal.label} defaultChecked={goal.isComplete} onClick={onCheckboxClicked} size="large"/>
		</div>
	);
};

