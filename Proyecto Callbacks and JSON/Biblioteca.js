const fs = require('fs');
const FILE = './biblioteca.json';

// Lee el archivo JSON de forma asincrónica
function leerDatos(callback) {
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) return callback(err);
    let obj;
    try {
      obj = JSON.parse(data);
    } catch (parseErr) {
      return callback(parseErr);
    }
    callback(null, obj);
  });
}

// Muestra los libros en formato JSON legible en consola
function mostrarLibrosComoJSON(callback) {
  leerDatos((err, datos) => {
    if (err) {
      console.error("Error al leer archivo:", err);
      return callback(err);
    }
    console.log("Inventario en formato JSON:\n", JSON.stringify(datos.libros, null, 2));
    console.log(); // salto de línea
    callback(null);
  });
}

if (require.main === module) {
  mostrarLibrosComoJSON(() => {});
}
