import React from "react";
import ReactDOM from "react-dom";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "@atlaskit/css-reset";
import {ErrorPage} from "./components/ErrorPage";
import {WebPanel} from "./components/WebPanel";
import {ConfigurationPage} from "./components/ConfigurationPage";
import {IndexPage} from "./components/IndexPage";
import {GlobalConfigurationPage} from "./components/GlobalConfigurationPage";

const router = createBrowserRouter([
	{
		path: "/configuration",
		element: <ConfigurationPage/>,
		errorElement: <ErrorPage/>,
	},
	{
		path: "/webpanel",
		element: <WebPanel/>,
		errorElement: <ErrorPage/>,
	},
	{
		path: "/global-configuration",
		element: <GlobalConfigurationPage/>,
		errorElement: <ErrorPage/>
	},
	{
		path: "/",
		element: <IndexPage/>,
		errorElement: <ErrorPage/>,
	}
]);

ReactDOM.render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>,
	document.getElementById("root")
);
