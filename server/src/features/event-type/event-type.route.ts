import { Router } from "express";
import * as eventTypeController from "./event-type.controller";

const router = Router();

// Event Types
router.get("/", eventTypeController.getEventTypes);

export default router;
