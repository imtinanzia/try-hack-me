import { Request, Response } from 'express';
import { Card, Column, User, Label, Priority } from '../models';
import type { ICard, IColumn } from '../models';

const getBoardData = async (req: Request, res: Response) => {
  try {
    // Retrieve all cards
    const cards = await Card.find();

    // Retrieve all columns
    const columns = await Column.find();

    // Retrieve all members
    const members = await User.find();

    // Retrieve all labels
    const labels = await Label.find();

    // Retrieve all priorities
    const priority = await Priority.find();

    // Shape the data according to the desired structure
    const boardData = {
      cards,
      columns,
      members,
      labels,
      priority,
    };

    // Send the shaped data as the response
    res.send(boardData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { getBoardData };
