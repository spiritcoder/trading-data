const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fetchBulkArray  = require("./services/service.js");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  let exchanges = req.query.exchanges;
  let coins = req.query.coins;

  coins = Array.isArray(coins) ? coins : [coins];
  exchanges = Array.isArray(exchanges) ? exchanges : [exchanges];
  let data;
  
  if(exchanges == '' || coins == '' || exchanges == undefined || coins == undefined){
    data = await fetchBulkArray();
  }
  else {
    data = await fetchBulkArray(exchanges, coins);
  }

  res.render("index", { data });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
