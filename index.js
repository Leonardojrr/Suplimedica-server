const express = require("express");
const app = express();
const session = require("express-session");

//Requires
require("dotenv").config();

//middlewares
app.use(express.json());
app.use((req, resp, next) => {
  resp.header("Access-Control-Allow-Origin", "http://localhost:3000");
  resp.header("Access-Control-Allow-Headers", "*");
  next();
});
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//Routers Imports
const clientRouter = require("./routes/client");
const providerRouter = require("./routes/provider");
const inventoryRouter = require("./routes/inventory");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const saleRouter = require("./routes/sale");
const purchaseRouter = require("./routes/purchase");
const authRouter = require("./routes/login");

//App Routes
app.use("/inventory", inventoryRouter);
app.use("/purchase", purchaseRouter);
app.use("/sale", saleRouter);
app.use("/product", productRouter);
app.use("/provider", providerRouter);
app.use("/client", clientRouter);
app.use("/user", userRouter);
app.use("/login", authRouter);

app.listen(5000, () => {
  console.log("Server listening at port 5000");
});
