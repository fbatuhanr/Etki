import { Router } from "express";
import * as eventController from "./event.controller";
import authenticateToken from "../../middleware/authMiddleware";
import { event } from ".";

const router = Router();

// Event Types
router.get("/types", eventController.getEventTypes);

// Event CRUD
router.post("/", authenticateToken, eventController.createEvent);
router.post("/:eventId/attend", authenticateToken, eventController.attendEvent);
router.post("/:eventId/leave", authenticateToken, eventController.leaveEvent);

router.get("/", eventController.getAllEvents);
router.get("/filter", eventController.filterEvents);
router.get('/created/:userId', eventController.getCreatedEvents);
router.get('/joined/:userId', eventController.getJoinedEvents);
router.get("/:id", eventController.getEventById);

router.put("/:id", authenticateToken, eventController.updateEvent);
router.delete("/:id", authenticateToken, eventController.deleteEvent);


export default router;
