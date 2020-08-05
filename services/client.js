const QR = require("../queryReader");
const DB = require("../database");

const database = new DB();
const queryReader = new QR();
queryReader.addPath("Persona");

const clientService = {
  //Selecciona todos los clientes
  getAllClients: async () => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Cliente", "Seleccionar_Todos"),
      []
    );
    await database.close();

    return res;
  },

  //Selecciona clientes por nombre y ci
  getClient: async (values) => {
    await database.conn();

    let res = await database.execute(
      queryReader.read("Cliente", "Buscar"),
      values
    );
    await database.close();

    return res;
  },

  //Selecciona clientes por nombre
  getClientByName: async (values) => {
    await database.conn();

    let res = await database.execute(
      queryReader.read("Cliente", "Buscar_Nombre"),
      values
    );

    await database.close();

    return res;
  },

  //Selecciona clientes por ci
  getClientByCi: async (values) => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Cliente", "Buscar_CI"),
      values
    );
    await database.close();
    return res;
  },

  //Crea un cliente
  createClient: async (values) => {
    const { name, address, number, ci } = values;

    await database.conn();

    //Verificar CI
    const { rowCount } = await database.execute(
      queryReader.read("Verificar_CI"),
      [ci]
    );
    if (rowCount > 0) {
      await database.close();
      return "Ya existe una persona con esta cedula";
    }

    //Crear el cliente
    let res = await database.execute(queryReader.read("Cliente", "Crear"), [
      name,
      address,
      number,
      ci,
    ]);
    await database.close();

    return res;
  },

  //Actualiza un cliente
  updateClient: async (id, values) => {
    const { name, address, number, ci } = values;

    await database.conn();

    //Verificar CI
    const { rowCount } = await database.execute(
      queryReader.read("Verificar_Actualizar_CI"),
      [ci, id]
    );
    if (rowCount != 0) {
      await database.close();
      return "Ya existe una persona con esta cedula";
    }

    //Actualizar cliente
    const res = await database.execute(queryReader.read("Actualizar"), [
      id,
      name,
      address,
      number,
      ci,
    ]);

    await database.close();

    return res;
  },

  //Borrar cliente
  deleteClient: async (id) => {
    await database.conn();

    const res = await database.execute(queryReader.read("Cliente", "Borrar"), [
      id,
    ]);

    await database.close();

    return res;
  },
};

module.exports = clientService;
