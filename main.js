const path = require('path');
const {app, BrowserWindow} = require('electron');

const is_mac = process.platform === 'darwin'

function create_main_window(){
    const main_window = new BrowserWindow({
        title: 'Word Learning',
        width: 500,
        height: 500
    });

    main_window.loadFile(path.join(__dirname, './app/index.html'));
}

app.whenReady().then(() => {
    create_main_window();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            create_main_window();
        }
    });
});

app.on('window-all-closed', () => {
    if (!is_mac) {
        app.quit();
    }
});

