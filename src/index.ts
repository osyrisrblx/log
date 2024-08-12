import process from "node:process";
import kleur from "kleur";

export interface StructuredLogAttributes {
	[index: string]: unknown;
}

export interface StructuredLog extends StructuredLogAttributes {
	// (required) The content of the log
	msg: string;

	// Severity of the log
	level: "debug" | "info" | "warn" | "error";
}

function createLogger(level: StructuredLog["level"], color: kleur.Color) {
	return (msg: string, attributes?: StructuredLogAttributes) => {
		if (process.env.NODE_ENV === "production") {
			console.log(JSON.stringify({ msg, level, ...attributes }));
		} else {
			const str = `[${color(level).padEnd(5, " ")}] ${msg}`;
			if (level === "error") {
				// for some reason, console.error is causing the first character to be red
				// kleur.reset seems to fix this
				console.error(kleur.reset(str));
			} else {
				console.log(str);
			}
		}
	};
}

export default {
	debug: createLogger("debug", kleur.blue),
	info: createLogger("info", kleur.white),
	warn: createLogger("warn", kleur.yellow),
	error: createLogger("error", kleur.red),
};
