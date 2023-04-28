import React, {FC, ReactElement, useEffect, useState} from "react";

export const TipView: FC<{
	daysLeft: number;
}> = ({daysLeft}): ReactElement => {

	const [message, setMessage] = useState<ReactElement>();

	useEffect(() => {
		// first time user
		// first 20% of iteration
		// up to 80% of iteration
		// beyond 80% of iteration
		if (daysLeft > 0) {
			setMessage(
				<>
					How to facilitate effective discussions around your goals during standup: <a href="https://medium.com/@kristof.muhi.goose" target="_blank"
						rel="noreferrer noopener">https://medium.com/better-goals</a>
				</>
			);
		}
	}, []);

	return (
		<div className="tip-view">
			{message}
		</div>
	);
};
