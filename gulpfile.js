const { src, dest, watch, parallel } = require("gulp");

//CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');

// Importar utilizando la función de importación dinámica
//Imagenes
//const imagemin = require("gulp-imagemin");
const imagemin = (await import("gulp-imagemin")).default;

const cache = require("gulp-cache")

async function web(done) {
  const opciones = {
    quality: 50
  };

  // Utilizar importación dinámica para cargar el módulo gulp-webp
  const webp = (await import("gulp-webp")).default;

  src("src/img/**/*.{png,jpg}")
    .pipe(webp(opciones))
    .pipe(dest("build/img"));

  done();
}

function css(done) {
  src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(dest('build/css'));

  done();
}

function imagenes (done){
  const opciones = {
      optimizationLevel: 3
  };
  src('src/img/**/*.{png,jpg}') // Aquí selecciona los archivos de la carpeta src/img
      .pipe( cache (imagemin(opciones) ) )
      .pipe (dest ("build/img"));
  
  done();
}
function dev(done) {
  watch("src/scss/**/*.scss", css);
  done();
}

exports.css = css;
exports.imagenes = imagenes;
exports.web = web; // Cambiar el nombre de la tarea a 'web'
exports.dev = parallel(imagenes, web, dev); // Cambiar el nombre de la tarea a 'web'
