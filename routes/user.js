const express = require("express");
const router = express.Router();
const userService = require("../services/user");

router.get("/", async (req, resp) => {});

router.get("/:id", async (req, resp) => {});

router.post("/", async (req, resp) => {
  const res = await userService.createUser(req.body);
  resp.send(res);
});

router.put("/:id", async (req, resp) => {});

router.delete("/:id", async (req, resp) => {});

module.exports = router;
