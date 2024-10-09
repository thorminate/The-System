import path from "path";

export default (logFolder: string, logHeader: string, logPayload?: string) => {
  const date = new Date();
  const logFile = `${date.toISOString().slice(0, 10)}_${date
    .toTimeString()
    .slice(0, 8)}.log`;

  const logPath = path.join(logFolder, logFile);

  const logStream = require("fs").createWriteStream(logPath, { flags: "a" });

  if (logPayload) {
    const logContent = `${logHeader}\n${logPayload}\n`;
    logStream.write(logContent);
  } else {
    const logContent = `${logHeader}\n`;
    logStream.write(logContent);
  }
};
