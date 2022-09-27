#!/usr/bin/env node
const chokidar = require('chokidar');
const ws = require('ws');
const fs = require('fs');
const path = require('path');

const wss = new ws.WebSocketServer({port: 9011});

let debug = false;
let numFlags = 0;

if (process.argv[2]) {
    if (process.argv[2] === "--debug") {
        debug = true;
        numFlags++;
    } else {
        if (process.argv[2].startsWith("-")) {
            console.log("unknown option: " + process.argv[2]);
            process.exit(1);
        }
    }
}

let cwd = process.cwd();
let directory = process.argv[2 + numFlags];

let prefix = "";

if (!directory) {
    directory = path.resolve(cwd, "behaviors");
}

let split = directory.split(path.sep);
let behaviorIndex = split.indexOf("behaviors");
if (behaviorIndex >= 0 && behaviorIndex !== split.length - 1) {
    prefix = path.join(...split.slice(behaviorIndex + 1)) + path.sep;
}

try {
    process.chdir(directory);
} catch(e) {
    console.log("error occurred on setting the directory to serve");
    console.log(e);
    process.exit(1);
}

console.log("current directory:", cwd);
console.log("serving files from:", directory);
console.log("path under behavior", prefix)

let files = {}; // {filename: content}
let sentFiles = new Map();// {ws: {filename: content}}

let watcher = chokidar.watch('./**/*.js' ,{
    persistent: true,
    ignored: /\.#|^[#_]/
});

watcher.on('add', name => {
    loadFile(name).then(() => {
        sendAllFiles();
    });
});
watcher.on('change', name => {
    loadFile(name).then(() => {
        sendAllFiles();
    });
});
watcher.on('unlink', name => {
    delete files[name];
});

function loadFile(name) {
    return new Promise((resolve, reject) => {
        fs.readFile(name, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    }).then((file) => {
        files[name] = file;
        console.log(name);
    });
}

function heartbeat() {
    this.isAlive = true;
}

const interval = setInterval(function ping() {
    for (let ws of sentFiles.keys()) {
        if (ws.isAlive === false) {
            sentFiles.delete(ws);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    }
}, 30000);

wss.on('connection', (ws, request, client)  => {
    sentFiles.set(ws, {});
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    sendFiles(ws);
});

function sendFiles(socket) {
    let toSend = [];

    let newKeys = Object.keys(files);
    let sent = sentFiles.get(socket);
    
    let sentKeys = Object.keys(sent);

    newKeys.forEach((k) => {
        if (debug || (files[k] && files[k] !== sent[k])) {
            sent[k] = files[k];
            let systemModule = k.startsWith("croquet" + path.sep);
            let nameToUse = prefix + k;
            if (path.sep === "\\") {
                nameToUse = nameToUse.replaceAll("\\", "/");
            }
            console.log(nameToUse, systemModule);
            toSend.push({action: "add", name: nameToUse, content: files[k], systemModule});
        }
    });

    sentKeys.forEach((k) => {
        if (files[k] === undefined && sent[k]) {
            delete sent[k];
            toSend.push({action: "remove", name: k});
        }
    });
    
    socket.send(JSON.stringify(toSend));
}

function sendAllFiles() {
    for (let k of sentFiles.keys()) {
        sendFiles(k);
    }
}

wss.on('close', () => {
    console.log("close", ws);
    clearInterval(interval);
});
