"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.getTaskById = exports.updateTask = exports.addTask = exports.getTasks = void 0;
var client_1 = require("@prisma/client");
var nodemailer_1 = __importDefault(require("nodemailer"));
var process_1 = __importDefault(require("process"));
var authMiddleware_1 = require("../middleware/authMiddleware");
var prisma = new client_1.PrismaClient();
var passwordEmail = process_1.default.env.EMAIL_PASSWORD;
var emailUser = process_1.default.env.EMAIL_USER;
// Configuração do Nodemailer
var transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailUser,
        pass: passwordEmail,
    },
});
var sendEmail = function (to, subject, text) {
    var mailOptions = {
        from: "seu_email@gmail.com",
        to: to,
        subject: subject,
        text: text,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
};
var getTasks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tasks, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.task.findMany({
                        include: {
                            createdBy: true,
                        },
                    })];
            case 1:
                tasks = _a.sent();
                response = tasks.map(function (task) { return ({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    date: task.date,
                    priority: task.priority,
                    completed: task.completed,
                    user: {
                        id: task.createdBy.id,
                        name: task.createdBy.name,
                    },
                }); });
                res.json(response);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTasks = getTasks;
var addTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, description, date, priority, token, userId, newTask, userFind, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, description = _a.description, date = _a.date, priority = _a.priority;
                token = req.headers.authorization;
                if (!token) {
                    return [2 /*return*/, res.status(400).json({ error: "Token não fornecido" })];
                }
                userId = (0, authMiddleware_1.decodeToken)(token).userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma.task.create({
                        data: {
                            title: title,
                            description: description,
                            date: date,
                            priority: priority,
                            completed: false,
                            createdById: userId,
                        },
                    })];
            case 2:
                newTask = _b.sent();
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
            case 3:
                userFind = _b.sent();
                if (userFind && userFind.email) {
                    sendEmail(userFind.email, "Nova Tarefa Criada", "Uma nova tarefa foi criada:\n\nT\u00EDtulo: ".concat(title, "\nDescri\u00E7\u00E3o: ").concat(description, "\nData: ").concat(date, "\nPrioridade: ").concat(priority));
                }
                res.json(newTask);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addTask = addTask;
var updateTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, _a, title, description, date, priority, completed, token, userId, updatedTask, userFind, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                taskId = parseInt(req.params.id);
                _a = req.body, title = _a.title, description = _a.description, date = _a.date, priority = _a.priority, completed = _a.completed;
                token = req.headers.authorization;
                if (!token) {
                    return [2 /*return*/, res.status(400).json({ error: "Token não fornecido" })];
                }
                userId = (0, authMiddleware_1.decodeToken)(token).userId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma.task.update({
                        where: { id: taskId },
                        data: { title: title, description: description, date: date, priority: priority, completed: completed, createdById: userId },
                    })];
            case 2:
                updatedTask = _b.sent();
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
            case 3:
                userFind = _b.sent();
                if (userFind && userFind.email) {
                    sendEmail(userFind.email, "Tarefa Atualizada", "A tarefa foi atualizada:\n\nT\u00EDtulo: ".concat(title, "\nDescri\u00E7\u00E3o: ").concat(description, "\nData: ").concat(date, "\nPrioridade: ").concat(priority, "\nConclu\u00EDda: ").concat(completed));
                }
                res.json(updatedTask);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateTask = updateTask;
var getTaskById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, task, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskId = parseInt(req.params.id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.task.findUnique({
                        where: { id: taskId },
                        include: { createdBy: true },
                    })];
            case 2:
                task = _a.sent();
                if (!task) {
                    return [2 /*return*/, res.status(404).json({ error: "Task not found" })];
                }
                res.json({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    date: task.date,
                    priority: task.priority,
                    completed: task.completed,
                    user: {
                        id: task.createdBy.id,
                        name: task.createdBy.name,
                    },
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTaskById = getTaskById;
var deleteTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var taskId, token, userId, task, user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                taskId = parseInt(req.params.id);
                token = req.headers.authorization;
                if (!token) {
                    return [2 /*return*/, res.status(400).json({ error: "Token não fornecido" })];
                }
                userId = (0, authMiddleware_1.decodeToken)(token).userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, prisma.task.findUnique({
                        where: { id: taskId },
                    })];
            case 2:
                task = _a.sent();
                if (!task) {
                    return [2 /*return*/, res.status(404).json({ error: "Task not found" })];
                }
                return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
            case 3:
                user = _a.sent();
                if (task.createdById !== userId && !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
                    return [2 /*return*/, res.status(403).json({ error: "You do not have permission to delete this task" })];
                }
                // Se o usuário passou na verificação, exclua a tarefa
                return [4 /*yield*/, prisma.task.delete({ where: { id: taskId } })];
            case 4:
                // Se o usuário passou na verificação, exclua a tarefa
                _a.sent();
                res.json({ message: "Task deleted" });
                return [3 /*break*/, 6];
            case 5:
                error_5 = _a.sent();
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteTask = deleteTask;
;
