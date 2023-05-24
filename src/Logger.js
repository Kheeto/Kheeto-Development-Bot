const fs = require("fs");
const logFilePath = "./logs/latest";
require("colors");

function Info(text) {
    Write(text.white);
    //writeFile(logFilePath, text+"\n");
}
function Success(text) {
    Write(text.brightGreen);
    //writeFile(logFilePath, text+"\n");
}
function Warning(text) {
    Write(text.yellow);
    //writeFile(logFilePath, text+"\n");
}
function Error(text) {
    Write(text.brightRed);
    //writeFile(logFilePath, text+"\n");
}
function Write(text) {
    const d = new Date();
    var time = `[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}]`
    console.log(`${time} ${text}`);
}

exports.Info = Info;
exports.Success = Success;
exports.Warning = Warning;
exports.Error = Error;

function writeFile(path, content) {
    var newContent = content;

    try {
        if (fs.existsSync(logFilePath)) {
            fs.readFile(path, 'utf-8', (err, data) => {
                if(err) return Error(err);
                newContent = data + content;
            });
        }
    } catch(err) { Logger.Error(err) }

    fs.writeFile(path, newContent, function(err) {
        if(err) return Error(err);
    });
}