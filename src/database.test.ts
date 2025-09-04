import "reflect-metadata";
import { DataSource } from "typeorm";
import Course from "./modules/courses/models/course.model";
import Module from "./modules/modules/models/Module";
import User from "./modules/users/models/user.model";
import Lesson from "./modules/lessons/models/Lesson";
import Completion from "./modules/completions/models/Completion";

export const TestDataSource = new DataSource({
  type: "mysql",
  host: "mysql",
  port: 3306,
  username: "root",
  password: "root",
  database: "lms",  
  synchronize: true,
  logging: false,
  entities: [Course, Module, User, Lesson, Completion],
});