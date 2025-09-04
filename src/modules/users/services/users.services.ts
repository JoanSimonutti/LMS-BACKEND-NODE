import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { getDataSource } from "../../../database";
import { TestDataSource } from "../../../database.test";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const getActiveDataSource = () => {
  return process.env.NODE_ENV === "test" ? TestDataSource : getDataSource();
};

export const registerUser = async (name: string, email: string, password: string) => {
  const dataSource = getActiveDataSource();
  const userRepository = dataSource.getRepository(User);

  const existingUser = await userRepository.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepository.create({ name, email, password: hashedPassword });

  await userRepository.save(user);
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const dataSource = getActiveDataSource();
  const userRepository = dataSource.getRepository(User);

  const user = await userRepository.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  return { user, token };
};