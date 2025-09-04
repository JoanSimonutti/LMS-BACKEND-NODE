import { Router } from "express";
import { 
  createLesson, 
  getLessonById, 
  getLessons,
  updateLesson,
  deleteLesson 
} from "../controllers/lessons.controllers";

const router = Router();

router.route('/')
  .get(getLessons)
  .post(createLesson);

router.route('/:id')
  .get(getLessonById)
  .put(updateLesson)
  .delete(deleteLesson);

export default router;