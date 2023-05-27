import React from "react";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MutableGoalList} from "./MutableGoalList";
import {Goal} from "../models/goal";

const mockList: Array<Goal> = [
	{id: "1", label: "Goal 1", isComplete: false},
	{id: "2", label: "Goal 2", isComplete: false},
];

const mockOnListChanged = jest.fn();

const renderMutableGoalList = () =>
	render(
		<MutableGoalList
			list={mockList}
			onListChanged={mockOnListChanged}
			maxItems={10}
		/>
	);

beforeEach(() => {
	mockOnListChanged.mockReset();
});

test("adds a new goal", async () => {
	renderMutableGoalList();

	const MY_TEXTFIELD_WITH_EMOJI_ID = "my-textfield-with-emoji";
	const EMOJI_ICON_IN_TEXTFIELD_ID = "emoji-icon-in-textfield";

	// by default, the inline edit is disabled
	expect(await screen.queryByTestId(EMOJI_ICON_IN_TEXTFIELD_ID)).toBeNull();

	// clicking on the label "Add Another Goal"
	const addAnotherGoalCheckbox = await screen.getByTestId("add-another-goal-checkbox--checkbox-label");
	await userEvent.click(addAnotherGoalCheckbox);

	// now the ui has been replaced, the checkbox is gone, and we have textfield + emoji icon, emoji picker not in DOM
	await screen.getByTestId(MY_TEXTFIELD_WITH_EMOJI_ID);
	await screen.getByTestId(EMOJI_ICON_IN_TEXTFIELD_ID);
	expect(await screen.queryByTestId("emoji-picker")).toBeNull();
});
