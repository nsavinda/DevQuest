import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import friendsRoutes from "./routes/friendsRoutes.js";
import groupsRoutes from "./routes/groupsRoutes.js";
import fileUpload from "express-fileupload";
import colabRoutes from "./routes/colabRoutes.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();


app.use(express.json());
app.use(cors());

// enable files upload
app.use(fileUpload({
  createParentPath: true
}));

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/colab", colabRoutes);

if (process.env.NODE_ENV === "test") {
  var server = app.listen(0, () => { });
} else {
  var server = app.listen(port, () => {
    console.log(`Hobby hub backend listening on port ${port}`);
  });
}
export default server;