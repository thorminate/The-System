import path from "path";
import fs from "fs";

interface Options {
  header: string;
  folder?: string;
  payload?: string;
  type?: "fatal" | "error" | "warn" | "info" | "verbose" | "debug" | "silly";
}

export default (options: Options) => {
  let { folder, payload, header, type } = options;

  if (!header) return;

  const date = new Date();

  if (!folder) folder = path.join(__dirname, "..", "..", "logs");

  const logStream = fs.createWriteStream(
    path.join(folder, `${date.toISOString().slice(0, 10)}.log`),
    { flags: "a" }
  );

  if (payload) {
    const logContent = `${header}\n${payload}\n`;
    switch (type) {
      case "fatal":
        logStream.write(`\x1b[35m${logContent}\x1b[0m`);
        break;
      case "error":
        logStream.write(`\x1b[31m${logContent}\x1b[0m`);
        break;
      case "warn":
        logStream.write(`\x1b[33m${logContent}\x1b[0m`);
        break;
      case "info":
        logStream.write(`\x1b[37m${logContent}\x1b[0m`);
        break;
      case "verbose":
        logStream.write(`\x1b[36m${logContent}\x1b[0m`);
        break;
      case "debug":
        logStream.write(`\x1b[35m${logContent}\x1b[0m`);
        break;
      case "silly":
        logStream.write(`\x1b[32m${logContent}\x1b[0m`);
        break;
      default:
        logStream.write(`${logContent}`);
        break;
    }
  } else {
    const logContent = `${header}\n`;
    switch (type) {
      case "fatal":
        logStream.write(`\x1b[35mFatal Error: ${logContent}\x1b[0m`);
        break;
      case "error":
        logStream.write(`\x1b[31mError: ${logContent}\x1b[0m`);
        break;
      case "warn":
        logStream.write(`\x1b[33mWarn${logContent}\x1b[0m`);
        break;
      case "info":
        logStream.write(`\x1b[37m${logContent}\x1b[0m`);
        break;
      case "verbose":
        logStream.write(`\x1b[36m${logContent}\x1b[0m`);
        break;
      case "debug":
        logStream.write(`\x1b[35m${logContent}\x1b[0m`);
        break;
      case "silly":
        logStream.write(`\x1b[32m${logContent}\x1b[0m`);
        break;
      default:
        logStream.write(`${logContent}`);
        break;
    }
  }
};
