import { Router } from "express";
import { createEvent, getAllEvents, getEventById, getEventTypes } from "./event.controller";
import authenticateToken from "../../middleware/authMiddleware";

const router = Router();

// Event CRUD
router.post("/events", authenticateToken, createEvent);
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);

// Event Types
router.get("/event-types", getEventTypes);

export default router;
