import React, {FC, Fragment, ReactElement, useState} from "react";
import {Field} from "@atlaskit/form";
import Checkbox from "@atlaskit/checkbox";
import DragHandlerIcon from "@atlaskit/icon/glyph/drag-handler";
import {MyTextFieldWithEmoji} from "./MyTextFieldWithEmoji";

export const AddAnotherGoal: FC<{
	label: string;
	onSubmit: (label: string) => void;
}> = ({label, onSubmit}): ReactElement => {

	const [showEditField, setShowEditField] = useState(false);

	const onLabelClicked = () => {
		setShowEditField(true);
	};

	const onConfirm = (label: string) => {
		onSubmit(label);
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

								<div style={{float: "left", width: "calc(100% - 64px)"}}>
									<div style={{color: "gray", fontStyle: "italic"}}>
										<Checkbox label={label} name="Add another goal" onClick={onLabelClicked} testId="add-another-goal-checkbox"/>
									</div>
								</div>

								<br style={{clear: "both"}} />
							</>
						}
						{showEditField &&
							<div style={{width: "calc(100% - 64px)"}}>
								<MyTextFieldWithEmoji defaultValue="" onChange={onConfirm}/>
							</div>
						}
					</Fragment>
				)}
			</Field>
		</div>
	);
};
