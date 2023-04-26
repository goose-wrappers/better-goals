export class LoggerService {
	private static ENABLED = true;

	public static log(message: string, ...optionalParams: any[]): void {
		if (LoggerService.ENABLED) {
			console.log(message, ...optionalParams);
		}
	}

	public static dir(obj: object): void {
		if (LoggerService.ENABLED) {
			console.dir(obj);
		}
	}
}
