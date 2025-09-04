import { Request, Response } from "express";
import { getActiveDataSource } from "../../../shared/database.utils";
import Course from "../models/course.model";

export const getCourses = async (_req: Request, res: Response) => {
  try {
    const repo = getActiveDataSource().getRepository(Course);
    const courses = await repo.find();
    return res.json(courses);
  } catch (err) {
    console.error("Error in getCourses:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const repo = getActiveDataSource().getRepository(Course);
    const course = await repo.findOneBy({ id: parseInt(req.params.id, 10) });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json(course);
  } catch (err) {
    console.error("Error in getCourseById:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const repo = getActiveDataSource().getRepository(Course);

    const newCourse = repo.create({
      title: req.body.title,
      description: req.body.description,
    });

    const savedCourse = await repo.save(newCourse);
    return res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Error in createCourse:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const repo = getActiveDataSource().getRepository(Course);
    const course = await repo.findOneBy({ id: parseInt(req.params.id, 10) });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    repo.merge(course, {
      title: req.body.title,
      description: req.body.description,
    });

    const updatedCourse = await repo.save(course);
    return res.json(updatedCourse);
  } catch (err) {
    console.error("Error in updateCourse:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const repo = getActiveDataSource().getRepository(Course);
    const course = await repo.findOneBy({ id: parseInt(req.params.id, 10) });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await repo.remove(course);
    return res.status(204).send();
  } catch (err) {
    console.error("Error in deleteCourse:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};