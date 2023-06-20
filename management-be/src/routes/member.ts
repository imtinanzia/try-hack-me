import express, { Router } from 'express';
import { addMemberToCard, removeMemberFromCard } from '../controllers';
import { auth } from '../middleware';

const router: Router = express.Router();

// Add a member to a card
router.post('/cards/addMember', auth, addMemberToCard);

// Remove a member from a card
router.post('/cards/removeMember', auth, removeMemberFromCard);

export default router;
