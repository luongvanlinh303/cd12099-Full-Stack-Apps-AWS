import express from 'express';
import {Request, Response} from 'express';
import bodyParser from 'body-parser';
import { isUri } from "valid-url";
import {filterImageFromURL, deleteLocalFiles} from './util/util';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get("/filteredimage/",async (req: Request,res: Response)=>{
  let {image_url}: any = req.query;
  const imageRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))$/i;

  if(!image_url) {
    return res.status(422)
              .send({message: "Unprocessable entity"});
  }

  if (!imageRegex.test(image_url)) {
    return res
    .status(404)
    .send({message: "Image url not found"});
  }

  const filteredPath = await filterImageFromURL(image_url);
  res.sendFile(filteredPath, {}, () => deleteLocalFiles([filteredPath]));

});

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
