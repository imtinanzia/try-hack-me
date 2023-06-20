import express, { Router } from 'express';
import { auth } from '../middleware';
import {
  createCard,
  copyCard,
  updateCard,
  moveCard,
  deleteCard,
} from '../controllers';

const cardRouter: Router = express.Router();

// Create a new card
cardRouter.post('/', auth, createCard);

// Copy a card
cardRouter.post('/:cardId/copy', auth, copyCard);

// Update a card
cardRouter.patch('/:cardId', auth, updateCard);

// Move a card to a different position or column
cardRouter.patch('/:cardId/move', auth, moveCard);

// Delete a card
cardRouter.delete('/:cardId', auth, deleteCard);

export default cardRouter;
