"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    // Duplicate key error
    if (err instanceof mongodb_1.MongoError && err.code === 11000) {
        res.status(409).json({ message: "Duplicate key error: A record with this information already exists." });
        return;
    }
    // Mongoose validation error
    if (err instanceof mongoose_1.Error.ValidationError) {
        const messages = Object.values(err.errors).map((error) => error.message);
        res.status(400).json({ message: `Validation Error: ${messages.join(", ")}` });
        return;
    }
    // Mongoose cast error
    if (err instanceof mongoose_1.Error.CastError) {
        res.status(400).json({ message: `Invalid ${err.path}: ${err.value}.` });
        return;
    }
    // General server error
    res.status(500).json({ message: `${err.message}` || "Internal Server Error" });
};
exports.default = errorHandler;
