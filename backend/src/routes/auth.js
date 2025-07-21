import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // ✅ IMPORT NO TOPO
import dotenv from "dotenv";

dotenv.config(); // ✅ Carrega variáveis do .env

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;


// ✅ ROTA DE CADASTRO
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return res.status(201).json({ message: "Usuário criado com sucesso!", user });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao criar usuário", details: err.message });
  }
});

// ✅ ROTA DE LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verifica se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    // 2. Verifica se a senha está correta

    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta." });
    }
    // 3. Gera o token JWT

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
 // 4. Retorna o usuário (sem a senha) + token
    const { password: _, ...userSemSenha } = user;

    return res.json({
      message: "Login realizado com sucesso!",
      user: userSemSenha,
      token
    });

  } catch (err) {
    return res.status(500).json({ error: "Erro no login", details: err.message });
  }
});

export default router;
