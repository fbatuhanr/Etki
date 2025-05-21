import { Router } from "express";
import * as eventController from "./event.controller";
import authenticateToken from "../../middleware/authMiddleware";

const router = Router();

// Event CRUD
router.post("/", authenticateToken, eventController.createEvent);
router.post("/:eventId/attend", authenticateToken, eventController.attendEvent);
router.post("/:eventId/leave", authenticateToken, eventController.leaveEvent);

router.get("/:eventId/is-favorited", authenticateToken, eventController.checkEventIsFavorited);
router.post("/:eventId/favorite", authenticateToken, eventController.addEventFavorite);
router.delete("/:eventId/favorite", authenticateToken, eventController.removeEventFavorite);
router.get("/favorites/:userId", authenticateToken, eventController.getFavoriteEventsByUser);

router.get("/", eventController.getAllEvents);
router.get("/filter", eventController.filterEvents);
router.get('/created/:userId', eventController.getCreatedEvents);
router.get('/joined/:userId', eventController.getJoinedEvents);
router.get("/:id", eventController.getEventById);

router.put("/:id", authenticateToken, eventController.updateEvent);
router.delete("/:id", authenticateToken, eventController.deleteEvent);

router.delete("/:eventId/attendance/:userId", authenticateToken, eventController.cancelAttendance);



export default router;
