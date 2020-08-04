//clase que se encarga de leer los queries para las peticiones
const fs = require("fs");

class queryReader {
  constructor() {
    this.path = "./querys";
  }

  read(...path) {
    let pathToRead = this.path;

    for (let i of path) {
      pathToRead += `/${i}`;

      if (fs.existsSync(pathToRead)) continue;
      else {
        if (fs.existsSync(`${pathToRead}.sql`)) {
          return fs.readFileSync(`${pathToRead}.sql`, "utf8");
        } else {
          console.log(`${i} no existe`);
          break;
        }
      }
    }
  }
}

module.exports = queryReader;
