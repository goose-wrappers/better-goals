import React, {FC, Fragment, ReactElement, useState} from "react";
import {Goal} from "../models/goal";
import {Field} from "@atlaskit/form";
import Checkbox from "@atlaskit/checkbox";
import EditorRemoveIcon from "@atlaskit/icon/glyph/editor/remove";
import DragHandlerIcon from "@atlaskit/icon/glyph/drag-handler";
import {MyTextFieldWithEmoji} from "./MyTextFieldWithEmoji";

export const EditableGoalItem: FC<{
	goal: Goal;
	onChange: (id: string, isComplete: boolean) => void;
	onDelete: (id: string) => void;
}> = ({goal, onChange, onDelete}): ReactElement => {

	const [isInlineEdit, setIsInlineEdit] = useState(false);

	const handleCheckboxClicked = (goal: Goal, e: any, checked: boolean) => {
		// items cannot be checked here
		e.target.checked = false;
		e.target.blur();

		setIsInlineEdit(true);
	};

	const onTextChanged = (value: string) => {
		goal.label = value.trim();
		setIsInlineEdit(false);

		// delete items if the text suddenly becomes empty
		if (goal.label === '') {
			onDelete(goal.id);
		}
	};

	return (
		<Field
			aria-required={true}
			name={"goal__" + goal.label}
			isRequired
			defaultValue=""
		>
			{() => (
				<Fragment>
					<div style={{float: "left", cursor: "move"}}>
						<DragHandlerIcon label=""/>
					</div>

					<div style={{float: "left", width: "50%"}} className="editable-goal-item">
						{!isInlineEdit &&
							<div className="trimmed-checkbox" title={goal.label}>
								<Checkbox name={goal.label} label={goal.label} defaultChecked={goal.isComplete}
									  onClick={(e: any) => handleCheckboxClicked(goal, e, e.target.checked)}/>
							</div>
						}

						{isInlineEdit &&
							<MyTextFieldWithEmoji defaultValue={goal.label} onChange={onTextChanged}/>
						}
					</div>
					<div style={{float: "left"}}>
						{!isInlineEdit &&
							<a onClick={() => onDelete(goal.id)} style={{color: "black", cursor: "pointer"}}>
								<EditorRemoveIcon label="Delete goal"/>
							</a>
						}
					</div>
					<br style={{clear: "both"}}/>
				</Fragment>
			)}
		</Field>
	);
};

