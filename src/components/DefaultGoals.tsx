import {Field} from "@atlaskit/form";
import React, {FC, Fragment, ReactElement} from "react";
import Checkbox from "@atlaskit/checkbox";
import {Goal} from "../models/goal";

export const DefaultGoals: FC = (): ReactElement => {

	const defaults: Array<Goal> = [
		// {label: "Switch traffic to AWS ❤️🥶", isComplete: false},
		// {label: "Finish wireframes and approve by marketing 👩🏼‍🎨", isComplete: false},
		// {label: "Release SSO support to 30% 🥷🏻", isComplete: true},
		{id: "00000000-0000-0000-0000-000000000000", label: "This is your first goal! Click here to edit!", isComplete: false},
	];

	return (
		<div style={{width: "400px"}}>
			{defaults.map(goal =>
				<Field
					aria-required={true}
					key={goal.id}
					name={goal.label}
					isRequired
					defaultValue=""
				>
					{() => (
						<Fragment>
							<Checkbox name={goal.label} label={goal.label} defaultChecked={goal.isComplete}/>
						</Fragment>
					)}
				</Field>
			)}
		</div>
	);
};
