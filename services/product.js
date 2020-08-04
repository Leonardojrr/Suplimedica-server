const DB = require("../database");
const QR = require("../queryReader");

const queryReader = new QR();
const database = new DB();

const productService = {
  //Crear Producto
  createProduct: async (values) => {
    const { code, name, quantity, price, description } = values;

    await database.conn();

    //Verificar Si ya exste el codigo del producto
    const { rowCount } = await database.execute(
      queryReader.read("Producto", "Verificar_Codigo"),
      [code]
    );

    if (rowCount > 0) {
      await database.close();
      return "El codigo del producto que se a ingresado ya existe";
    }

    //Crear Producto
    // prettier-ignore
    const res = await database.execute(queryReader.read("Producto", "Crear"),
      [code, name, quantity, price, description]
    );

    await database.close();

    return res;
  },
};

module.exports = productService;
