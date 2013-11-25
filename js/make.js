var cp = require("child_process"),
    path = require('path'),
    fs = require('fs');

function build(file, minify, closure, res) {
    var cmd =   'cd "' + require('path').resolve(__dirname) + '";' +
                '/usr/local/bin/grunt build --file="' + file + '"' +
                (minify ? ' --min=1' : '') +
                (closure ? ' --closure=1' : '');


    cp.exec(cmd, function (err, stdout, stderr) {
        if (err || stderr) {
            res.send(404);
            return;
        }

        fs.readFile(path.join(__dirname, "build", file + ".js"), function(err, buf) {
            if (err) {
                res.send(404);
                return;
            }
            res.send(buf.toString());
        });

    });

}

/*
 * Build main.js
 */

exports.main = function(req, res){
    build("main", false, false, res);
};

/*
 * Build jq.js
 */

exports.jq = function(req, res){
    build("jq", false, false, res);
};