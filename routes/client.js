const express = require("express");
const router = express.Router();
const clientService = require("../services/client");

router.get("/", async (req, resp) => {
  let res;
  const { name, ci } = req.query;

  //Selecciona todos los clientes
  if (!name && !ci) {
    res = await clientService.getAllClients();
    resp.send(res);
  }

  // Selecciona clientes por nombre y por ci
  if (name && ci) {
    res = await clientService.getClient([`%${name}%`, `${ci}%`]);
    resp.send(res.rows);
  }

  //Seleccina clientes por nombre
  if (name && !ci) {
    res = await clientService.getClientByName([`%${name}%`]);
    resp.send(res.rows);
  }

  //Selecciona clientes por ci
  if (ci && !name) {
    res = await clientService.getClientByCi([`${ci}%`]);
    resp.send(res.rows);
  }
});

//Crear cliente
router.post("/", async (req, resp) => {
  const res = await clientService.createClient(req.body);
  resp.send(res);
});

//Actualiza un cliente
router.put("/:id", async (req, resp) => {
  const res = await clientService.updateClient(req.params.id, req.body);
  resp.send(res);
});

//Borra un cliente
router.delete("/:id", async (req, resp) => {
  const res = await clientService.deleteClient(req.params.id);
  resp.send(res);
});

module.exports = router;
