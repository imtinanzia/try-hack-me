import express, { Router } from 'express';
import { addComment, deleteComment, updateComment } from '../controllers';
import { auth } from '../middleware';

const router: Router = express.Router();

// Add a comment
router.post('/', auth, addComment);

// Delete a comment
router.delete('/:cardId/:commentId', auth, deleteComment);

// Update a comment
router.patch('/:cardId/:commentId', auth, updateComment);

export default router;
