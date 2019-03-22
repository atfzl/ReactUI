import GetPropsApi from '#/common/api/GetProps';
import * as electron from 'electron';

let mainWindow: electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 800,
  });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:7979');

  mainWindow.setTitle('Beragi');
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  setTimeout(() => {
    // tslint:disable-next-line:no-console
    console.log('timer fired');
    GetPropsApi.callRenderer(mainWindow!, { id: 'foobar9000' }).then(
      // tslint:disable-next-line:no-console
      console.log,
    );
  }, 10000);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.on('ready', createWindow);

// Quit when all windows are closed.
electron.app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
