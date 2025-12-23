import { app, globalShortcut, Tray, BrowserWindow, Menu, ipcMain} from "electron";
import {timeCount,formattedTime} from "./timecount.js";
import {toPercent} from "./percent.js";
import path from "path";
import { fileURLToPath } from "url";

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    // If user opens app again → bring window to front
    if (overlayWindow) {
      overlayWindow.show();
      overlayWindow.focus();
    }
  });
}

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
webPreferences: {
  preload: path.join(__dirname, 'preload.js')
}


const timeRecords = timeCount();

let overlayWindow;
let isWindowOpen = false;
let tray;

function createTray() {
  tray = new Tray(path.join(__dirname, "icon.png")); // replace with your icon path
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: "Show/Hide", 
      click: () => {
        if (!overlayWindow) createWindow();
        else {
          overlayWindow.show();
          overlayWindow.focus();
        }
      } 
    },
    { label: "Quit", click: () => app.quit() }
  ]);
  tray.setToolTip("Overlay");
  tray.setContextMenu(contextMenu);

  // optional: click on tray icon toggles window
  tray.on("click", () => {
    if (!overlayWindow) createWindow();
    else {
      overlayWindow.show();
      overlayWindow.focus();
    }
  });
}

const createWindow = () => {
  overlayWindow = new BrowserWindow({
    backgroundColor: "rgba(82, 82, 82, 0)",
    backgroundMaterial: "none",
    transparent: true,
    width: 1920,
    height: 1080,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      contextIsolation: true,
      webSecurity: false,
      nodeIntegration: false,
    },
  });
  overlayWindow.maximize();
  overlayWindow.loadFile("new.html");

  overlayWindow.on("closed", () => {
    overlayWindow = null;
    isWindowOpen = false;
  });
};

app.whenReady().then(() => {
  createTray();
  const ret = globalShortcut.register("CommandOrControl+Shift+Z", () => {
    if (overlayWindow) {
      overlayWindow?.webContents.executeJavaScript(
        `document.querySelector(".back").style.opacity = "0";document.querySelector("body").style.backgroundColor = "rgba(0, 0, 0, 0)";`
      );
      overlayWindow.webContents.setZoomFactor(1);
      setTimeout(() => {
        overlayWindow?.close();
        overlayWindow = null;
      }, 300);
    } else {
      createWindow();
      overlayWindow.webContents.setZoomFactor(1);
    }
  });

  if (!ret) console.log("Global shortcut registration failed");

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 🔌 IPC → SEND timeRecords
ipcMain.handle("get-time-records", () => {
  return formattedTime(timeRecords);
});

ipcMain.handle("get-negative-percent", () => {
  return toPercent(timeRecords);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Do nothing — keep app running in tray
  }
});
export {app,timeRecords};