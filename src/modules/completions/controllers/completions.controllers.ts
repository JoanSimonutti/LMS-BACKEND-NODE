import { Request, Response } from "express";
import { AppDataSource } from "../../../database";
import Completion from "../models/Completion";
import User from "../../users/models/user.model";
import Lesson from "../../lessons/models/Lesson";

const parseId = (value: string | undefined) => {
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const createCompletion = async (req: Request, res: Response) => {
  try {
    const { userId, lessonId, progressPercentage = 100 } = req.body as {
      userId?: number | string;
      lessonId?: number | string;
      progressPercentage?: number;
    };

    const userIdNum = parseId(String(userId));
    const lessonIdNum = parseId(String(lessonId));

    if (!userIdNum) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (!lessonIdNum) {
      return res.status(400).json({ message: "Invalid lessonId" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const lessonRepo = AppDataSource.getRepository(Lesson);
    const completionRepo = AppDataSource.getRepository(Completion);

    // Verificar que el usuario existe
    const user = await userRepo.findOne({ where: { id: userIdNum } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Verificar que la lección existe
    const lesson = await lessonRepo.findOne({ where: { id: lessonIdNum } });
    if (!lesson) {
      return res.status(400).json({ message: "Lesson not found" });
    }

    // Verificar si ya existe una completion para este usuario y lección
    const existingCompletion = await completionRepo.findOne({
      where: { userId: userIdNum, lessonId: lessonIdNum },
    });

    if (existingCompletion) {
      return res.status(400).json({ message: "User has already completed this lesson" });
    }

    // Validar progressPercentage
    const progress = Math.max(0, Math.min(100, progressPercentage));

    const completion = completionRepo.create({
      userId: userIdNum,
      lessonId: lessonIdNum,
      user,
      lesson,
      progressPercentage: progress,
    });

    const savedCompletion = await completionRepo.save(completion);
    return res.status(201).json(savedCompletion);
  } catch (err) {
    console.error("Error creating completion:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompletions = async (req: Request, res: Response) => {
  try {
    const userIdNum = parseId(req.query.userId as string | undefined);
    const lessonIdNum = parseId(req.query.lessonId as string | undefined);

    const completionRepo = AppDataSource.getRepository(Completion);

    const where: any = {};
    if (userIdNum) where.userId = userIdNum;
    if (lessonIdNum) where.lessonId = lessonIdNum;

    const completions = await completionRepo.find({
      where,
      relations: ["user", "lesson"],
      order: { completedAt: "DESC" },
    });

    return res.json(completions);
  } catch (err) {
    console.error("Error fetching completions:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCompletionById = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid completion id" });
    }

    const completionRepo = AppDataSource.getRepository(Completion);
    const completion = await completionRepo.findOne({
      where: { id },
      relations: ["user", "lesson"],
    });

    if (!completion) {
      return res.status(404).json({ message: "Completion not found" });
    }

    return res.json(completion);
  } catch (err) {
    console.error("Error fetching completion by id:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCompletion = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid completion id" });
    }

    const { progressPercentage } = req.body as {
      progressPercentage?: number;
    };

    const completionRepo = AppDataSource.getRepository(Completion);
    const completion = await completionRepo.findOne({ where: { id } });

    if (!completion) {
      return res.status(404).json({ message: "Completion not found" });
    }

    if (progressPercentage !== undefined) {
      const progress = Math.max(0, Math.min(100, progressPercentage));
      completion.progressPercentage = progress;
    }

    const savedCompletion = await completionRepo.save(completion);
    return res.json(savedCompletion);
  } catch (err) {
    console.error("Error updating completion:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCompletion = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid completion id" });
    }

    const completionRepo = AppDataSource.getRepository(Completion);
    const completion = await completionRepo.findOne({ where: { id } });

    if (!completion) {
      return res.status(404).json({ message: "Completion not found" });
    }

    await completionRepo.remove(completion);
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting completion:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProgress = async (req: Request, res: Response) => {
  try {
    const userId = parseId(req.params.userId);
    if (!userId) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const completionRepo = AppDataSource.getRepository(Completion);
    
    const completions = await completionRepo.find({
      where: { userId },
      relations: ["lesson", "lesson.module", "lesson.module.course"],
      order: { completedAt: "DESC" },
    });

    const progress = {
      totalCompletions: completions.length,
      averageProgress: completions.length > 0 
        ? completions.reduce((sum, c) => sum + c.progressPercentage, 0) / completions.length 
        : 0,
      completions: completions.map(c => ({
        id: c.id,
        lessonTitle: c.lesson.title,
        moduleTitle: c.lesson.module?.title || 'Unknown Module',
        courseTitle: c.lesson.module?.course?.title || 'Unknown Course',
        progressPercentage: c.progressPercentage,
        completedAt: c.completedAt,
      })),
    };

    return res.json(progress);
  } catch (err) {
    console.error("Error fetching user progress:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};