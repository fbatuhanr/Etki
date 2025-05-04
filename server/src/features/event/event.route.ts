import { Router } from "express";
import { createEvent, getAllEvents, getEventById, getEventTypes } from "./event.controller";
import authenticateToken from "../../middleware/authMiddleware";

const router = Router();

// Event CRUD
router.post("/", authenticateToken, createEvent);
router.get("/", getAllEvents);
router.get(":id", getEventById);

// Event Types
router.get("/types", getEventTypes);

export default router;
