"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = require("./socket");
/* Import Routes */
const user_1 = require("./features/user");
const friend_1 = require("./features/friend");
const event_1 = require("./features/event");
const event_type_1 = require("./features/event-type");
const message_1 = require("./features/message");
const auth_1 = require("./features/auth");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
/* CONFIGURATIONS */
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_NAME })
    .then(() => console.log("Connected to the database"))
    .catch((e) => console.log("Error connecting to database", e));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
/*const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  credentials: true,
};*/
// app.use(cors(corsOptions));
const corsOptions = {
    origin: "http://localhost:8081", // veya Expo web client hangi porttaysa
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json({ limit: "100mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
const expressServer = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
(0, socket_1.initializeSocket)(expressServer);
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.use("/user", user_1.user);
app.use("/friend", friend_1.friend);
app.use("/event", event_1.event);
app.use("/event-type", event_type_1.eventType);
app.use("/message", message_1.message);
app.use("/auth", auth_1.auth);
app.use(errorHandler_1.default);
