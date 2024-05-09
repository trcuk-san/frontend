const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://truck-san:hEDO9eR7V9b8nuwA@truck-san.b45xjyf.mongodb.net/truck-san?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});