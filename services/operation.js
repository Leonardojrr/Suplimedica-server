const DB = require("../database");
const QR = require("../queryReader");

const database = new DB();
const queryReader = new QR();
queryReader.addPath("Operacion");

const operationService = {
  getOperations: async (id) => {
    let operaciones = [];
    try {
      await database.conn();

      //Trae las operaciones hechas a esta persona
      const { rows: lista_opera } = await database.execute(
        queryReader.read("Traer_Operaciones"),
        [id]
      );

      operaciones = lista_opera;

      //Trae los productos de todoas las operaciones
      for (let i in operaciones) {
        let { rows: lista_productos } = await database.execute(
          queryReader.read("Traer_Productos_Operacion"),
          [operaciones[i].id_operacion]
        );

        operaciones[i].productos = lista_productos;
      }

      await database.close();

      return {
        status: 200,
        msg: "Recibos buscados exitosamente",
        data: operaciones,
      };
    } catch (e) {
      return { status: 400, msg: "Error al traer los recibos de esta persona" };
    }
  },

  createPurchase: async (values) => {
    const {
      id_persona,
      fecha_operacion,
      total_operacion,
      id_usuario,
      productos,
    } = values;

    try {
      await database.conn();

      //Crea una Operacion
      const { rows } = await database.execute(queryReader.read("Compra"), [
        id_persona,
        fecha_operacion,
        total_operacion,
        id_usuario,
      ]);

      //Crea productos
      for (let producto of productos) {
        let { id_producto, cantidad, buying, costo } = producto;

        await database.execute(queryReader.read("Agregar_Productos_Compra"), [
          rows[0].id_operacion,
          id_producto,
          buying,
          costo,
        ]);

        await database.execute(queryReader.read("Actualizar_Producto"), [
          cantidad + buying,
          id_producto,
        ]);
      }

      await database.close();
      return { status: 200, msg: "Se realizo la compra exitosamente" };
    } catch (e) {
      return { status: 500, msg: "Fallo la compra de los productos" };
    }
  },

  createSale: async (values) => {
    const {
      id_persona,
      fecha_operacion,
      total_operacion,
      id_usuario,
      productos,
    } = values;

    try {
      await database.conn();

      //Crea una Operacion
      const { rows } = await database.execute(queryReader.read("Venta"), [
        id_persona,
        fecha_operacion,
        total_operacion,
        id_usuario,
      ]);

      //Crea productos
      for (let producto of productos) {
        let { id_producto, cantidad, selling } = producto;

        await database.execute(queryReader.read("Agregar_Productos_Venta"), [
          rows[0].id_operacion,
          id_producto,
          selling,
        ]);

        await database.execute(queryReader.read("Actualizar_Producto"), [
          cantidad - selling,
          id_producto,
        ]);
      }

      await database.close();

      return { status: 200, msg: "Se realizo la venta exitosamente" };
    } catch (e) {
      return { status: 500, msg: "Fallo la venta de los productos" };
    }
  },
};

module.exports = operationService;
