import React, {FC, ReactElement, useEffect, useRef, useState} from "react";
import Blanket from "@atlaskit/blanket";
import Flag from "@atlaskit/flag";
import WarningIcon from "@atlaskit/icon/glyph/warning";
import {token} from "@atlaskit/tokens";

export const LicenseMissing: FC = (): ReactElement => {

	const [showFlag, setShowFlag] = useState(true);
	const ref = useRef<HTMLDivElement>(null);

	const onUnderstoodClicked = () => {
		setShowFlag(false);
	};

	useEffect(() => {
		setTimeout(() => {
			if (ref.current) {
				const button = ref.current.querySelector("button");
				if (button) {
					button.click();
					button.remove();
				}
			}
		}, 1);
	}, []);

	return (
		<>
			{showFlag &&
				<>
					<Blanket isTinted={true} onBlanketClicked={onUnderstoodClicked}/>

					<div style={{width: "80%", position: "absolute", zIndex: "999"}} ref={ref}>
						<Flag
							title="Unable to verify your current license 😔"
							description="Please reach out to your JIRA administrator to check the license status."
							id={1}
							appearance="error"
							icon={<WarningIcon primaryColor={token("color.icon.warning")} label="Warning"/>}
							actions={[
								{content: "Understood", onClick: onUnderstoodClicked},
							]}
						/>
					</div>
				</>
			}
		</>
	);
};

