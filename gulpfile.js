//引入gulp，项目文件中安装的gulp的引入方式
var gulp = require('gulp');

//引入组件
var browserSync=require('browser-sync').create();//实时编译及浏览器自动刷新
var jshint = require("gulp-jshint");//js代码检查
var sass = require("gulp-sass");//编译sass文件
var concat = require("gulp-concat");//合并js
var uglify = require("gulp-uglify");//压缩javascript文件，减小文件大小
var rename = require("gulp-rename");//重命名文件的插件，当要把一个文件存储为不同版本时可以使用。比如在需要一个style.css同时你有需要一个style.min.css
var autoprefixer = require("gulp-autoprefixer");//使用Autoprefixer来补全浏览器兼容CSS
var notify = require('gulp-notify');//更改提醒
var browserify = require('gulp-browserify');

var path = require("path");

var del = require("del");

var reload =browserSync.reload;



//你也会想要在编译文件之前删除一些文件
//*匹配所有文件，例：src/*.js(包含src下的所有js文件)
//**匹配0个或者多个子文件夹 例：src/**/*.js(包含src的0个或者多个子文件夹下的js文件)
gulp.task('clean',function(cb){
	return del(['src/**/*'],cb);
});

//检查脚本
gulp.task('lint',function(){
	gulp.src('.src/js/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});



//编译sass
//sass 任务会编译scss目录下的scss文件，并且把编译完成的css文件保存到/css目录中
gulp.task('sass',function(){
	return gulp.src("./src/scss/**/*.scss",{style:"expanded"})
	.pipe(sass())
	.pipe(rename({suffix:'.min'}))
	.pipe(gulp.dest("./src/css"))
	.pipe(notify({message:'Styles task complete'}))
	.pipe(browserSync.stream());
});





//合并，压缩文件
//js 任务会合并js 目录下的所有js文件并输出到dist目录中，然后gulp会重命名。压缩合并的文件，也输出到dist/目录
gulp.task('js',function(){
	return gulp.src('./src/js/**/*.js')
	//.pipe(concat('all.js'))
	.pipe(browserify())
	.pipe(uglify())
	.pipe(gulp.dest('./dest'))
	//.pipe(rename('all.min.js'))
	//.pipe(uglify()).pipe(gulp.dest("./bulid/js"))
	.pipe(browserSync.stream());
});

//静态服务器+监听 scss/html 文件
gulp.task('serve',['sass','js'],function(){
	browserSync.init({
		server:"./"
	});
	gulp.watch("./src/scss/**/*.scss",['sass']);
	gulp.watch("*.html").on('change',reload);
	gulp.watch("./src/js/**/*.js",['js']);
});


gulp.task('default', ['serve']);

//gulp.task('default', function() {
	// 将你的默认的任务代码放在这
//	gulp.run('lint','sass','scripts');
	//监听文件变化
//	gulp.watch("",function(){
//		gulp.run('lint','sass','scripts');
//	});
//});