const express = require("express");
const router = express.Router();
const userService = require("../services/user");

router.get("/", async (req, resp) => {
  const res = await userService.getAllUsers();
  resp.send(res);
});

router.post("/", async (req, resp) => {
  const res = await userService.createUser(req.body);
  resp.send(res);
});

router.put("/:id", async (req, resp) => {
  const res = await userService.updateUser(req.params.id, req.body);
  resp.send(res);
});

router.delete("/:id", async (req, resp) => {});

module.exports = router;
