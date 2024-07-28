import express from "express";
import bodyParser from "body-parser";
import { isUri } from "valid-url";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
app.get("/filteredimage", async (req, res) => {
  const { image_url: imageUrl } = req.query;
  const imageRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;

  if (!imageUrl) {
    return res.status(422).send({ message: "Unprocessable entity" });
  }

  if (!imageRegex.test(imageUrl)) {
    return res.status(404).send({ message: "Image url not found" });
  }

  if (!imageUrl || (typeof imageUrl === "string" && !isUri(imageUrl))) {
    return res
      .status(400)
      .send({ auth: false, message: "Image url is missing or malformed" });
  }

  const filteredPath = await filterImageFromURL(imageUrl);
  res.sendFile(filteredPath, {}, () => deleteLocalFiles([filteredPath]));
});
//! END @TODO1

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
