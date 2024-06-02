import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to TaskFlow API');
});



export default app;
