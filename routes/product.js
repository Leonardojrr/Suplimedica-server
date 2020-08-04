const express = require("express");
const router = express.Router();

const productService = require("../services/product");

router.get("/", async (req, resp) => {});

router.get("/:id", async (req, resp) => {});

//Crear Producto
router.post("/", async (req, resp) => {
  const res = await productService.createProduct(req.body);
  resp.send(res);
});

router.put("/:id", async (req, resp) => {});

router.delete("/:id", async (req, resp) => {});

module.exports = router;
