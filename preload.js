const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getTimeRecords: () => ipcRenderer.invoke("get-time-records"),
  getNegativePercent: () => ipcRenderer.invoke("get-negative-percent"),
});
