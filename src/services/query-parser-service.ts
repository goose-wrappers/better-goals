export class QueryParserService {
	public static parse(queryString: string): Map<string, string> {
		if (queryString.startsWith("?")) {
			queryString = queryString.substring(1);
		}

		const out: Map<string, string> = new Map();
		const pairs = queryString.split("&");
		for (const pair of pairs) {
			const [key, value] = pair.split("=", 2);
			out.set(key, value);
		}

		return out;
	}
}
