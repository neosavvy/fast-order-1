const {
    app,
    BrowserWindow,
    BrowserView,
    globalShortcut
} = require('electron');

const isDev = require("electron-is-dev");
const path = require("path");
const url = require('url');
const _ = require('lodash');

let _win, _view, _controls, _orderWindows = [];


function initializeMainWindow() {
    let win = new BrowserWindow({
        closable: false,
        width: 1024,
        height: 768});
    _view = new BrowserView({
        webPreferences: {
            nodeIntegration: false
        }
    });
    win.setBrowserView(_view);
    _view.setBounds({
        x: 0,
        y: 0,
        width: 1024,
        height: 768
    });
    //view.webContents.loadURL('https://www.tradingview.com/chart/ntf03khN/');
    _view.webContents.loadURL(
        isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '../build/index.html')}`
    );

    app.setAboutPanelOptions({
        applicationName: "Fast Order",
        applicationVersion: "0.0.1",
    });
    win.on("closed", () => win = null);

    // _view.webContents.openDevTools();

    return win;
}

function initializeControls(x, y) {
    let controls = new BrowserWindow({
        x: x,
        y: y-60,
        width: 1024,
        height: 60});

    controls.loadURL(
        isDev ? "http://localhost:3000/controls.html" : `file://${path.join(__dirname, '../build/controls.html')}`
    );

    controls.on('closed', () => {
        process.exit();
    });

    return controls;
}


function newOrderWindow(x, y) {
    let orderWindow = new BrowserWindow({
        x: x,
        y: y,
        closable: true,
        width: 400,
        height: 420,
        webPreferences: {webSecurity: false}
    });
    orderWindow.loadURL(
        isDev ? "http://localhost:3000/order.html" : `file://${path.join(__dirname, '../build/order.html')}`
    );
    return orderWindow;
}


function initializeApplication () {
    // Create the browser window.
    _win = initializeMainWindow();
    const chartBounds = _win.getBounds();
    _controls = initializeControls(chartBounds.x, chartBounds.y);
    _orderWindows.push(newOrderWindow(chartBounds.x, chartBounds.y + chartBounds.height));
}

app.on("ready", () => {
    initializeApplication();
    globalShortcut.register('CommandOrControl+N', () => {
        const orderWindowBounds = _.last(_orderWindows).getBounds();
        _orderWindows.push(newOrderWindow(orderWindowBounds.x + 400, orderWindowBounds.y));
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
