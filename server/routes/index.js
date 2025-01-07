"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const slideRoutes_1 = __importDefault(require("./slideRoutes"));
const router = express_1.default.Router();
router.use(slideRoutes_1.default);
exports.default = router;
