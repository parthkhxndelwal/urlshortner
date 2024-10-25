const express = require("express");
const path = require("path");
const dotenv=require('dotenv').config();
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const app = express();
const PORT = process.env.PORT || 8001; 

connectToMongoDB("mongodb+srv://deepanshunegi98:dsL63fIhFC5aKLuY@cluster0.h5f4x.mongodb.net/urlShortner?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
