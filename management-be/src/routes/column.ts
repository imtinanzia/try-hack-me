import express, { Router } from 'express';
import {
  createColumn,
  updateColumn,
  clearColumn,
  removeColumn,
} from '../controllers';
import { auth } from '../middleware';

const router: Router = express.Router();

// Create a new column
router.post('/', auth, createColumn);

// Update a column
router.patch('/:columnId', auth, updateColumn);

// Clear a column
router.patch('/:columnId/clear', auth, clearColumn);

// Delete a column
router.delete('/:columnId', auth, removeColumn);

export default router;
