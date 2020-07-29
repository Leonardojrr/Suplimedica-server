const express = require("express");
let router = express.Router();

const providerService = require("../services/providerService");

router.get("/", async (req, resp) => {});

router.get("/:id", async (req, resp) => {});

router.post("/", async (req, resp) => {
  console.log("hOLA CHAMO PERRO");
  await providerService.createProvider([
    "Leonardo Rodrigues",
    "Av 5 de julio, AV 2B, Edificio Sofia Palace",
    "04121680168",
    "28009205",
  ]);
});

router.put("/:id", async (req, resp) => {});

router.delete("/:id", async (req, resp) => {});

module.exports = router;
