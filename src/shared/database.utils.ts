import { getDataSource } from "../database";
import { TestDataSource } from "../database.test";

export const getActiveDataSource = () => {
  return process.env.NODE_ENV === "test" ? TestDataSource : getDataSource();
};