import express from "express";
import cors from "cors";

import CourseRoutes from "./modules/courses/routes/courses.routes";
import ModuleRoutes from "./modules/modules/routes/modules.routes";
import LessonRoutes from "./modules/lessons/routes/lessons.routes";
import CompletionRoutes from "./modules/completions/routes/completions.routes";
import UserRoutes from "./modules/users/routes/users.routes";

const apiService = express();

apiService.use(cors());
apiService.use(express.json({}));
apiService.use(express.urlencoded({ extended: true }));

apiService.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

apiService.use("/courses", CourseRoutes);
apiService.use("/modules", ModuleRoutes);
apiService.use("/lessons", LessonRoutes);
apiService.use("/completions", CompletionRoutes);
apiService.use("/users", UserRoutes);

export default apiService;
