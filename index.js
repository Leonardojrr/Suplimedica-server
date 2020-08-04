const express = require("express");
const app = express();

//Requires
require("dotenv").config();

//middlewares
app.use(express.json());

//Routers Imports
const clientRouter = require("./routes/client");
const providerRouter = require("./routes/provider");
const inventoryRouter = require("./routes/inventory");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const saleRouter = require("./routes/sale");
const purchaseRoter = require("./routes/purchase");

//App Routes
app.use("/inventory", inventoryRouter);
app.use("/purchase", purchaseRoter);
app.use("/sale", saleRouter);
app.use("/product", productRouter);
app.use("/provider", providerRouter);
app.use("/client", clientRouter);
app.use("/user", userRouter);

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
