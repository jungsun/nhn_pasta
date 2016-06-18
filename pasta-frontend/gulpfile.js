var es = require("event-stream");
var gulp = require("gulp");
var bower = require("gulp-bower");
var usemin = require("gulp-usemin");
var uglify = require("gulp-uglify");
var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");
var rev = require("gulp-rev");
var less = require("gulp-less");
var liveServer = require("gulp-live-server");

var argv = require('yargs').argv;

// src : source code - less, downloaded lib, bower components
// dist : minified js(include bower), minified css(less compiled)

gulp.task("default", ["build"]);
gulp.task("build", ["usemin", "copy-font", "copy-assets"]);

gulp.task("bower", function() {
    return bower();
});

gulp.task("usemin", ["bower"], function() {
    return gulp
        .src("src/html/**/*.html")
        .pipe(usemin({
            path: "src",
            css: [],
            js: [ uglify, rev ],
            less: [ less, 'concat',rev ],
            outputRelativePath: "../",
        }))
        .pipe(gulp.dest("dist/html"));
});

gulp.task("copy-font", ["bower"], function(){
    return gulp
        .src("src/bower_components/font-awesome/fonts/*")
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("copy-assets", function(){
    var ret = StreamReturn();

    /* images */
    ret.v = gulp
        .src("src/img/**/*")
        .pipe(gulp.dest("dist/img"));

    ret.v = gulp
        .src("favicon.ico")
        .pipe(gulp.dest("dist"));

    return ret.stream;
});


gulp.task("dev-server", ["bower"], function () {
    var server = liveServer.new("dummy-server.js");

    server.start();

    gulp.watch("dummy-server.js",function(){
        server.start(); //restart server
    });

    gulp.watch([
        "src/**/*"
    ], function (file) {
        server.notify(file); //live reload
    });
});

/* temporary method */
gulp.task("spring-watch", ["copy-to-spring"], function(){
    gulp.watch([
        "src/**/*"
    ], ["copy-to-spring"]);
});
gulp.task("copy-to-spring",["build"], function(){
    if(!argv.target) {
        console.error("target required! please run with gradle");
        return;
    }

    var ret = StreamReturn();

    console.log("copy dist/html to %s/templates" ,argv.target);
    ret.v = gulp
        .src([
            "dist/html/**/*"
        ]).pipe(gulp.dest(argv.target + "/templates"));

    console.log("copy dist/html to %s/static" ,argv.target);
    ret.v = gulp
        .src([
            "dist/**/*",
            "!dist/html/**/*"
        ]).pipe(gulp.dest(argv.target + "/static"));

    return ret.stream;
});

//Strem Return
//help multiple gulp job return
function StreamReturn(){
    var streams = [];
    return Object.create({}, {
        v : {
            set: function(value){
                streams.push(value);
            }
        },
        stream : {
            get : function(){
                return es.merge(streams);
            }
        }
    });
}
