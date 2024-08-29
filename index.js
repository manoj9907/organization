const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const morgan = require("morgan");
const dotenv = require("dotenv");
var cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(passport.initialize());
require("./config/passport")(passport);
require("./models/User");
require("./models/Organization");

app.use("/api/auth", require("./routes/auth"));
app.use("/api/organizations", require("./routes/organizations"));
app.use("/api/users", require("./routes/users"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
