import React, {FC} from "react";
import Blanket from "@atlaskit/blanket";
import Select from "@atlaskit/select";

export const SelectWithBlanket: FC<{
	placeholder: string;
	options: any;
	defaultValue: any;
	onChange: (newValue: any) => void;
	onBlanketClicked: () => void;
}> = ({placeholder, options, defaultValue, onChange, onBlanketClicked}) => {
	return (
		<>
			<Blanket isTinted={true} onBlanketClicked={onBlanketClicked}/>

			<Select
				/* rise above blanket */
				styles={{
					control: (base) => ({
						...base,
						display: "none",
					}),
					menu: (base) => ({
						...base,
						zIndex: "999",
						bottom: "-7em",
						left: "24em",
						width: "50%",
						cursor: "pointer",
					})
				}}

				menuPlacement="top"
				onChange={onChange}
				placeholder={placeholder}
				menuIsOpen={true}
				defaultValue={defaultValue}
				options={options}
			/>
		</>
	);
};
