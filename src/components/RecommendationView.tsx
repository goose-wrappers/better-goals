import React, {FC, ReactElement} from "react";

export const RecommendationView: FC = (): ReactElement => {

	return (
		<div style={{marginTop: "2em"}}>
			<div style={{overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "1em"}}>
				<div className="recommendation-item">
					<a href="https://creately.medium.com/how-to-build-better-alignment-between-your-product-and-marketing-teams-ab8f9c6c9a06" target="_blank" rel="noreferrer noopener">
						<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HgX5lt_jVi4hPZMRC7aGoA.png" alt=""/>
					</a>
				</div>
				<div className="recommendation-item">
					<a href="https://medium.com/the-liberators/the-daily-goal-467c4c10b662" target="_blank" rel="noreferrer noopener">
						<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/0*81uoVh2B2SLsFAt5.jpg" alt=""/>
					</a>
				</div>
				<div className="recommendation-item">
					<a href="https://medium.com/the-liberators/examples-of-real-sprint-goals-670f917ba2cd" target="_blank" rel="noreferrer noopener">
						<img src="https://miro.medium.com/v2/resize:fit:1200/1*XDby1-XRXOm9iaekJmUIsw.jpeg" alt=""/>
					</a>
				</div>
				<div className="recommendation-item">
					<a href="https://medium.com/the-liberators/10-powerful-questions-to-create-better-sprint-goals-e21c19580c77" target="_blank" rel="noreferrer noopener">
						<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*v1h4b3j9oWf5wlpRyEueig.jpeg" alt=""/>
					</a>
				</div>
			</div>
		</div>
	);
};

