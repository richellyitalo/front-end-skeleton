var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var cleanDest   = require('gulp-clean-dest');
var clean       = require('gulp-clean');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var es          = require('event-stream');
var cleanCSS    = require('gulp-clean-css');
var runSequence = require('run-sequence');
var gulpCopy    = require('gulp-copy');
var modifyUrl   = require('gulp-modify-css-urls');

// Clean folder 'dist/' before generates files to this foler
gulp.task('clean', function () {
    return gulp.src('dist/*')
        .pipe(clean());

});

// Hint your javascript
gulp.task('jshint', function () {
    return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

});

// Join the javascript files and minify
gulp.task('uglify', function () {
    return gulp.src([
        'assets/plugins/modernizr/modernizr-custom.js',
        //'js/**/*.js',
        'js/scripts.js'
    ])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Minify main css file
gulp.task('maincss', function () {

    return gulp.src([
        'css/main.css'
    ])

        // Change uri of images
        .pipe(modifyUrl({
            modify: function (url, filePath) {
                return '../../images/' + url;
            }
        }))

        // Minify and concat
        .pipe(cleanCSS())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('dist/css'));

});

// Concat and minify lib css
gulp.task('cssmin', function () {

    return es.merge([
            gulp.src([
                //'assets/vendor/font-awesome/css/font-awesome.min.css',
                //'assets/vendor/bootstrap/dist/css/bootstrap.min.css'
            ]),

            // Fonts stylesheet to change your URI
            gulp.src([
                'fonts/stylesheet.css'
            ])

            .pipe(modifyUrl({
                modify: function (url, filePath) {
                    return '../fonts/' + url;
                }
            }))
        ])
            .pipe(cleanCSS({
                level: {
                    1: {
                        specialComments: 0 // remove all comments
                    }
                }
            }))
            .pipe(concat('lib.min.css'))

            .pipe(gulp.dest('dist/css'));
});

// Copy resource files from lib/fonts
gulp.task('copy', function () {
    return es.merge([

            gulp.src(['fonts/*'])
                .pipe(gulpCopy('dist/fonts', {prefix: 1})),

            // EXAMPLES BELOW
            // To copy keeping folder structure remove prefix or set a number of trees

            // gulp.src(['assets/vendor/font-awesome/fonts/*'])
            //     .pipe(gulpCopy('dist/fonts', {prefix: 4})),
            //
            // gulp.src(['assets/vendor/lightgallery/dist/fonts/*'])
            //     .pipe(gulpCopy('dist/fonts', {prefix: 5}))
        ]);

});

// Main task: 'gulp'
// but you can only run single tasks: 'gulp maincss' or 'gulp maincss cssmin'
gulp.task('default', function (cb) {
    return runSequence('clean', ['jshint', 'uglify', 'cssmin', 'maincss', 'copy'], cb);
});