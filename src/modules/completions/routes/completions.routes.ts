import { Router } from "express";
import { 
  createCompletion,
  getCompletions,
  getCompletionById,
  updateCompletion,
  deleteCompletion,
  getUserProgress
} from "../controllers/completions.controllers";

const router = Router();

router.route('/')
  .get(getCompletions)
  .post(createCompletion);

router.route('/:id')
  .get(getCompletionById)
  .put(updateCompletion)
  .delete(deleteCompletion);

// Ruta especial para obtener progreso de un usuario
router.get('/user/:userId/progress', getUserProgress);

export default router;