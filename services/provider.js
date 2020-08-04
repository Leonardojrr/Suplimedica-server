const DB = require("../database");
const QR = require("../queryReader");

const queryReader = new QR();
const database = new DB();

const providerService = {
  //Selecciona todos los proveedores
  getAllProviders: async () => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Seleccionar_Todos"),
      []
    );
    await database.close();
    return res;
  },

  //Selecciona proveedores por nombre y ci
  getProvider: async (values) => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Buscar"),
      values
    );
    await database.close();
    return res;
  },

  //Selecciona proveedores por nombre
  getProviderByName: async (values) => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Buscar_Nombre"),
      values
    );
    await database.close();
    return res;
  },

  //Selecciona proveedores por ci
  getProviderByCi: async (values) => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Buscar_CI"),
      values
    );
    await database.close();
    return res;
  },

  //Crea un proveedor
  createProvider: async (values) => {
    const { name, address, number, ci } = values;

    await database.conn();

    //Verificar CI
    const { rowCount } = await database.execute(
      queryReader.read("Persona", "Verificar_CI"),
      [ci]
    );
    if (rowCount > 0) {
      await database.close();
      return "Ya existe una persona con esta cedula";
    }

    //Crear el Proveedor
    let res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Crear"),
      [name, address, number, ci]
    );
    await database.close();

    return res;
  },

  //Actualiza un Proveedor
  updateProvider: async (id, values) => {
    const { name, address, number, ci } = values;

    await database.conn();

    //Verificar CI
    const { rowCount } = await database.execute(
      queryReader.read("Persona", "Verificar_Actualizar_CI"),
      [ci, id]
    );
    if (rowCount != 0) {
      await database.close();
      return "Ya existe una persona con esta cedula";
    }

    //Actualizar proveedor
    const res = await database.execute(
      queryReader.read("Persona", "Actualizar"),
      [id, name, address, number, ci]
    );

    await database.close();

    return res;
  },

  //Borrar proveedor
  deleteProvider: async (id) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Borrar"),
      [id]
    );

    await database.close();

    return res;
  },

  //Seleccionar productos de todos los proveedores
  getAllProducts: async (values) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Seleccionar_Productos"),
      []
    );

    await database.close();

    return res;
  },

  //Agregar Producto
  addProduct: async (values) => {
    const { id_provider, id_product } = values;

    await database.conn();

    const { rowCount } = await database.execute(
      queryReader.read("Persona", "Proveedor", "Verificar_Producto"),
      [id_product, id_provider]
    );

    if (rowCount > 0) {
      await database.close();
      return "Este proveedor ya tiene agregado este producto";
    }

    const res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Agregar_Producto"),
      [id_product, id_provider]
    );

    await database.close();

    return res;
  },

  //Eliminar Producto
  delProduct: async (values) => {
    const { id_product, id_provider } = values;

    await database.conn();

    const res = await database.execute(
      queryReader.read("Persona", "Proveedor", "Eliminar_Producto"),
      [id_product, id_provider]
    );

    await database.close();

    return res;
  },
};

module.exports = providerService;
