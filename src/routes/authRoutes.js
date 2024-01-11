import express from "express";
import authService from "../services/authService.js";
import HttpStatus from "../enums/httpStatus.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  const response = await authService.signUp(data);

  if (response.status == HttpStatus.FORBIDDEN) {
    res
      .status(response.status)
      .json({ message: "Try a different email address" });
  } else {
    res.status(response.status).json(response);
  }
});

router.post("/login", async (req, res) => {
  const data = req.body;
  const response = await authService.login(data);

  if (response == HttpStatus.FORBIDDEN) {
    res.status(HttpStatus.FORBIDDEN).json({ message: "User Not Found" });
  } else if (response == HttpStatus.NOT_FOUND) {
    res.status(HttpStatus.NOT_FOUND).json({ message: "Password Mismatch" });
  } else {
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, response: response });
  }
});

export default router;