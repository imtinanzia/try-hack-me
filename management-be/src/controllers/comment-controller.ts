import { Request, Response } from 'express';
import type { IComment, ICard } from '../models'; // Assuming you have models defined for Comment and Card
import { Comment, Card } from '../models';
import type { AuthRequest } from './user-controller';

const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { cardId, message } = req.body;

    // Find the card where the comment will be added
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Create the new comment
    // Important: On the server, get memberId from the request identity (user)
    const newComment: IComment = new Comment({
      cardId,
      memberId: req?.userId, // Replace with the actual member ID
      message,
      replies: [],
    });

    // Add the new comment to the card
    card.comments.push(newComment);

    // Save the updated card
    await card.save();

    res.status(201).send({ comment: newComment });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId, commentId } = req.params;

    // Find the card that contains the comment
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Find the comment to delete
    const commentIndex = card.comments.findIndex(
      (comment) => comment.id === commentId
    );

    if (commentIndex === -1) {
      res.status(404).send({ message: 'Comment not found' });
      return;
    }

    // Remove the comment from the card
    card.comments.splice(commentIndex, 1);

    // Save the updated card
    await card.save();

    res.status(200).send({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

const updateComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cardId, commentId } = req.params;
    const { update } = req.body;

    // Find the card that contains the comment
    const card: ICard | null = await Card.findById(cardId);

    if (!card) {
      res.status(404).send({ message: 'Card not found' });
      return;
    }

    // Find the comment to update
    const comment = card.comments.find((comment) => comment.id === commentId);

    if (!comment) {
      res.status(404).send({ message: 'Comment not found' });
      return;
    }

    // Update the comment
    Object.assign(comment, update);

    // Save the updated card
    await card.save();

    res.status(200).send(comment);
  } catch (error) {
    res.status(500).send({ message: 'Internal server error' });
  }
};

export { addComment, deleteComment, updateComment };
