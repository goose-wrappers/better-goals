import React, {FC, ReactElement} from "react";
import DropdownMenu, {DropdownItem, DropdownItemGroup} from "@atlaskit/dropdown-menu";
import PageHeader from "@atlaskit/page-header";

export const ConfigurationPage: FC = (): ReactElement => {

	return (
		<div id="page" className="ac-content">
			<section id="content" role="main">
				<header className="aui-page-header">
					<div className="aui-page-header-inner">
						<div className="aui-page-header-main">
							<div style={{float: "left"}}>
								<PageHeader>
									Better Goals 🎯
								</PageHeader>
							</div>
							<div style={{float: "right"}}>
								<DropdownMenu trigger="Reminder Setup">
									<DropdownItemGroup>
										<DropdownItem>Email...</DropdownItem>
										<DropdownItem>Slack...</DropdownItem>
										<DropdownItem>Stand-up Config</DropdownItem>
									</DropdownItemGroup>
								</DropdownMenu>
							</div>
							<br style={{clear: "both"}}/>

							<p>
								Better Goals make sure you always have your north-star right in-front of you. Commit to goals and always be on track.
							</p>
						</div>
					</div>
				</header>
				<div className="aui-page-panel" style={{paddingTop: "24px"}}>
					<div className="aui-page-panel-inner">
						<section className="aui-page-panel-content">

							Sorry, page deprecated
						</section>
					</div>
				</div>
			</section>
		</div>
	);
};
