import React, {FC, Fragment, MouseEventHandler, ReactElement} from "react";
import {Goal} from "../models/goal";
import {Field} from "@atlaskit/form";
import Checkbox from "@atlaskit/checkbox";
import EditorRemoveIcon from "@atlaskit/icon/glyph/editor/remove";

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

