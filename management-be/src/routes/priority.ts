import express, { Router } from 'express';
import {
  createPriority,
  deletePriority,
  assignPriorityToCard,
  unassignPriorityFromCard,
} from '../controllers';
import { auth } from '../middleware';

const router: Router = express.Router();

// Create a new priority
router.post('/', auth, createPriority);

// Delete a priority
router.delete('/:priorityId', auth, deletePriority);

// Assign a priority to a card
router.patch('/:cardId', auth, assignPriorityToCard);

// Unassign a priority from a card
router.delete('/delete/:cardId', auth, unassignPriorityFromCard);

export default router;
