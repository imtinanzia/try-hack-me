import express, { Router } from 'express';
import { auth } from '../middleware';
import { getBoardData } from '../controllers';

const board: Router = express.Router();

board.get('/', auth, getBoardData);

export default board;
