import React, {FC} from "react";
import Blanket from "@atlaskit/blanket";
import {DatePicker} from "@atlaskit/datetime-picker";

export const DatePickerWithBlanket: FC<{
	minDate: string;
	defaultValue: string;
	onChange: (value: string) => void;
	onBlankedClicked: () => void;
}> = ({minDate, defaultValue, onChange, onBlankedClicked}) => {
	return (
		<>
			<Blanket isTinted={true} onBlanketClicked={onBlankedClicked}/>
			<DatePicker

				selectProps={{
					menuPortalTarget: document.body,
					styles: {
						control: (base: any) => ({
							...base,
							display: "none",
						}),
						menuPortal: (base: any) => ({
							...base,
							top: "2em",
							left: "24em",
							zIndex: 9999,
						}),
					},
				}}

				spacing="compact"
				isOpen={true}
				minDate={minDate}
				defaultValue={defaultValue}
				onChange={onChange}
				hideIcon={true}
			/>
		</>
	);
};
