"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = refreshToken;
const authService = __importStar(require("./auth.service"));
const ms_1 = __importDefault(require("ms"));
function refreshToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.cookies; // get the refresh token from the cookies
            if (!refreshToken) {
                res.status(403).json({ message: "Refresh token not provided." });
                return;
            }
            const newTokens = yield authService.refreshToken(refreshToken);
            if (newTokens) {
                res.cookie("refreshToken", newTokens.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", // its true when production and its false development mode
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // its none when we made production because its based on different domains, but in development its strict because localhost wants that
                    maxAge: (0, ms_1.default)(process.env.REFRESH_TOKEN_EXPIRATION),
                });
                res.status(200).json({ message: "Token refreshed successfully!", accessToken: newTokens.accessToken, });
            }
            else {
                res.status(403).json({ message: "Invalid refresh token." });
            }
        }
        catch (error) {
            next(error);
        }
    });
}
