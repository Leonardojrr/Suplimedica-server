const DB = require("../database");
const QR = require("../queryReader");

const database = new DB();
const queryReader = new QR();
queryReader.addPath("Producto");

const productService = {
  //Selecconar productos
  getAllProducts: async () => {
    try {
      await database.conn();

      const { rows } = await database.execute(
        queryReader.read("Seleccionar_Todos"),
        []
      );

      return {
        status: 200,
        msg: "Se pidieron los productos exitosamente",
        data: rows,
      };

      await database.close();
    } catch (e) {
      return { status: 500, msg: "No se pudieron pedir los productos" };
    }
  },

  //Selecciona todos los provedores que tienen un producto
  getProviders: async (id) => {
    try {
      await database.conn();

      const { rows } = await database.execute(
        queryReader.read("Seleccionar_Proveedores"),
        [id]
      );

      await database.close();

      return {
        status: 200,
        msg: "Proveedores del producto pedidos exitosamente",
        data: rows,
      };
    } catch (e) {
      return {
        status: 500,
        msg: "No se pudieron traer los proveedores de este producto",
      };
    }
  },

  //Crear Producto
  createProduct: async (values) => {
    const { code, name, price, description, brand } = values;

    await database.conn();

    //Verificar Si ya existe el codigo del producto
    const { rowCount } = await database.execute(
      queryReader.read("Verificar_Codigo"),
      [code]
    );

    if (rowCount > 0) {
      await database.close();
      return "El codigo del producto que se a ingresado ya existe";
    }

    // prettier-ignore
    //Crear Producto
    const res = await database.execute(queryReader.read("Crear"),
      [code, name, price, description, brand]
    );

    await database.close();

    return res;
  },

  //Actualiza un producto
  updateProduct: async (id, values) => {
    const { code, name, price, brand } = values;

    try {
      await database.conn();

      //Verifica que no exista el codigo del producto
      const { rowCount } = await database.execute(
        queryReader.read("Verificar_Actualizacion"),
        [code, id]
      );

      if (rowCount > 0) {
        await database.close();
        return { status: 500, msg: "Ya existe un producto con ese codigo" };
      }

      await database.execute(queryReader.read("Actualizar"), [
        code,
        name,
        price,
        brand,
        id,
      ]);

      await database.close();

      return { status: 200, msg: "Producto actualizado exitosamente" };
    } catch (e) {}
  },
};

module.exports = productService;
