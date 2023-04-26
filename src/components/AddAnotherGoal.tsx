import React, {FC, Fragment, ReactElement, useState} from "react";
import {Field} from "@atlaskit/form";
import Checkbox from "@atlaskit/checkbox";
import {InlineEditableTextfield} from "@atlaskit/inline-edit";
import DragHandlerIcon from "@atlaskit/icon/glyph/drag-handler";
import {MyTextFieldWithEmoji} from "./MyTextFieldWithEmoji";

export const AddAnotherGoal: FC<{
	onSubmit?: (label: string) => void;
}> = ({onSubmit}): ReactElement => {

	const [showEditField, setShowEditField] = useState(false);

	const onLabelClicked = () => {
		setShowEditField(true);
	};

	const onEditCancelled = () => {
		setShowEditField(false);
	};

	const onConfirm = (label: string) => {
		if (onSubmit) {
			onSubmit(label);
		}

		setShowEditField(false);
	};

	return (
		<div className="add-another-goal">
			<Field aria-required={true}
			       name="Add another goal"
			       isRequired
			       defaultValue="">
				{() => (
					<Fragment>
						{!showEditField &&
							<>
								<div style={{float: "left", cursor: "move"}}>
									<DragHandlerIcon label=""/>
								</div>

								<div style={{float: "left", width: "50%"}} className="editable-goal-item">
									<div style={{color: "gray", fontStyle: "italic"}}>
										<Checkbox label="Add another goal" name="Add another goal" onClick={onLabelClicked} testId="add-another-goal-checkbox"/>
									</div>
								</div>

								<br style={{clear: "both"}} />
							</>
						}
						{showEditField &&
							<div style={{width: "50%"}}>
								<MyTextFieldWithEmoji defaultValue="" onChange={onConfirm}/>
							</div>
						}
					</Fragment>
				)}
			</Field>
		</div>
	);
};
