'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

let mimes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.gif': 'image/gif',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
}

function fileAccess(filePath) {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.F_OK, error => {
            if (!error) {
                resolve(filePath);
            } else {
                reject(error);
            }
        });
    });
}

function streamFile(filePath) {
    return new Promise((resolve, reject) => {
        let fileStream = fs.createReadStream(filePath);
        fileStream.on('open', () => {
            resolve(fileStream);
        });
        fileStream.on('error', error => {
            reject(error);
        })
    });
}
function webserver(req, res) {
    let baseURI = url.parse(req.url);
    //load index.html if the requested route is '/' else load the requested files
    let filePath = __dirname + (baseURI.pathname === '/' ? '/index.html' : baseURI.pathname);
    let contentType = mimes[path.extname(filePath)];

    fileAccess(filePath)
        .then(streamFile)
        .then(fileStream => {
            res.writeHead(200, { 'Content-type': contentType });
            // res.end(content, 'utf-8');
            fileStream.pipe(res);
        })
        .catch(error => {
            res.writeHead(404);
            res.end(JSON.stringify(error));
        })
}

http.createServer(webserver).listen(8081, () => console.log('webserver running on port 8081')
);