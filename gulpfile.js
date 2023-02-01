import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'gulp-cssnano';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import del from 'del';
import browsersync from 'browser-sync';

const clean = () => {
    return del('dist');
};

const html = () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(browsersync.stream());
}

const styles = () => {
    return gulp.src('./src/sass/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}))
        .pipe(cssnano())
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browsersync.stream());
}

const scripts = () => {
    return gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(rename('script.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'))
        .pipe(browsersync.stream());
}

const images = () => {
    return gulp.src('./src/img/**/*.{png, jpg, svg}')
        .pipe(imagemin(
            [
                imagemin.mozjpeg({quality: 75, progressive: true}),
	            imagemin.optipng({optimizationLevel: 5}),
	            imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ]
        ))
        .pipe(gulp.dest('./dist/img'))
        .pipe(browsersync.stream());
}

const fonts = () => {
    return gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'))
        .pipe(browsersync.stream());
}

const browserSync = (done) => {
    browsersync.init({
        server: {
            baseDir: './dist'
        }
    });
    done();
}

const watchFiles = () => {
    gulp.watch('./src/fonts/**/*',  gulp.series(fonts));
    gulp.watch('./src/sass/**/*',  gulp.series(styles));
    gulp.watch('./src/js/**/*',  gulp.series(scripts));
    gulp.watch('./src/img/**/*.{png, jpg, svg}', gulp.series(images));
    gulp.watch('./src/*.html', gulp.series(html));
}

export default gulp.series(clean, gulp.parallel(html, styles, scripts, images, fonts), gulp.parallel(watchFiles, browserSync));