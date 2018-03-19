const {
    app,
    BrowserWindow,
    BrowserView,
    globalShortcut
} = require('electron');

const path = require('path');
const url = require('url');
const _ = require('lodash');

let _win, _view, _controls, _orderWindows = [];

function initializeMainWindow() {
    let win = new BrowserWindow({
        closable: false,
        width: 1024,
        height: 768});
    view = new BrowserView({
        webPreferences: {
            nodeIntegration: false
        }
    });
    win.setBrowserView(view);
    view.setBounds({
        x: 0,
        y: 0,
        width: 1024,
        height: 768
    });
    view.webContents.loadURL('https://www.tradingview.com/chart/ntf03khN/');

    return win;
}

function initializeControls(x, y) {
    let controls = new BrowserWindow({
        x: x,
        y: y-60,
        width: 1024,
        height: 60});

    controls.loadURL(url.format({
        pathname: path.join(__dirname, 'controls.html'),
        protocol: 'file:',
        slashes: true
    }));

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
        height: 420});
    orderWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'order_window.html'),
        protocol: 'file:',
        slashes: true
    }));

    return orderWindow;
}

function initializeApplication () {
    // Create the browser window.
    _win = initializeMainWindow();
    const chartBounds = _win.getBounds();
    _controls = initializeControls(chartBounds.x, chartBounds.y);
    _orderWindows.push(newOrderWindow(chartBounds.x, chartBounds.y + chartBounds.height));
}

app.on('ready', () => {
    initializeApplication();
    globalShortcut.register('CommandOrControl+N', () => {
        const orderWindowBounds = _.last(_orderWindows).getBounds();
        _orderWindows.push(newOrderWindow(orderWindowBounds.x + 400, orderWindowBounds.y));
    })

});