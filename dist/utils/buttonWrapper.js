"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Turn an array of buttons into an array of action rows.
const discord_js_1 = require("discord.js"); // Import the discord.js library.
exports.default = (buttons) => {
    // Export the function.
    const components = []; // Define components as an array.
    let currentRow = new discord_js_1.ActionRowBuilder(); // Define currentRow as an ActionRowBuilder.
    for (let button of buttons) {
        // Loop through the buttons.
        if (button % 5 === 0 && button > 0) {
            // If the button is divisible by 5 and greater than 0.
            components.push(currentRow); // Push currentRow to components.
            currentRow = new discord_js_1.ActionRowBuilder(); // Set currentRow as an ActionRowBuilder.
        }
        currentRow.addComponents(button); // Add the button to currentRow.
    }
    if (currentRow.components.length > 0) {
        // If currentRow has components.
        components.push(currentRow); // Push currentRow to components.
    }
    return components;
};
