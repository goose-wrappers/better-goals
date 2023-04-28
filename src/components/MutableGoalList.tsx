import React, {FC, ReactElement, useEffect, useState} from "react";
import {Goal} from "../models/goal";
import {AddAnotherGoal} from "./AddAnotherGoal";
import {EditableGoalItem} from "./EditableGoalItem";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";

export const MutableGoalList: FC<{
	list: Array<Goal>;
	onListChanged: (list: Array<Goal>) => void;
	maxItems: number;
}> = ({list, onListChanged, maxItems}): ReactElement => {

	const [showAddAnotherGoal, setShowAddAnotherGoal] = useState(false);

	const onGoalAdded = (label: string) => {
		if (label.trim().length === 0) {
			return;
		}

		const goal: Goal = {
			id: crypto.randomUUID(),
			label: label.trim(),
			isComplete: false
		};

		const updated = [...list, goal];

		onListChanged(updated);
		setShowAddAnotherGoal(updated.length < maxItems);
	};

	const onDeleteGoal = (id: string) => {
		const updated = list.filter((goal: Goal) => goal.id !== id);
		onListChanged(updated);

		setShowAddAnotherGoal(updated.length < maxItems);
	};

	const onDragEnd = (result: DropResult) => {
		if (result.destination) {
			const fromIndex = result.source.index;
			const toIndex = result.destination.index;

			const newList = Array.from(list);
			const [removed] = newList.splice(fromIndex, 1);
			newList.splice(toIndex, 0, removed);

			onListChanged(newList);
		}
	};

	useEffect(() => {
		setShowAddAnotherGoal(list.length < maxItems);
	}, []);

	return (
		<>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="droppable">
					{(provided) => (
						<div
							{...provided.droppableProps}
							ref={provided.innerRef}
							// style={{background: "white", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
						>
							{list.map((goal, index) =>
								<Draggable draggableId={goal.id} key={goal.id} index={index}>
									{(provided) => (
										<div ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}>
											<EditableGoalItem key={goal.id} goal={goal} onDelete={onDeleteGoal}/>
										</div>
									)}
								</Draggable>
							)}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			{showAddAnotherGoal &&
				<AddAnotherGoal onSubmit={(label) => onGoalAdded(label)}/>
			}
		</>
	);
};
