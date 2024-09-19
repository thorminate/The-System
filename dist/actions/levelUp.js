"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Levels up the user and returns the new level.
 * @param {Document} user
 * @returns {Document}
 */
exports.default = async (user) => {
    if (!user)
        return;
    function getRandomMultiplier(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const strengthMultiplied = getRandomMultiplier(1, 5) * user.strengthMultiplier;
    const willMultiplied = getRandomMultiplier(1, 5) * user.willMultiplier;
    const cognitionMultiplied = getRandomMultiplier(1, 5) * user.cognitionMultiplier;
    user.exp = 0;
    user.level++;
    user.strength += strengthMultiplied;
    user.will += willMultiplied;
    user.cognition += cognitionMultiplied;
    // then round the values
    user.strength = Math.round(user.strength);
    user.will = Math.round(user.will);
    user.cognition = Math.round(user.cognition);
    await user.save().catch(console.error);
    return user;
};
