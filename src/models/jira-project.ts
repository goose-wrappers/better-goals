
export interface JiraProject {
	avatarUrls: Record<string, string>;
	id: string;
	key: string;
	name: string;
	lead?: JiraProjectLead;
	properties: Record<string, Record<string, any>>;
}

export interface JiraProjectLead {
	avatarUrls: Record<string, string>;
	displayName: string;
	active: boolean;
}
