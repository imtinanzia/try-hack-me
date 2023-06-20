import { Request, Response } from 'express';
import { Card, CheckItem } from '../models';
import type { IChecklist, ICard, ICheckItem } from '../models';

const addCheckItem = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { cardId, checklistId } = req.params;
    const { name } = req.body;
    // Find the card where the check item will be added
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }

    // Find the checklist where the check item will be added
    const checklist: IChecklist | undefined = card.checklists.find(
      (checklist) => checklist._id == checklistId
    );

    if (!checklist) {
      return res.status(404).send({ message: 'Checklist not found' });
    }

    // Create the new check item
    const checkItem: ICheckItem | null = new CheckItem({
      name,
      state: 'incomplete',
    });

    // Add the check item to the checklist
    checklist.checkItems.push(checkItem);

    // Save the updated card
    await card.save();
    await checkItem.save();

    return res.status(200).send(checkItem);
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const updateCheckItem = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cardId, checklistId, checkItemId }: any = req.params;
    const { update } = req.body;

    // Find the card where the check item will be updated
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      return res.status(404).send({ message: 'Card not found' });
    }

    // Find the checklist containing the check item
    const checklist: IChecklist | undefined = card.checklists.find(
      (checklist) => checklist._id == checklistId
    );

    if (!checklist) {
      return res.status(404).send({ message: 'Checklist not found' });
    }

    // Find the check item within the checklist
    const checkItem: ICheckItem | undefined = checklist.checkItems.find(
      (item) => item._id == checkItemId
    );

    if (!checkItem) {
      return res.status(404).send({ message: 'Check item not found' });
    }

    // Update the check item
    Object.assign(checkItem, update);

    // Save the updated card
    await card.save();

    return res.status(200).send(checkItem);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteCheckItem = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { cardId, checklistId, checkItemId }: any = req.params;

    // Find the card where the check item will be deleted
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Find the checklist containing the check item
    const checklist: IChecklist | undefined = card.checklists.find(
      (checklist) => checklist._id == checklistId
    );

    if (!checklist) {
      return res.status(404).send({ message: 'Checklist not found' });
    }

    // Find the index of the check item within the checklist
    const checkItemIndex: number = checklist.checkItems.findIndex(
      (item) => item._id == checkItemId
    );

    if (checkItemIndex === -1) {
      return res.status(404).send({ message: 'Check item not found' });
    }

    // Remove the check item from the checklist
    checklist.checkItems.splice(checkItemIndex, 1);

    // Save the updated card
    await card.save();

    return res.status(200).send({ message: 'Check item deleted successfully' });
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

export { addCheckItem, updateCheckItem, deleteCheckItem };
