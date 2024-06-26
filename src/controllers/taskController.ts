import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import process from "process";
import { decodeToken } from "../middleware/authMiddleware";
import { Task } from "../types/express";

const prisma = new PrismaClient();
const passwordEmail = process.env.EMAIL_PASSWORD;
const emailUser = process.env.EMAIL_USER;

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: emailUser,
    pass: passwordEmail,
  },
});

const sendEmail = (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: "seu_email@gmail.com",
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        createdBy: true,
      },
    });

    const response = tasks.map((task: Task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.date,
      priority: task.priority,
      completed: task.completed,
      user: {
        id: task.createdBy.id,
        name: task.createdBy.name,
      },
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addTask = async (req: Request, res: Response) => {
  const { title, description, date, priority } = req.body;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ error: "Token não fornecido" });
  }
  const userId = decodeToken(token).userId;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        date,
        priority,
        completed: false,
        createdById: userId,
      },
    });

    // Enviar e-mail ao usuário
    const userFind = await prisma.user.findUnique({ where: { id: userId } });
    if (userFind && userFind.email) {
      sendEmail(
        userFind.email,
        "Nova Tarefa Criada",
        `Uma nova tarefa foi criada:\n\nTítulo: ${title}\nDescrição: ${description}\nData: ${date}\nPrioridade: ${priority}`
      );
    }

    res.json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const { title, description, date, priority, completed } = req.body;
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ error: "Token não fornecido" });
  }
  const userId =  decodeToken(token).userId

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, date, priority, completed, createdById: userId },
    });

    // Enviar e-mail ao usuário
    const userFind = await prisma.user.findUnique({ where: { id: userId } });
    if (userFind && userFind.email) {
      sendEmail(
        userFind.email,
        "Tarefa Atualizada",
        `A tarefa foi atualizada:\n\nTítulo: ${title}\nDescrição: ${description}\nData: ${date}\nPrioridade: ${priority}\nConcluída: ${completed}`
      );
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { createdBy: true },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      id: task.id,
      title: task.title,
      description: task.description,
      date: task.date,
      priority: task.priority,
      completed: task.completed,
      user: {
        id: task.createdBy.id,
        name: task.createdBy.name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ error: "Token não fornecido" });
  }

  const userId = decodeToken(token).userId;

  try {
    // Verificar se a tarefa existe e quem é o proprietário
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Verificar se o usuário é o proprietário da tarefa ou se é um administrador
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (task.createdById !== userId && !user?.isAdmin) {
      return res.status(403).json({ error: "You do not have permission to delete this task" });
    }

    // Se o usuário passou na verificação, exclua a tarefa
    await prisma.task.delete({ where: { id: taskId } });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

;

