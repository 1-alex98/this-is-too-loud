const { app, BrowserWindow } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        icon: "./icon.png",
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        title: 'Get warned if you are too loud'
    })

    win.loadFile('index.html')
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