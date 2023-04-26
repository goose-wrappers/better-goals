# Better Goals

Better Goals (noun): a JIRA add-on to be a guiding north-star for product manager and team leaders; to commit to a 
short list of goals and to deliver on those goals.

##### Development

To get started with local development of this add-on, first clone this git repo and run the following.
Please make sure you have node 16.x installed.

One time installation:

1. `npm install --dev`

Workflow routine:

1. `npm start` # launches react-script server
2. `npm run local` # starts local development server
3. You will be given an ngrok url to atlassian-connect.json, open add-on management at: https://frozengoose.atlassian.net/plugins/servlet/upm?source=side_nav_manage_addons, click `Upload App` and paste the url here.

You can make changes to any of the files in `public/*` and in `src/*` without a need to restart any service.

If you stop `npm run local` and run it again, it will create a new ngrok tunnel, and you will have to re-install the app. Generally speaking, JIRA knows it's the same add-on, and will overwrite the previous installation. You only need to restart `npm run local` if you're making changes to `local-dev-setup.ts` file. npm