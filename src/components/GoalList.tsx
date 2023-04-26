import React, {FC, ReactElement} from "react";
import {Goal} from "../models/goal";
import {GoalItem} from "./GoalItem";

export const GoalList: FC<{
	list: Array<Goal>;
	onChange: (id: string, isComplete: boolean) => void;
}> = ({list, onChange}): ReactElement => {

	return (
		<>
			{list.map(goal =>
				<GoalItem key={goal.label} goal={goal} onChange={onChange} />
			)}
		</>
	);
};
