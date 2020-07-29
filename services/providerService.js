const DB = require("../database");
const fs = require("fs");

const database = new DB();

const providerService = {
  createProvider: async (values) => {
    database.conn();
    await database.execute(
      fs.readFileSync("querys/Persona/Crear_Proveedor.sql", "utf-8"),
      values
    );
    database.close();
  },
};

module.exports = providerService;
