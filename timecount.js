import {app} from "./island.js";
import activeWin from "active-win";
import path from "path";
import fs from "fs";

const configPath = path.join(app.getPath("userData"), "time_variables.json");

// defaults
let config = {
  sites:["YouTube", "Instagram","Discord","Reddit"],
  negative_apps: ["YouTube", "Instagram","Discord"],
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



function timeCount() {
  let timeRecords = {};
  setInterval(async () => {
    const active = await activeWin();
    const browsersList = ["Brave Browser","Google Chrome","Mozilla Firefox","Microsoft Edge"];
    if (active) {
      //console.log(`🪟 Active App: ${active.owner.name}`);
    // console.log(`📄 Window Title: ${active.title}`);
      if (config.exceptions.includes(active.owner.name)) {

      }
      else if (browsersList.includes(active.owner.name)) {
  let matchedSite = null;

  for (const site of config.sites) {
    if (active.title.toLowerCase().includes(site.toLowerCase())) {
      matchedSite = site;
      break;
    }
  }

  if (matchedSite) {
    timeRecords[matchedSite] = (timeRecords[matchedSite] || 0) + 1;
  } else {
    timeRecords[active.owner.name] =
      (timeRecords[active.owner.name] || 0) + 1;
  }
}

      else {
        timeRecords[active.owner.name] = (timeRecords[active.owner.name] || 0) + 1;
      }
    } else {
      console.log("No active window detected 😴");
    }
  }, 1000); // runs every 2 sec

  return timeRecords;
}

function toHMS(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return `${h}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

function formattedTime(timeRecords) {
  const formatted = {};

  for (const app in timeRecords) {
    formatted[app] = toHMS(timeRecords[app]);
  }

  return formatted;
}

export {timeCount,formattedTime};