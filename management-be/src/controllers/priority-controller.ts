import { Request, Response } from 'express';
import { Priority, Card } from '../models';
import type { IPriority, ICard } from '../models';

// Create a new priority
const createPriority = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const priority: IPriority = await Priority.create({ name });

    res.status(201).send(priority);
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Delete a priority
const deletePriority = async (req: Request, res: Response) => {
  try {
    const { priorityId } = req.params;

    const deletedPriority = await Priority.findByIdAndDelete(priorityId);

    if (!deletedPriority) {
      res.status(404).send({ error: 'Priority not found' });
      return;
    }

    // Remove the priority from all cards
    await Priority.updateMany({}, { $unset: { priority: priorityId } });

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Assign a priority to a card
const assignPriorityToCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const { priority } = req.body;

    const card: ICard | null = await Card.findByIdAndUpdate(
      cardId,
      { priority },
      {
        new: true,
      }
    );

    if (!card) {
      res.status(404).send({ error: 'Card not found' });
      return;
    }

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Unassign a priority from a card
const unassignPriorityFromCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;

    const card: ICard | null = await Card.findByIdAndUpdate(
      cardId,
      { priority: null },
      { new: true }
    );

    if (!card) {
      res.status(404).send({ error: 'Card not found' });
      return;
    }

    res.send({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  createPriority,
  deletePriority,
  assignPriorityToCard,
  unassignPriorityFromCard,
};
