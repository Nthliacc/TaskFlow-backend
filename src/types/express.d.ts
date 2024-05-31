import { User } from '../models/User';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

// models/Task
export interface Task {
  id: number;
  title: string;
  description: string;
  date: string | null;
  priority: string;
  completed: boolean;
  createdBy?: User;
  createdAt: Date;
  createdById?: number;
}