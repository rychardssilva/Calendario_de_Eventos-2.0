import express from "express";
import { PrismaClient } from "@prisma/client";
import { verificarToken } from "../middleware/authMiddleware.js";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

/* ------------------------------------------------------------------
 * 🔐 Validação (Zod)
 * ------------------------------------------------------------------ */
const eventSchema = z.object({
  title: z.string({ required_error: "Título é obrigatório" }).min(3, "Título deve ter ao menos 3 caracteres"),
  description: z.string().optional(),
  date: z.string({ required_error: "Data é obrigatória" }).refine((val) => !isNaN(Date.parse(val)), "Data inválida"),
  time: z.string({ required_error: "Hora é obrigatória" }).min(1, "Hora é obrigatória"),
  location: z.string({ required_error: "Local é obrigatório" }).min(2, "Local é obrigatório"),
  category: z.string({ required_error: "Categoria é obrigatória" }).min(2, "Categoria é obrigatória"),
  bannerUrl: z.string({ required_error: "Banner é obrigatório" }).url("URL do banner inválida"),
});

// Para update aceitamos campos parciais
const eventUpdateSchema = eventSchema.partial();

/* ------------------------------------------------------------------
 * ✅ GET /api/events?page=1&limit=10
 * ------------------------------------------------------------------ */
router.get("/events", verificarToken, async (req, res) => {
  console.log("🔐 [GET /events] Usuário autenticado:", req.user);
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.event.count();
    const events = await prisma.event.findMany({
      skip,
      take: limit,
      orderBy: { date: "asc" },
    });

    const interestedEvents = await prisma.event.findMany({
      where: { interested: { some: { id: userId } } },
      select: { id: true },
    });
    const interestedSet = new Set(interestedEvents.map((e) => e.id));

    const eventsWithInterest = await Promise.all(
      events.map(async (event) => {
        const count = await prisma.user.count({
          where: { interests: { some: { id: event.id } } },
        });
        return {
          ...event,
          interested: interestedSet.has(event.id),
          interestedCount: count,
        };
      })
    );

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      events: eventsWithInterest,
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar eventos", details: err.message });
  }
});

/* ------------------------------------------------------------------
 * ✅ GET /api/events/:id
 * ------------------------------------------------------------------ */
router.get("/events/:id", verificarToken, async (req, res) => {
  console.log("🔐 [GET /events/:id] Usuário autenticado:", req.user);
  const userId = req.user.id;
  const eventId = parseInt(req.params.id, 10);

  if (Number.isNaN(eventId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const ev = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        interested: {
          where: { id: userId },
          select: { id: true },
        },
        _count: { select: { interested: true } },
      },
    });

    if (!ev) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    return res.json({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      category: ev.category,
      bannerUrl: ev.bannerUrl,
      creatorId: ev.creatorId,
      interested: ev.interested.length > 0,
      interestedCount: ev._count.interested,
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar evento", details: err.message });
  }
});

/* ------------------------------------------------------------------
 * ✅ POST /api/events
 * ------------------------------------------------------------------ */
router.post("/events", verificarToken, async (req, res) => {
  console.log("🔐 [POST /events] Usuário autenticado:", req.user);
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso negado. Apenas ADMIN pode criar eventos." });
  }

  try {
    const data = eventSchema.parse(req.body);
    const event = await prisma.event.create({
      data: { ...data, creatorId: req.user.id },
    });

    return res.status(201).json({ message: "Evento criado com sucesso!", event });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Validação falhou", details: err.errors });
    }
    return res.status(500).json({ error: "Erro ao criar evento", details: err.message });
  }
});

/* ------------------------------------------------------------------
 * ✅ PUT /api/events/:id
 * ------------------------------------------------------------------ */
router.put("/events/:id", verificarToken, async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Acesso negado. Apenas ADMIN pode atualizar eventos." });
  }

  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    // Verifica se o criador do evento é o usuário logado
    if (event.creatorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Você não pode editar este evento." });
    }

    // Validação parcial
    const data = eventUpdateSchema.parse(req.body);
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({ error: "Nenhum campo enviado para atualização." });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: parseInt(id) },
      data,
    });

    return res.json({ message: "Evento atualizado com sucesso!", updatedEvent });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validação falhou", details: err.errors });
    }
    return res
      .status(500)
      .json({ error: "Erro ao atualizar evento", details: err.message });
  }
});


/* ------------------------------------------------------------------
 * ✅ DELETE /api/events/:id
 * ------------------------------------------------------------------ */
router.delete("/events/:id", verificarToken, async (req, res) => {
  console.log("🔐 [DELETE /events/:id] Usuário autenticado:", req.user);
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acesso negado. Apenas ADMIN pode excluir eventos." });
  }

  const { id } = req.params;
  try {
    await prisma.event.delete({ where: { id: parseInt(id) } });
    return res.json({ message: "Evento excluído com sucesso!" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao excluir evento", details: err.message });
  }
});

/* ------------------------------------------------------------------
 * ✅ POST /api/events/:id/interesse
 * ------------------------------------------------------------------ */
router.post("/events/:id/interesse", verificarToken, async (req, res) => {
  console.log("🔐 [POST /events/:id/interesse] Usuário autenticado:", req.user);
  const eventId = parseInt(req.params.id);

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Evento não encontrado" });

    const exists = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { interests: { where: { id: eventId }, select: { id: true } } },
    });

    if (exists?.interests?.length) {
      return res.status(400).json({ message: "Você já demonstrou interesse neste evento." });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { interests: { connect: { id: eventId } } },
    });

    return res.json({ message: "Interesse registrado com sucesso!" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao registrar interesse", details: err.message });
  }
});

/* ------------------------------------------------------------------
 * ✅ DELETE /api/events/:id/interesse
 * ------------------------------------------------------------------ */
router.delete("/events/:id/interesse", verificarToken, async (req, res) => {
  console.log("🔐 [DELETE /events/:id/interesse] Usuário autenticado:", req.user);
  const eventId = parseInt(req.params.id);

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return res.status(404).json({ error: "Evento não encontrado" });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { interests: { disconnect: { id: eventId } } },
    });

    return res.json({ message: "Interesse removido com sucesso!" });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao remover interesse", details: err.message });
  }
});

/* ------------------------------------------------------------------
 * ✅ GET /api/me/interesses
 * ------------------------------------------------------------------ */
router.get("/me/interesses", verificarToken, async (req, res) => {
  console.log("🔐 [GET /me/interesses] Usuário autenticado:", req.user);
  const userId = req.user.id;

  try {
    const events = await prisma.event.findMany({
      where: { interested: { some: { id: userId } } },
      orderBy: { date: "asc" },
      include: { _count: { select: { interested: true } } },
    });

    const result = events.map((ev) => ({
      id: ev.id,
      title: ev.title,
      description: ev.description,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      category: ev.category,
      bannerUrl: ev.bannerUrl,
      creatorId: ev.creatorId,
      interested: true,
      interestedCount: ev._count.interested,
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao buscar interesses", details: err.message });
  }
});

export default router;
