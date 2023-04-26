export class DateUtils {
	public static getDateAsIso(): string {
		const now = new Date().toISOString();
		const p = now.indexOf("T");
		return now.substring(0, p);
	}
}
