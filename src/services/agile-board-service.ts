import {AtlassianClient} from "./atlassian-client";

export interface AgileBoard {
	boardId: number;
	boardName: string;
	boardType: string; // scrum
	projectKey: string;
	projectName: string;
	instanceName: string; // XXXXX.atlassian.net
}

interface GetBoardResponse {
	id: number;
	self: string;
	name: string;
	type: string;
	location: {
		projectId: number;
		displayName: string;
		projectName: string;
		projectKey: string;
		projectTypeKey: string;
		avatarURI: string;
		name: string;
	};
}

/* sample response from rest api
{
  "id": 4,
  "self": "https://frozengoose.atlassian.net/rest/agile/1.0/board/4",
  "name": "Goose Old Gen",
  "type": "scrum",
  "location": {
    "projectId": 10002,
    "displayName": "Goose Old Gen Sprint Test (GST)",
    "projectName": "Goose Old Gen Sprint Test",
    "projectKey": "GST",
    "projectTypeKey": "software",
    "avatarURI": "https://frozengoose.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10422?size=small",
    "name": "Goose Old Gen Sprint Test (GST)"
  }
}
*/

export class AgileBoardService {
	public getBoard(boardId: number): Promise<AgileBoard> {
		return new Promise((resolve) => {
			AtlassianClient.request({
				url: `/rest/agile/1.0/board/${boardId}`,
				type: "GET",
				contentType: "application/json",
			}).then((response) => {
				const body: GetBoardResponse = JSON.parse(response.body);
				const url = new URL(body.self);
				const instanceName = url.host;
				resolve({
					boardId,
					boardName: body.name,
					boardType: body.type,
					projectKey: body.location.projectKey,
					projectName: body.location.projectName,
					instanceName,
				});
			});
		});
	}
}
