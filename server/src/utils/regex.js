"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeRegex = escapeRegex;
function escapeRegex(text) {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
;
