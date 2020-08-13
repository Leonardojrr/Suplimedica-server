const express = require("express");
const router = express.Router();
const userService = require("../services/user");

router.post("/", async (req, resp) => {
  const res = await userService.login(req.body);
  resp.send(res);
});

module.exports = router;
