const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  // process.env.NODE_ENV = 'development' || 'production'
  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// ====================================
// ====================================

const { writeFile } = require('fs');
const { ipcMain, dialog } = require('electron');

ipcMain.on('renderer/salvar_arquivo', async function(event, mensagem) {
  const conteudoDoArquivo = mensagem;

  const { filePath, canceled } = await dialog.showSaveDialog();

  if(canceled) {
    event.reply('main/salvar_arquivo', { status: 400, msg: 'Usuário cancelou o salvamento do arquivo' })
    return false;
  }

  writeFile(filePath, conteudoDoArquivo, 'utf-8', function(err, result) {
    console.log(err, result);
    console.log(filePath);
    event.reply('main/salvar_arquivo', { status: 200, msg: filePath })
  });


});