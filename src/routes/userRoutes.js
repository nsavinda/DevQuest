import express from "express";
import userService from "../services/userService.js";
import HttpStatus from "../enums/httpStatus.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const response = await userService.getUser(id);

  if (response.status == HttpStatus.NOT_FOUND) {
    res.status(response.status).json({ message: "" });
  } else {
    res.status(response.status).json(response);
  }
});

router.get("/", async (req, res) => {
  const response = await userService.getUsers();

  if (response.status == HttpStatus.NOT_FOUND) {
    res.status(response.status).json({ message: "Users Not Found" });
  } else if (response.status == HttpStatus.INTERNAL_SERVER_ERROR) {
    res.status(response.status).json({ message: "Internal server error" });
  } else {
    res.status(response.status).json(response);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const response = await userService.deleteUser(id);
  if (response.status == HttpStatus.NOT_FOUND) {
    res.status(response.status).json({ message: "User Not Found" });
  } else {
    res.status(response.status).json(response);
  }
});

export default router;
