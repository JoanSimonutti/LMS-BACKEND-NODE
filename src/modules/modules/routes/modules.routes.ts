import { Router } from "express";
import {
  createModule,
  getModuleById,
  getModules,
  updateModule,
  deleteModule,
} from "../controllers/modules.controllers";

const router = Router();

router.route("/")
  .get(getModules)
  .post(createModule);

router.route("/:moduleId")
  .get(getModuleById)
  .put(updateModule)
  .delete(deleteModule);

export default router;
