import { Request, Response } from 'express';
import { Card, User } from '../models';
import type { ICard, IUser } from '../models';

// Add a member to a card
const addMemberToCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId, memberId } = req.body;

    // Find the card by its ID
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ error: 'Card not found' });
      return;
    }

    // Find the user by their ID
    const user: IUser | null = await User.findById(memberId);

    if (!user) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    // Add the user's ID to the card's memberIds array
    card.memberIds.push(memberId);

    // Save the updated card
    await card.save();

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Remove a member from a card
const removeMemberFromCard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cardId, memberId } = req.body;

    // Find the card by its ID
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ error: 'Card not found' });
      return;
    }

    // Remove the member's ID from the card's memberIds array
    card.memberIds = card.memberIds.filter((id: string) => id != memberId);

    // Save the updated card
    await card.save();

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

export { addMemberToCard, removeMemberFromCard };
