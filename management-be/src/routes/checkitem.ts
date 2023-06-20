import express, { Router } from 'express';
import { addCheckItem, updateCheckItem, deleteCheckItem } from '../controllers';
import { auth } from '../middleware';

const router: Router = express.Router();

// Add a check item to a checklist
router.post(
  '/cards/:cardId/checklists/:checklistId/checkItems',
  auth,
  addCheckItem
);

// Update a check item
router.patch(
  '/cards/:cardId/checklists/:checklistId/checkItems/:checkItemId',
  auth,
  updateCheckItem
);

// Delete a check item
router.delete(
  '/cards/:cardId/checklists/:checklistId/checkItems/:checkItemId',
  auth,
  deleteCheckItem
);

export default router;
