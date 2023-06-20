import { Request, Response } from 'express';
import { Card, Checklist } from '../models';
import type { IChecklist, ICard } from '../models';

// Add a checklist
const addChecklist = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const { name } = req.body;

  try {
    // Find the card where the checklist will be added
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Create the new checklist
    const checklist: IChecklist | null = new Checklist({
      name,
      checkItems: [],
    });

    // Add the new checklist to the card
    card.checklists.push(checklist);

    // Save the updated card
    await card.save();
    await checklist.save();

    res.status(200).send(checklist);
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Update a checklist
const updateChecklist = async (req: Request, res: Response) => {
  const { cardId, checklistId } = req.params;
  const { update } = req.body;

  try {
    // Find the card that contains the checklist that will be updated
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Find the checklist that will be updated
    const checklist = card.checklists.find(
      (checklist) => checklist.id === checklistId
    );

    if (!checklist) {
      res.status(404).send({ message: 'checklist not found' });
      return;
    }

    // Update the checklist
    Object.assign(checklist, update);

    // Save the updated card
    await card.save();

    res.status(200).send(checklist);
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

// Delete a checklist
const deleteChecklist = async (req: Request, res: Response) => {
  const { cardId, checklistId } = req.params;

  try {
    // Find the card that contains the checklist that will be removed
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Find the index of the checklist to be removed
    const checklistIndex = card.checklists.findIndex(
      (checklist) => checklist.id === checklistId
    );

    if (checklistIndex === -1) {
      res.status(404).send({ message: 'checklist not found' });
      return;
    }

    // Remove the checklist from the card
    card.checklists.splice(checklistIndex, 1);

    // Save the updated card
    await card.save();

    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

export { addChecklist, updateChecklist, deleteChecklist };
