import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', '*','https://task-flow-frontend-eta.vercel.app'],
    credentials: true
}));
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

export default app;
