const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // این خط رو اضافه کن تا مشکل unsafe-eval حل بشه:
      enableRemoteModule: false,
      devTools: true
    }
  });

  // این خط رو هم اضافه کن برای نادیده گرفتن محدودیت CSP:
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-eval' 'unsafe-inline'"]
      }
    });
  });

  win.loadFile('index.html');
  // اگه خواستی کنسول باز بشه خط بعد رو فعال کن (فعلاً غیرفعال)
  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
