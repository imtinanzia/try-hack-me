import { auth } from '../middleware';
import express, { Router } from 'express';
import { addChecklist, updateChecklist, deleteChecklist } from '../controllers';

const router: Router = express.Router();

// Add a checklist to a card
router.post('/cards/:cardId/checklists', auth, addChecklist);

// Update a checklist
router.patch('/cards/:cardId/checklists/:checklistId', auth, updateChecklist);

// Delete a checklist
router.delete('/cards/:cardId/checklists/:checklistId', auth, deleteChecklist);

export default router;
