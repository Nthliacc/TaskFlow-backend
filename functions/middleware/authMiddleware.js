"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Decodifica a chave secreta Base64
const JWT_SECRET_BASE64 = process.env.JWT_SECRET_BASE64;
const JWT_SECRET = process.env.JWT_SECRET;
try {
    // jwt.verify(JWT_SECRET, JWT_SECRET);
    // Use 'JWT_SECRET' para assinar tokens JWT
}
catch (error) {
    console.error('Erro ao decodificar a chave secreta Base64:', error);
    process.exit(1);
}
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not provided or invalid format' });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token', error: err });
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const generateToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ userId, email }, JWT_SECRET, {
        expiresIn: '1h',
    });
};
exports.generateToken = generateToken;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.verify(token.split(' ')[1], JWT_SECRET);
};
exports.decodeToken = decodeToken;
