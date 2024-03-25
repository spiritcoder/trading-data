const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fetchBulkArray  = require("./services/service.js");

const app = express();
const port = 3001;

app.use(cors());

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  let exchange = req.query.exchange;
  let duration = req.query.duration;

  exchange = Array.isArray(exchange) ? exchange : [exchange];

  let data;
  
  if(exchange == '' || duration == '' || exchange == undefined || duration == undefined){
    data = await fetchBulkArray();
  }
  else {
    data = await fetchBulkArray(exchange, duration);
  }

  res.render("index", { data });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
