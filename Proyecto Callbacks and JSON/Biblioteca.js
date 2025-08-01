const fs = require('fs');
const { createInterface } = require('readline');
const FILE = './Biblioteca.json';

function leerDatos(cb) {
  fs.readFile(FILE, 'utf8', (e,d)=>{
    if(e) return cb(e);
    let obj;
    try { obj = JSON.parse(d); } catch(p){ return cb(p); }
    setTimeout(() => cb(null, obj), 500);
  });
}

function escribirDatos(obj, cb) {
  fs.writeFile(FILE, JSON.stringify(obj, null, 2), 'utf8', e => {
    if(e) return cb(e);
    setTimeout(() => cb(null), 500);
  });
}

function mostrarLibros(cb) {
  leerDatos((e, datos) => {
    if (e) console.error("Error:", e);
    else console.log("\nInventario (JSON):\n", JSON.stringify(datos.libros, null, 2), "\n");
    cb();
  });
}

function agregarLibro(t, a, g, d, cb) {
  leerDatos((e, datos) => {
    if (e) return cb(e);
    datos.libros.push({ titulo: t, autor: a, genero: g, disponible: d });
    escribirDatos(datos, err => {
      if(err) console.error("Error:", err);
      else console.log(`Libro "${t}" agregado.\n`);
      cb();
    });
  });
}

function actualizarDisponibilidad(t, disp, cb) {
  leerDatos((e, datos) => {
    if (e) return cb(e);
    const libro = datos.libros.find(l => l.titulo === t);
    if (!libro) {
      console.error(`No se encontró "${t}".\n`);
      return cb();
    }
    libro.disponible = disp;
    escribirDatos(datos, err => {
      if(err) console.error("Error:", err);
      else console.log(`Disponibilidad de "${t}" actualizada a ${disp ? 'Disponible' : 'Prestado'}.\n`);
      cb();
    });
  });
}

// CLI interactiva
function iniciarCLI() {
  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: 'Menú> ' });
  console.log("Bienvenido a la Biblioteca CLI interactiva.");
  console.log("Opciones: 1=Listar libros, 2=Agregar, 3=Actualizar disponibilidad, 4=Salir");
  rl.prompt();

  rl.on('line', line => {
    const opt = line.trim();
    switch(opt) {
      case '1':
        mostrarLibros(() => rl.prompt());
        break;
      case '2':
        rl.question('Título: ', titulo =>
        rl.question('Autor: ', autor =>
        rl.question('Género: ', genero =>
        rl.question('Disponible? (sí/no): ', resp => {
          const disp = resp.trim().toLowerCase().startsWith('s');
          agregarLibro(titulo, autor, genero, disp, () => rl.prompt());
        }))));
        break;
      case '3':
        rl.question('Título a actualizar: ', titulo =>
        rl.question('Disponible? (sí/no): ', resp => {
          const disp = resp.trim().toLowerCase().startsWith('s');
          actualizarDisponibilidad(titulo, disp, () => rl.prompt());
        }));
        break;
      case '4':
        console.log('¡Hasta luego!');
        rl.close();
        break;
      default:
        console.log('Opción no válida, intenta de nuevo.');
        rl.prompt();
    }
  });

  rl.on('close', () => process.exit(0));
}

if (require.main === module) iniciarCLI();

      