import { Request, Response } from 'express';
import { Card, Label } from '../models';
import type { ICard, ILabel } from '../models';

// Add a label to a card
const addLabelToCard = async (req: Request, res: Response) => {
  try {
    const { cardId, labelId } = req.params;

    // Find the card
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ error: 'Card not found' });
      return;
    }

    // Add the label ID to the card's labelIds array
    card.labelIds.push(labelId);

    // Save the updated card
    await card.save();

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Remove a label from a card
const removeLabelFromCard = async (req: Request, res: Response) => {
  try {
    const { cardId, labelId } = req.params;

    // Find the card
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ error: 'Card not found' });
      return;
    }

    // Remove the label ID from the card's labelIds array
    card.labelIds = card.labelIds.filter((id: string) => id != labelId);

    // Save the updated card
    await card.save();

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Create a new label
const createLabel = async (req: Request, res: Response) => {
  try {
    const { name, cardId } = req.body;

    // Create the new label
    const label: ILabel = new Label({
      name,
    });

    // If cardId is provided, find the card and add the label ID to its labelIds array
    if (cardId) {
      const card: ICard | null = await Card.findById(cardId);
      if (card) {
        card.labelIds.push(label._id);
        await card.save();
      }
    }

    // Save the new label
    await label.save();

    res.send(label);
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

// Delete a label
const deleteLabel = async (req: Request, res: Response) => {
  try {
    const { labelId } = req.params;

    // Find the label
    const label: ILabel | null = await Label.findById(labelId);

    if (!label) {
      res.status(404).send({ error: 'Label not found' });
      return;
    }

    // Remove the label from the database
    await Label.findByIdAndRemove(labelId);

    // Remove the label ID from all cards' labelIds arrays
    await Card.updateMany({}, { $pull: { labelIds: labelId } });

    res.send({ success: true });
  } catch (err) {
    res.status(500).send({ error: 'Internal server error' });
  }
};

export { addLabelToCard, removeLabelFromCard, createLabel, deleteLabel };
