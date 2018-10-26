// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {BrowserWindow} = require('electron').remote
const path = require('path')

const newWindowBtn = document.getElementById('new-window')

newWindowBtn.addEventListener('click', event=>{
    const modalPath = path.join('modal.html')
    let win = new BrowserWindow({width: 400, height: 320})

    win.on('close', ()=>{win = null})
    win.loadURL(modalPath)
    win.show()
})