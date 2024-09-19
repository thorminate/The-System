"use strict";
// exports the required exp to level up for a given level
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (level) => {
    // Export the function.
    const output = level ** 2 || 1; // Calculate the output.
    const roundedOutput = Math.round(output); // Round the output.
    return roundedOutput; // Return the rounded output.
};
