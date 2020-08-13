const express = require("express");
const router = express.Router();

const productService = require("../services/product");

//Selecciona todos los productos
router.get("/", async (req, resp) => {
  const res = await productService.getAllProducts();
  resp.send(res);
});

//Selecciona proveedores del producto seleccionado
router.get("/:id", async (req, resp) => {
  const res = await productService.getProviders(req.params.id);
  resp.send(res);
});

//Crear Producto
router.post("/", async (req, resp) => {
  const res = await productService.createProduct(req.body);
  resp.send(res);
});

//Actualiza un producto
router.put("/:id", async (req, resp) => {
  const res = await productService.updateProduct(req.params.id, req.body);
  resp.send(res);
});

module.exports = router;
