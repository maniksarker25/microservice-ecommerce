"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
// /users/:id?field=id|authUserId
const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const field = req.query.field;
        let filter = {};
        if (field == "authUserId") {
            filter.authUserId = id;
        }
        else {
            filter.id = id;
        }
        const user = await prisma_1.default.user.findUnique({ where: filter });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.default = getUserById;
//# sourceMappingURL=get_user_by_id.js.map