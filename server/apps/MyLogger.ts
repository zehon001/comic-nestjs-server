import { Logger } from "@nestjs/common";

export default class MyLogger {
	private context: string;
	constructor(context?: string) {
		this.context = context;
	}
	log(message: string, isTimeDiffEnabled?: boolean) {
		Logger.log(message, this.context, isTimeDiffEnabled);
	}
	error(message: string, trace?: string, isTimeDiffEnabled?: boolean) {
		Logger.error(message, trace, this.context, isTimeDiffEnabled);
	}
	warn(message: string, isTimeDiffEnabled?: boolean) {
		Logger.warn(message, this.context, isTimeDiffEnabled);
	}
	debug(message: string, isTimeDiffEnabled?: boolean) {
		Logger.debug(message, this.context, isTimeDiffEnabled);
	}
	verbose(message: string, isTimeDiffEnabled?: boolean) {
		Logger.verbose(message, this.context, isTimeDiffEnabled);
	}
}
