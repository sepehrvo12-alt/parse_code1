const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // در صورت نیاز به ارتباط بین فرآیندها می‌توانید اینجا تابع اضافه کنید
});
