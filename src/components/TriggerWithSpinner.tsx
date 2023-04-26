import React, {FC, ReactElement, useState} from "react";
import Toggle from "@atlaskit/toggle";
import Spinner from "@atlaskit/spinner";

export const ToggleWithSpinner: FC<{
	defaultChecked: boolean;
	onChange: (checked: boolean) => void;
}> = ({defaultChecked, onChange}): ReactElement => {

	const [isSpinnerVisible, setSpinnerVisible] = useState(false);

	const onToggleChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		const checked = event.target.checked;
		setSpinnerVisible(true);
		setTimeout(() => setSpinnerVisible(false), 1000);

		onChange(checked);
	};

	return (
		<>
			<Toggle id="toggle-default" label="" defaultChecked={defaultChecked}
				onChange={onToggleChanged}/>
			{isSpinnerVisible &&
				<Spinner size="small" delay={0}/>
			}
		</>
	);
};
