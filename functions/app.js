"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
var userRoutes_1 = __importDefault(require("./routes/userRoutes"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', '*', 'https://task-flow-frontend-eta.vercel.app'],
    credentials: true
}));
app.use(express_1.default.json());
app.use('/tasks', taskRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/auth', authRoutes_1.default);
exports.default = app;
