const DB = require("../database");
const QR = require("../queryReader");

const database = new DB();
const queryReader = new QR();
queryReader.addPath("Persona");

const providerService = {
  //Selecciona todos los proveedores
  getAllProviders: async () => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Proveedor", "Seleccionar_Todos"),
      []
    );
    await database.close();
    return res;
  },

  //Selecciona proveedores por nombre y ci
  getProvider: async (values) => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Proveedor", "Buscar"),
      values
    );
    await database.close();
    return res;
  },

  //Selecciona proveedores por nombre
  getProviderByName: async (values) => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Proveedor", "Buscar_Nombre"),
      values
    );
    await database.close();
    return res;
  },

  //Selecciona proveedores por ci
  getProviderByCi: async (values) => {
    await database.conn();
    let res = await database.execute(
      queryReader.read("Proveedor", "Buscar_CI"),
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
      queryReader.read("Verificar_CI"),
      [ci]
    );
    if (rowCount > 0) {
      await database.close();
      return { status: 409, msg: "Este proveedor ya existe" };
    }

    //Crear el Proveedor
    let res = await database.execute(queryReader.read("Proveedor", "Crear"), [
      name,
      address,
      number,
      ci,
    ]);
    await database.close();

    return { status: 200, msg: "Proveedor creado exitosamente" };
  },

  //Actualiza un Proveedor
  updateProvider: async (id, values) => {
    const { name, address, number, ci } = values;

    await database.conn();

    //Verificar CI
    const { rowCount } = await database.execute(
      queryReader.read("Verificar_Actualizar_CI"),
      [ci, id]
    );
    if (rowCount > 0) {
      await database.close();
      return { status: 409, msg: "Esta cedula ya existe" };
    }

    //Actualizar proveedor
    await database.execute(queryReader.read("Actualizar"), [
      id,
      name,
      address,
      number,
      ci,
    ]);

    await database.close();

    return { status: 200, msg: "Proveedor editado exitosamente" };
  },

  //Borrar proveedor
  deleteProvider: async (id) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Proveedor", "Borrar"),
      [id]
    );

    await database.close();

    return res;
  },

  //Seleccionar productos de todos los proveedores
  getAllProducts: async (values) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Proveedor", "Seleccionar_Todos_Productos"),
      []
    );

    await database.close();

    return res;
  },

  //Seleccionar productos de un proveedor
  getProducts: async (id_provider) => {
    await database.conn();

    const res = await database.execute(
      queryReader.read("Proveedor", "Seleccionar_Productos"),
      [id_provider]
    );

    await database.close();

    return res;
  },

  //Agregar Producto
  addProduct: async (values) => {
    const { id_provider, id_product } = values;

    await database.conn();

    //Verifica si este proveedor ya tiene el producto que se quiere agregar
    const { rowCount } = await database.execute(
      queryReader.read("Proveedor", "Verificar_Producto"),
      [id_product, id_provider]
    );

    if (rowCount > 0) {
      await database.close();
      return {
        status: 500,
        msg: "Este proveedor ya tiene agregado este producto",
      };
    }

    const res = await database.execute(
      queryReader.read("Proveedor", "Agregar_Producto"),
      [id_product, id_provider]
    );
    console.log(res);
    await database.close();

    return { status: 200, msg: "Producto añadido a proveedor exitosamente" };
  },

  //Eliminar Producto
  delProduct: async (values) => {
    const { id_product, id_provider } = values;

    await database.conn();

    const res = await database.execute(
      queryReader.read("Proveedor", "Eliminar_Producto"),
      [id_product, id_provider]
    );

    await database.close();

    return res;
  },
};

module.exports = providerService;
