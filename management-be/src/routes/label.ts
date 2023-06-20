import express, { Router } from 'express';
import {
  addLabelToCard,
  removeLabelFromCard,
  createLabel,
  deleteLabel,
} from '../controllers';
import { auth } from '../middleware';

const router: Router = express.Router();

// Add a label to a card
router.post('/cards/:cardId/labels/:labelId', auth, addLabelToCard);

// Remove a label from a card
router.delete('/cards/:cardId/labels/:labelId', auth, removeLabelFromCard);

// Create a new label
router.post('/', auth, createLabel);

// Delete a label
router.delete('/:labelId', auth, deleteLabel);

export default router;
