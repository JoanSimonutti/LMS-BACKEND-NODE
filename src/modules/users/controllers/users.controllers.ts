import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/users.services";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await registerUser(name, email, password);
    return res.status(201).json(user);
  } catch (err: any) {
    if (err.message === "Email already in use") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Error in register:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { user, token } = await loginUser(email, password);
    return res.status(200).json({ user, token });
  } catch (err: any) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ message: err.message });
    }
    console.error("Error in login:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
