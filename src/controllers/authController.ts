import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { decodeToken, generateToken } from "../middleware/authMiddleware";

dotenv.config();

const prisma = new PrismaClient();

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("email:", email, "password:", password)
  try {
    // Buscar usuário pelo e-mail
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Gerar token JWT
    const token = generateToken(user.id, user.email);

    // Retornar o token no corpo da resposta
    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const checkToken = async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(400).json({ error: "Token não fornecido" });
  }

  try {
    if (token) {
      decodeToken(token)
        ? res.json({ message: "Token válido" })
        : res.status(403).json({ message: "Token inválido" });
    } else {
      res.status(403).json({ message: "Token inválido" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};