import express from "express";
import * as messageController from "./message.controller";
import authenticateToken from "../../middleware/authMiddleware";

const router = express.Router();

router.post("/counts", authenticateToken, messageController.getMessageCountsByEventIds);
router.get("/:eventId", authenticateToken, messageController.getMessagesByEventId);
router.post("/:eventId", authenticateToken, messageController.sendMessage);

export default router;
