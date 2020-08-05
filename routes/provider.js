const express = require("express");
let router = express.Router();

const providerService = require("../services/provider");

//Seleccionar Proveedor
router.get("/", async (req, resp) => {
  let res;
  const { name, ci } = req.query;

  //Seleccionar Todos
  if (!name && !ci) {
    res = await providerService.getAllProviders();
    resp.send(res.rows);
  }

  //Seleccionar por nombre y ci
  if (name && ci) {
    res = await providerService.getProvider([`%${name}%`, `${ci}%`]);
    resp.send(res.rows);
  }

  //Seleccionar por nombre
  if (name && !ci) {
    res = await providerService.getProviderByName([`%${name}%`]);
    resp.send(res.rows);
  }

  //Seleccionar por ci
  if (ci && !name) {
    res = await providerService.getProviderByCi([`${ci}%`]);
    resp.send(res.rows);
  }
});

//Seleccionar productos de todos los proveedores
router.get("/product", async (req, resp) => {
  const res = await providerService.getAllProducts();
  resp.send(res.rows);
});

//Seleccionar productos de un proveedor
router.get("/product/:id", async (req, resp) => {
  const res = await providerService.getProducts(req.params.id);
  resp.send(res.rows);
});

//Crear Proveedor
router.post("/", async (req, resp) => {
  const res = await providerService.createProvider(req.body);
  resp.send(res);
});

//Añadir Producto a un Proveedor
router.post("/product", async (req, resp) => {
  const res = await providerService.addProduct(req.body);
  resp.send(res);
});

//Actualizar proveedor
router.put("/:id", async (req, resp) => {
  const res = await providerService.updateProvider(req.params.id, req.body);
  resp.send(res);
});

//Eliminar Producto de un proveedor
router.delete("/product/:id", async (req, resp) => {
  req.body.id_provider = req.params.id;
  const res = await providerService.delProduct(req.body);
  resp.send(res);
});

//Borrar Proveedor
router.delete("/:id", async (req, resp) => {
  const res = await providerService.deleteProvider(req.params.id);
  resp.send(res);
});

module.exports = router;
