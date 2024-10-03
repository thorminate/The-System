import levelUp from "./user/levelUp";
import giveStat from "./user/giveStat";
import createSkill from "./skill/createSkill";
import grantSkill from "./skill/grantSkill";
import deleteSkill from "./skill/deleteSkill";
import revokeSkill from "./skill/revokeSkill";
import createItem from "./item/createItem";
import giveItem from "./item/giveItem";
import revokeItem from "./item/revokeItem";
import deleteItem from "./item/deleteItem";

/**
 * Index of all the actions
 * @type {Object<Object<Function>>}
 */
export default {
  user: {
    levelUp,
    giveStat,
  },
  skill: {
    create: createSkill,
    grant: grantSkill,
    delete: deleteSkill,
    revoke: revokeSkill,
  },
  item: {
    create: createItem,
    give: giveItem,
    revoke: revokeItem,
    delete: deleteItem,
  },
};
