import { Request, Response } from 'express';

// import { Board } from '../models'; //
import { Column, Card } from '../models';
import type { ICard, IColumn } from '../models';

const createCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { columnId, name } = req.body;

    // Find the column where the new card will be added
    const column: IColumn | undefined = (await Column.findById(
      columnId
    )) as IColumn;
    if (!column) {
      res.status(404).send({ message: 'Column not found' });
      return;
    }

    // Create the new card
    const card: ICard = new Card({
      name,
      columnId,
      checklists: [],
      comments: [],
      cover: null,
      description: null,
      due: null,
      priority: null,

      isSubscribed: false,
      memberIds: [],
      labelIds: [],
    });

    // Save the card to the database
    const savedCard: ICard = await card.save();

    // Update the column with the new card's ID
    column.cardIds.push(savedCard.id);
    await column.save();

    res.status(201).send(savedCard);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const copyCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;

    // Find the original card
    const originalCard: ICard | null = await Card.findById(cardId);
    if (!originalCard) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Create the copied card
    const copiedCard: ICard = new Card({
      name: `Duplicate ${originalCard.name}`,
      description: originalCard.description,
      checklists: originalCard.checklists,
      attachments: [],
      comments: [],
      cover: null,
      due: null,
      isSubscribed: false,
      columnId: originalCard.columnId,
      memberIds: [],
      priority: null,
      labelIds: [],
    });

    // Save the copied card to the database
    const savedCopiedCard: ICard = await copiedCard.save();

    // Update the column with the copied card's ID
    const column: IColumn | undefined = (await Column.findById(
      originalCard.columnId
    )) as IColumn;
    if (column) {
      column.cardIds.push(savedCopiedCard.id);
      await column.save();
    }

    res.status(201).send(savedCopiedCard);
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

const updateCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    const { update } = req.body;
    // Find the card to update
    const card: ICard | null = await Card.findById(cardId);
    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Update the card
    const updatedCard: ICard | null = await Card.findByIdAndUpdate(
      cardId,
      update,
      { new: true }
    );

    res.status(200).send(updatedCard);
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

const moveCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;
    const { position, columnId } = req.body;

    // Find the card to move
    const card: ICard | null = await Card.findById(cardId);
    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Find the source column of the card
    const sourceColumn: IColumn | undefined = (await Column.findById(
      card.columnId
    )) as IColumn;
    if (!sourceColumn) {
      res.status(404).send({ message: 'Source column not found' });
      return;
    }

    // Remove the card ID reference from the source column
    sourceColumn.cardIds = sourceColumn.cardIds.filter((id) => id != cardId);

    if (columnId) {
      // Find the destination column for the card
      const destinationColumn: IColumn | undefined = (await Column.findById(
        columnId
      )) as IColumn;
      if (!destinationColumn) {
        res.status(404).send({ message: 'Destination column not found' });
        return;
      }

      // Insert the card ID at the specified position in the destination column
      destinationColumn.cardIds.splice(position, 0, cardId);
      await destinationColumn.save();

      // Update the card's columnId
      card.columnId = columnId;
    } else {
      // If columnId is not provided, move the card within the same column
      sourceColumn.cardIds.splice(position, 0, cardId);
    }

    // Save changes
    await sourceColumn.save();
    await card.save();

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

const deleteCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId } = req.params;

    // Find the card to delete
    const card: ICard | null = await Card.findById(cardId);
    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Find the column containing the card
    const column: IColumn | undefined = (await Column.findById(
      card.columnId
    )) as IColumn;
    if (column) {
      // Remove the card ID from the column
      column.cardIds = column.cardIds.filter((id) => id != cardId);

      await column.save();
    }

    // Delete the card
    await Card.findByIdAndRemove(cardId);

    res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

export { createCard, copyCard, updateCard, moveCard, deleteCard };
