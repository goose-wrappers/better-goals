# Better Goals 🎯 for JIRA Kanban Boards

Better Goals (noun): a JIRA add-on to be a guiding north-star for product manager and team leaders; to commit to a 
short list of goals and to deliver on those goals.

As a team working on any fast-paced environment, you may often find yourselves drowning in JIRA tickets. It's easy to lose sight of the bigger picture – the actual business, engineering, or product goals that matter most. That's where Better Goals comes in.

Better Goals is a powerful JIRA Marketplace app designed to help teams align their work with measurable outcomes, ensuring that they stay focused on the right measurable objectives. Our app aims to make your North Star visible and accessible, so your team can stay on track and adapt quickly to new information, datapoint or priority emerging. 

Available for install on the Atlassian Marketplace! 
https://marketplace.atlassian.com/apps/1231053/better-goals-for-kanban-boards

<img width="1207" alt="image" src="https://user-images.githubusercontent.com/129691702/235436445-ed6c57fb-babc-46a9-9054-61218733d17d.png">


Our design is open sourced too, check it out in Figma!
https://www.figma.com/community/file/1237139831380534311

Share feedback, questions or report bugs here:
https://goose-wrappers.atlassian.net/servicedesk/customer/portal/1

##### Development

To get started with local development of this add-on, first clone this git repo and run the following.
Please make sure you have node 16.x installed.

One time installation:

1. `npm install --dev`

Workflow routine:

1. `npm start` # launches react-script server
2. `npm run local` # starts local development server
3. You will be given an ngrok url to atlassian-connect.json, open add-on management by clicking `Apps -> Manage your apps` in Jira, then click on `Upload App` and paste the url here.

You can make changes to any of the files in `public/*` and in `src/*` without a need to restart any service.

If you stop `npm run local` and run it again, it will create a new ngrok tunnel, and you will have to re-install the app. Generally speaking, JIRA knows it's the same add-on, and will overwrite the previous installation. You only need to restart `npm run local` if you're modifying `local-dev-setup.ts`.
