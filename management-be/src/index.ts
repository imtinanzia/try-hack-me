import express, { Application } from 'express';
import dotenv from 'dotenv';
import {
  AuthController,
  CardController,
  CheckItemController,
  CheckListController,
  ColumnController,
  CommentController,
  LabelController,
  PriorityController,
  BoardController,
  MemberController,
} from './routes';
import { connectDB } from './config';
import cors from 'cors';

dotenv.config();

//   Create port variable from .env file
const port = process.env.PORT || 8000;

const app: Application = express();

// connect to db
connectDB();

// Middleware to parse JSON request bodies
//  * MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register user routes
app.use('/api/users', AuthController);
app.use('/api/cards', CardController);
app.use('/api/checkitem', CheckItemController);
app.use('/api/checklist', CheckListController);
app.use('/api/columns', ColumnController);
app.use('/api/comments', CommentController);
app.use('/api/labels', LabelController);
app.use('/api/priority', PriorityController);
app.use('/api/boards', BoardController);
app.use('/api/members', MemberController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
