import React from "react";
import {useRouteError} from "react-router-dom";

type ErrorResponse = {
	status: number;
	statusText: string;
};

export class ErrorPage extends React.Component {

	public render() {
		const error = useRouteError() as ErrorResponse;

		let message;

		if (error.status === 404) {
			message = (<p>There is nothing here.</p>);
		} else if (error.status === 500) {
			message = <p>There was a problem fetching the data for this page.</p>;
		} else {
			message = <p>An unexpected error occurred.</p>;
		}

		let title = "Error";
		if (error.statusText) {
			title = error.statusText;
		}

		return (<div title={title}>{message}</div>);
	}
}
