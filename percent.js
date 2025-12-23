import { app, timeRecords } from "./island.js";
import path from "path";
import fs from "fs";

const configPath = path.join(app.getPath("userData"), "time_variables.json");

// defaults
let config = {
  sites:["YouTube", "Instagram","Discord","Reddit"],
  negatives: ["YouTube", "Instagram","Discord"],
  exceptions: ["Windows Explorer","Electron"]
};

// load config
if (fs.existsSync(configPath)) {
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (e) {
    console.error("Invalid config file, resetting", e);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
} else {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

// % calculator
function toPercent(timeRecords) {
  let totalTime = 0;
  let negativeTime = 0;

  for (const [app, time] of Object.entries(timeRecords)) {
    totalTime += time;

    if (config.negatives.includes(app)) {
      negativeTime += time;
    }

    if (config.exceptions.includes(app)) {
      continue;
    }
  }

  if (totalTime === 0) return 0;

  return Math.round((negativeTime / totalTime) * 100);
}

export { toPercent };
