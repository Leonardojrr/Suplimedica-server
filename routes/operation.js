const express = require("express");
const router = express.Router();
const operationService = require("../services/operation");

router.get("/:id", async (req, resp) => {
  const res = await operationService.getOperations(req.params.id);
  resp.send(res);
});

router.post("/buy", async (req, resp) => {
  const res = await operationService.createPurchase(req.body);
  resp.send(res);
});

router.post("/sell", async (req, resp) => {
  const res = await operationService.createSale(req.body);
  resp.send(res);
});

module.exports = router;
