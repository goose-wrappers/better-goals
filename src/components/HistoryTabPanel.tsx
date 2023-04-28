import React, {FC, ReactElement, useEffect, useState} from "react";
import {BoardService} from "../services/board-service";
import {HistorySection} from "./HistorySection";
import {GoalsHistory} from "../models/goals-history";
import Spinner from "@atlaskit/spinner";

export const HistoryTabPanel: FC<{
	boardService: BoardService;
}> = ({boardService}): ReactElement => {

	const [history, setHistory] = useState<GoalsHistory>();

	useEffect(() => {
		boardService.getGoalHistory().then(history => {
			setHistory(history);
		});
	}, []);

	return (
		<div style={{width: "100%", height: "calc(100vh - 200px)", overflowY: "scroll"}}>
			{!history &&
				<Spinner/>
			}

			{history && history.iterations.length == 0 &&
				<>
					You will see all your history here after your first successfully completed iteration!🥳🚀
				</>
			}

			{history && history.iterations.length > 0 &&
				history.iterations.map(h =>
					<HistorySection data={h} key={h.startDate}/>
				)
			}
		</div>
	);
};

