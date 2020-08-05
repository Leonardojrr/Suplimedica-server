const DB = require("../database");
const QR = require("../queryReader");

const database = new DB();
const queryReader = new QR();
queryReader.addPath("Producto");

const productService = {
  //Crear Producto
  createProduct: async (values) => {
    const { code, name, quantity, price, description } = values;

    await database.conn();

    //Verificar Si ya exste el codigo del producto
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
      [code, name, quantity, price, description]
    );

    await database.close();

    return res;
  },
};

module.exports = productService;
