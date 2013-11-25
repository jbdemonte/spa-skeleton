// dependencies
// ------------
var cp = require("child_process");
var async = require('async');
var hash = require("./hash.js");
var UglifyJS = require("uglify-js");

module.exports = function (grunt) {

    grunt.initConfig("default", "build");

    function glob(patterns) {
        var result = [],
            files = {},
            f;

        patterns.forEach(function (pattern) {
            grunt.file.expand(pattern).forEach(function (file) {
                if (!files[file] && grunt.file.isFile(file)) {
                    files[file] = true; // eq. fast array unique ordered (order is important !)
                }
            });
        });
        for (f in files) {
            if (files.hasOwnProperty(f)) {
                result.push(f);
            }
        }
        return result;
    }

    /************************************************
     *                  BUILD TASK
     ***********************************************/
    grunt.registerTask("build", "Build the javascript files", function () {

        var fnList = [],
            avoid = {},
            self = this,
            separator = "\n\n",
            configs = require("./configs.js"),
            fileName = grunt.option("file") || "script",
            config = configs[fileName],
            java = grunt.option("java") || "java",
            done = this.async();

        if (!config) {
            grunt.log.error("no configuration for file " + grunt.option("file"));
            return;
        }

        // build the blacklist of filename
        if (config.avoid) {
            config.avoid.forEach(function (filename) {
                avoid[filename] = true;
            });
        }

        config.tasks.forEach(function (task) {
            if (task.src) {
                fnList.push(function (callback) {
                    var files = [];
                    glob(task.src).forEach(function (file) {
                        if (avoid[file]) {
                            return;
                        }
                        files.push("// FILE: " + file + "\n\n");
                        files.push(grunt.file.read(file));
                    });
                    callback(null, files.join(separator));
                });
            } else if (task.soy) {
                glob(task.soy).forEach(function (file) {
                    if (avoid[file]) {
                        return;
                    }
                    fnList.push(function (callback) {
                        var md5 = hash.md5(grunt.file.read(file)),
                            build = "./build/" + md5 + ".soy",
                            command = java + ' -jar ./jar/SoyToJsSrcCompiler.jar "' + file + '" --outputPathFormat ' + build;

                        if (grunt.file.isFile(build)) {
                            callback(null, grunt.file.read(build));
                        } else {
                            cp.exec(command, function (err, stdout, stderr) {
                                if (err || stderr) {
                                    callback(err || stderr, stdout);
                                    return;
                                }
                                callback(null, grunt.file.read(build));
                            });
                        }
                    });
                });
            }
        });

        async.series(fnList, function (err, results) {
            var content;
            if (err) {
                grunt.verbose.error();
                grunt.log.errorlns(err.toString());
                throw grunt.task.taskError(err, -1);
            }

            content = results.join(separator);

            // create a closure to protect the script against js manipulation
            if (grunt.option("closure") && config.closure) {
                content = "(function () {" + separator + content + separator  + "}());";
            }

            // minify content
            if (grunt.option("min")) {
                content = UglifyJS.minify(content, {fromString: true}).code;
            }

            // prepend copyright(s)
            if (config.copyright) {
                content = grunt.file.read(config.copyright).toString() + separator + content;
            }

            grunt.file.write("build/" + fileName + ".js", content);

            // Fail task if errors were logged.
            if (self.errorCount) {
                grunt.log.errorlns("Some errors has occurred.");
                done(false);
                return false;
            }

            // Otherwise, print a success message.
            grunt.log.oklns('File "' + fileName + '" created.');
            done(true);
        });
    });

};