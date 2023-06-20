import { Request, Response } from 'express';
import { Column, Card } from '../models';

const createColumn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;

    // Create the new column
    const column = new Column({ name, cardIds: [] });

    // Save the column to the database
    const savedColumn = await column.save();

    res.status(201).send(savedColumn);
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

const updateColumn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { columnId } = req.params;
    const { update } = req.body;

    // Find and update the column
    const updatedColumn = await Column.findByIdAndUpdate(columnId, update, {
      new: true,
    });

    if (!updatedColumn) {
      res.status(404).json({ message: 'Column not found' });
      return;
    }

    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error('[Kanban API]:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const clearColumn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { columnId } = req.params;

    // Find the column
    const column = await Column.findById(columnId);

    if (!column) {
      res.status(404).json({ message: 'Column not found' });
      return;
    }

    // Clear the cardIds in the column
    column.cardIds = [];

    // Update the column in the database
    await column.save();

    // Remove the cards with columnId reference
    await Card.deleteMany({ columnId });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Kanban API]:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeColumn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { columnId } = req.params;

    // Find and remove the column
    const removedColumn = await Column.findByIdAndRemove(columnId);

    if (!removedColumn) {
      res.status(404).json({ message: 'Column not found' });
      return;
    }

    // Remove the cards with columnId reference
    await Card.deleteMany({ columnId });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Kanban API]:', error);
  }
};

export { createColumn, updateColumn, clearColumn, removeColumn };
