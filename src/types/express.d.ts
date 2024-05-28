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
  date: Date;
  priority: number;
  completed: boolean;
  createdBy: User;
}