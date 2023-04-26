import React, {FC, ReactElement, useRef} from "react";
import {AppearanceTypes} from "@atlaskit/flag/types";
import Flag from "@atlaskit/flag";

export const FadeOutFlag: FC<{
	title: string;
	appearance: AppearanceTypes;
	duration: number;
}> = ({title, appearance, duration}): ReactElement => {

	const ref = useRef<HTMLDivElement>(null);

	setTimeout(() => {
		if (ref.current) {
			ref.current.style.opacity = "0";
			setTimeout(() => {
				if (ref.current) {
					ref.current.style.display = "none";
				}
			}, 1000);
		}
	}, duration);

	return (
		<div style={{position: "fixed", zIndex: 100, width: "100%", transitionDuration: "1s"}} ref={ref}>
			<div style={{width: "75%", margin: "0 auto"}}>
				<Flag title={title} icon={null} id="1" description="" appearance={appearance}/>
			</div>
		</div>
	);
};
