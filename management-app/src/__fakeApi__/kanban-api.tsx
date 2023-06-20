import { subDays, addDays } from 'date-fns';
import type {
  Board,
  Card,
  CheckItem,
  Checklist,
  Column,
  Comment,
  Label,
  Priority,
} from '../types';
import { deepCopy, createResourceId } from '../utils';

// You'll see here that we start with a deep clone of the board.
// The reason for that is to create a db session wannabe strategy.
// If something fails, we do not affect the original data until everything worked as expected.

const now = new Date();

let board: Board = {
  cards: [
    {
      _id: '5e849c8708bd72683b454747',
      attachments: [{ _id: '5e849c8708bd72683b454747' }],
      checklists: [
        {
          _id: '5e84a8175c48d3f5b1d01972',
          name: 'Update overview page',
          checkItems: [
            {
              _id: '5e85af37da584c5e4bd8a06c',
              name: 'An item',
              state: 'complete',
            },
          ],
        },
      ],
      priority: 'High',
      comments: [
        {
          _id: '15e849c5a35d4dff4f88ebff6',
          cardId: '5e849c8708bd72683b454747',
          createdAt: subDays(now, 5).getTime(),
          memberId: '5e887ac47eed253091be10cb',
          message: 'This is a comment',
          replies: [],
        },
      ],
      cover: '/static/mock-images/projects/project_3.png',
      description:
        'Duis condimentum lacus finibus felis pellentesque, ac auctor nibh fermentum. Duis sed dui ante. Phasellus id eros tincidunt, dictum lorem vitae, pellentesque sem. Aenean eu enim sit amet mauris rhoncus mollis. Sed enim turpis, porta a felis et, luctus faucibus nisi. Phasellus et metus fermentum, ultrices arcu aliquam, facilisis justo. Cras nunc nunc, elementum sed euismod ut, maximus eget nibh. Phasellus condimentum lorem neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce sagittis pharetra eleifend. Suspendisse potenti.',
      due: addDays(now, 7).getTime(),
      isSubscribed: false,
      columnId: '5e849c39325dc5ef58e5a5db',
      memberIds: ['5e86809283e28b96d2d38537'],
      labelIds: ['123'],
      name: 'Call with sales of HubSpot',
    },
    {
      _id: '5e849c90fabe1f1f4b3557f6',
      attachments: [],
      checklists: [],
      comments: [],
      labelIds: [],
      priority: null,
      cover: null,
      description:
        'We are looking for vue experience and of course node js strong knowledge',
      due: addDays(now, 6).getTime(),
      isSubscribed: true,
      columnId: '5e849c39325dc5ef58e5a5db',
      memberIds: ['5e887b209c28ac3dd97f6db5', '5e887a62195cc5aef7e8ca5d'],
      name: 'Interview for the Asis. Sales Manager',
    },
    {
      _id: '5e849c977ef6265938bfd90b',
      attachments: [],
      checklists: [],
      comments: [],
      labelIds: [],
      priority: null,

      cover: null,
      description:
        'We need to make it aggressive with pricing because it’s in their interest to acquire us',
      due: null,
      isSubscribed: false,
      columnId: '5e849c39325dc5ef58e5a5db',
      memberIds: [],
      name: 'Change the height of the top bar because it looks too chunky',
    },
    {
      _id: '5e849c9e34ee93bc7255c599',
      attachments: [],
      checklists: [],
      comments: [],
      labelIds: [],
      priority: null,

      cover: null,
      description:
        'We need to make it aggressive with pricing because it’s in their interest to acquire us',
      due: null,
      isSubscribed: false,
      columnId: '5e849c39325dc5ef58e5a5db',
      memberIds: ['5e887ac47eed253091be10cb', '5e86809283e28b96d2d38537'],
      name: 'Integrate Stripe API',
    },
    {
      _id: '5e849ca7d063dc3830d4b49c',
      attachments: [],
      checklists: [],
      comments: [],
      labelIds: [],
      priority: null,

      cover: null,
      description:
        'We need to make it aggressive with pricing because it’s in their interest to acquire us',
      due: null,
      isSubscribed: true,
      columnId: '5e849c2b38d238c33e516755',
      memberIds: ['5e887a62195cc5aef7e8ca5d'],
      name: 'Update the customer API for payments',
    },
    {
      _id: '5e849cb5d0c6e8894451fdfa',
      attachments: [],
      checklists: [],
      labelIds: [],
      priority: null,

      comments: [],
      cover: null,
      description:
        'We need to make it aggressive with pricing because it’s in their interest to acquire us',
      due: null,
      isSubscribed: true,
      columnId: '5e849c2b38d238c33e516755',
      memberIds: [],
      name: 'Redesign the landing page',
    },
  ],
  columns: [
    {
      _id: '5e849c39325dc5ef58e5a5db',
      name: 'Todo',
      cardIds: [
        '5e849c8708bd72683b454747',
        '5e849c90fabe1f1f4b3557f6',
        '5e849c977ef6265938bfd90b',
        '5e849c9e34ee93bc7255c599',
      ],
    },
    {
      _id: '5e849c2b38d238c33e516755',
      name: 'Progress',
      cardIds: ['5e849ca7d063dc3830d4b49c', '5e849cb5d0c6e8894451fdfa'],
    },
    {
      _id: '5e849c2b38d238c33e5146755',
      name: 'Done',
      cardIds: [],
    },
  ],
  members: [
    {
      _id: '5e887a62195cc5aef7e8ca5d',
      avatar: '/static/mock-images/avatars/avatar-marcus_finn.png',
      name: 'Marcus Finn',
    },
    {
      _id: '5e887ac47eed253091be10cb',
      avatar: '/static/mock-images/avatars/avatar-carson_darrin.png',
      name: 'Carson Darrin',
    },
    {
      _id: '5e887b209c28ac3dd97f6db5',
      avatar: '/static/mock-images/avatars/avatar-fran_perez.png',
      name: 'Fran Perez',
    },
    {
      _id: '5e887b7602bdbc4dbb234b27',
      avatar: '/static/mock-images/avatars/avatar-jie_yan_song.png',
      name: 'Jie Yan Song',
    },
    {
      _id: '5e86809283e28b96d2d38537',
      avatar: '/static/mock-images/avatars/avatar-jane_rotanson.png',
      name: 'Jane Rotanson',
    },
  ],
  labels: [
    {
      _id: '454nk3244292234',
      name: 'Frontend',
    },
    {
      _id: '454nk3244292235',
      name: 'Backend',
    },
    {
      _id: '454nk3244292230',
      name: 'Integration',
    },
  ],
  priority: [
    {
      _id: '23h27721912323',
      name: 'Low',
    },
    {
      _id: '23h27721912112',
      name: 'Medium',
    },
    {
      _id: '23h27721912641',
      name: 'High',
    },
  ],
};

class KanbanApi {
  getBoard(): Promise<Board> {
    return Promise.resolve(deepCopy(board));
  }

  createColumn({ name }: any): Promise<Column> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Create the new column
        const column: Column = {
          _id: createResourceId(),
          name,
          cardIds: [],
        };

        clonedBoard.columns.push(column);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(column));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateColumn({ columnId, update }: any): Promise<Column> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the column to clear
        const column = clonedBoard.columns.find(
          (_column: any) => _column.id === columnId
        );

        // Update the column
        Object.assign(column, update);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(column));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  clearColumn(columnId: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the column to clear
        const column = clonedBoard.columns.find(
          (_column: any) => _column._id === columnId
        );

        if (!column) {
          reject(new Error('Column not found'));
          return;
        }

        // Remove the cards with columnId reference
        clonedBoard.cards = clonedBoard.cards.filter(
          (card: any) => card.columnId !== columnId
        );

        // Remove all cardIds from the column
        column.cardIds = [];

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteColumn(columnId: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the column to remove
        const column = clonedBoard.columns.find(
          (_column: any) => _column._id === columnId
        );

        if (!column) {
          reject(new Error('Column not found'));
          return;
        }

        // Remove the cards with columnId reference
        clonedBoard.cards = clonedBoard.cards.filter(
          (card: any) => card.columnId !== columnId
        );

        // Remove the column from the board
        clonedBoard.columns = clonedBoard.columns.filter(
          (_column: any) => _column._id !== columnId
        );

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  createCard({ columnId, name }: any): Promise<Card> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the column where the new card will be added
        const column = clonedBoard.columns.find(
          (_column: any) => _column._id === columnId
        );

        if (!column) {
          reject(new Error('Column not found'));
          return;
        }

        // Create the new card
        const card: Card = {
          _id: createResourceId(),
          attachments: [],
          checklists: [],
          comments: [],
          cover: null,
          description: null,
          due: null,
          priority: null,

          isSubscribed: false,
          columnId,
          memberIds: [],
          labelIds: [],

          name,
        };

        // Add the new card
        clonedBoard.cards.push(card);

        // Add the cardId reference to the column
        column.cardIds.push(card._id);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(card));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  copyCard({ cardId }: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the original card
        const originalCard = clonedBoard.cards.find(
          (card: { _id: string }) => card._id === cardId
        );

        if (!originalCard) {
          reject(new Error('Card not found'));
          return;
        }

        // Create the copy card
        const copiedCard = {
          _id: createResourceId(),
          name: `Duplicate ${originalCard.name}`,
          description: originalCard.description,
          checklists: deepCopy(originalCard.checklists),
          attachments: [],
          comments: [],
          cover: null,
          due: null,
          isSubscribed: false,
          columnId: originalCard.columnId,
          memberIds: [],
        };

        // Add the copied card to the board
        clonedBoard.cards.push(copiedCard);

        // Find the column where the copied card will be added
        const column = clonedBoard.columns.find(
          (column: { id: string }) => column.id === copiedCard.columnId
        );

        if (!column) {
          reject(new Error('Column not found'));
          return;
        }

        // Add the card ID reference to the column
        column.cardIds.push(copiedCard._id);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(copiedCard));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateCard({ cardId, update }: any): Promise<Card> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card that will be updated
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Update the card
        if (update.name) {
          card.name = update.name;
        }

        if (update.description) {
          card.description = update.description;
        }

        // Update the card
        Object.assign(card, update);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(card));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  moveCard({ cardId, position, columnId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);
        // Find the card that will be moved
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the source column of the card
        const sourceList = clonedBoard.columns.find(
          (column: { _id: any }) => column._id === card.columnId
        );

        if (!sourceList) {
          reject(new Error('Column not found'));
          return;
        }

        // Remove the cardId reference from the source list
        sourceList.cardIds = sourceList.cardIds.filter(
          (_cardId: any) => _cardId !== cardId
        );

        if (columnId) {
          // Find the destination column for the card
          const destinationList = clonedBoard.columns.find(
            (column: { _id: any }) => column._id === columnId
          );

          if (!destinationList) {
            reject(new Error('Column not found'));
            return;
          }

          // Add the cardId reference to the destination list
          destinationList.cardIds.splice(position, 0, card.id);

          // Store the new columnId reference
          card.columnId = destinationList.id;
        } else {
          // If columnId is not provided, it means that we move the card in the same list
          sourceList.cardIds.splice(position, 0, card.id);
        }

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteCard(cardId: string): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card that will be removed
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Remove the card from board
        clonedBoard.cards = clonedBoard.cards.filter(
          (_card: { _id: any }) => _card._id !== cardId
        );

        // Find the column using the columnId reference
        const column = clonedBoard.columns.find(
          (_column: { _id: any }) => _column._id === card.columnId
        );

        // If for some reason it does not exist, there's no problem. Maybe something broke before.
        if (column) {
          column.cardIds = column.cardIds.filter(
            (_cardId: any) => _cardId !== cardId
          );
        }

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addComment({ cardId, message }: any): Promise<Comment> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the comment will be added
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Create the new comment
        // Important: On server get memberId from request identity (user)
        const comment = {
          _id: createResourceId(),
          cardId,
          createdAt: now.getTime(),
          memberId: '5e86809283e28b96d2d38537',
          message,
          replies: [],
        };

        // Add the new comment to card
        card.comments.push(comment);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(comment));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteComment({ cardId, commentId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card that contains the comment
        const card = clonedBoard.cards.find(
          (_card: { _id: string }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the card that contains the comment
        const comments = card.comments.filter(
          (_comment: { _id: string }) => _comment._id === commentId
        );

        // Remove the comment from the card
        card.comments = comments.filter(
          (comment: { _id: string }) => comment._id !== commentId
        );

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateComment({ cardId, commentId, update }: any): Promise<Comment> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card that contains the comment
        const card = clonedBoard.cards.find(
          (_card: { _id: string }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the comment to update
        const comment = card.comments.find(
          (_comment: { _id: string }) => _comment._id === commentId
        );

        if (!comment) {
          reject(new Error('Comment not found'));
          return;
        }

        // Update the comment

        Object.assign(comment, update);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(comment));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addChecklist({ cardId, name }: any): Promise<Checklist> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the checklist will be added
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Create the new checklist
        const checklist: Checklist = {
          _id: createResourceId(),
          name,
          checkItems: [],
        };

        // Add the new checklist to card
        card.checklists.push(checklist);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(checklist));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateChecklist({ cardId, checklistId, update }: any): Promise<Checklist> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card that contains the checklist that will be updated
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the checklist that will be updated
        const checklist = card.checklists.find(
          (_checklist: { _id: any }) => _checklist._id === checklistId
        );

        if (!checklist) {
          reject(new Error('Checklist not found'));
          return;
        }

        // Update the checklist
        Object.assign(checklist, update);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(checklist));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteChecklist({ cardId, checklistId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card that contains the checklist that will be removed
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Remove the checklist from the card
        card.checklists = card.checklists.filter(
          (checklists: { _id: any }) => checklists._id !== checklistId
        );

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addCheckItem({ cardId, checklistId, name }: any): Promise<CheckItem> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the checklist will be added
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the checklist where the check item will be added
        const checklist = card.checklists.find(
          (_checklist: { _id: any }) => _checklist._id === checklistId
        );

        if (!checklist) {
          reject(new Error('Checklist not found'));
          return;
        }

        // Create the new check item
        const checkItem: CheckItem = {
          _id: createResourceId(),
          checklistId,
          name,
          state: 'incomplete',
        };

        // Add the check item to the checklist
        checklist.checkItems.push(checkItem);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(checkItem));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  updateCheckItem({
    cardId,
    checklistId,
    checkItemId,
    update,
  }: any): Promise<CheckItem> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the checklist will be added
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the checklist where the check item will be updated
        const checklist = card.checklists.find(
          (_checklist: { _id: any }) => _checklist._id === checklistId
        );

        if (!checklist) {
          reject(new Error('Checklist not found'));
          return;
        }

        // Find the checklist where the check item will be updated
        const checkItem = checklist.checkItems.find(
          (_checkItem: { _id: any }) => _checkItem._id === checkItemId
        );

        if (!checkItem) {
          reject(new Error('Check item not found'));
          return;
        }

        // Update the check item
        Object.assign(checkItem, update);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(checkItem));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteCheckItem({ cardId, checklistId, checkItemId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card that contains the checklist that contains the check item that will be removed
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the checklist where the check item will be updated
        const checklist = card.checklists.find(
          (_checklist: { _id: any }) => _checklist._id === checklistId
        );

        if (!checklist) {
          reject(new Error('Checklist not found'));
          return;
        }

        // Remove the check item from the checklist
        checklist.checkItems = checklist.checkItems.filter(
          (checkItem: { _id: any }) => checkItem._id !== checkItemId
        );

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addLabelToCard({ cardId, labelId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the label will be added
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Add the label ID to the card's labelIds array
        card.labelIds.push(labelId);

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  removeLabelFromCard({ cardId, labelId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the label will be removed
        const card = clonedBoard.cards.find(
          (_card: { _id: any }) => _card._id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Remove the label ID from the card's labelIds array
        card.labelIds = card.labelIds.filter((_id: string) => _id !== labelId);

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  createLabel({ name, cardId }: any): Promise<Label> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy of the board
        const clonedBoard = deepCopy(board);

        // Create the new label
        const label: Label = {
          _id: createResourceId(),
          name,
        };

        // Add the new label to the board's labels array
        clonedBoard.labels.push(label);

        // If cardId is provided, find the card and add the label ID to its labelIds array
        if (cardId) {
          const cardIndex = clonedBoard.cards.findIndex(
            (card: { _id: string }) => card._id === cardId
          );
          if (cardIndex !== -1) {
            clonedBoard.cards[cardIndex].labelIds.push(label._id);
          }
        }

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(label));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deleteLabel(labelId: string): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the label that will be removed
        const labelIndex = clonedBoard.labels.findIndex(
          (label: { id: string }) => label.id === labelId
        );

        if (labelIndex === -1) {
          reject(new Error('Label not found'));
          return;
        }

        // Remove the label from the board's labels array
        clonedBoard.labels.splice(labelIndex, 1);

        // Remove the label ID from all cards' labelIds arrays
        clonedBoard.cards.forEach((card: { labelIds: string[] }) => {
          card.labelIds = card.labelIds.filter((id: string) => id !== labelId);
        });

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  createPriority({ name }: any): Promise<Priority> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy of the board
        const clonedBoard = deepCopy(board);

        // Create the new priority
        const priority: Priority = {
          _id: createResourceId(),
          name,
        };

        // Add the new priority to the board's priority array
        clonedBoard.priority.push(priority);

        // Save changes
        board = clonedBoard;

        resolve(deepCopy(priority));
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  deletePriority(priorityId: string, priority: string): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the priority that will be removed
        const priorityIndex = clonedBoard.priority.findIndex(
          (priority: { id: string }) => priority.id === priorityId
        );

        if (priorityIndex === -1) {
          reject(new Error('Priority not found'));
          return;
        }

        // Remove the priority from the board's priority array
        clonedBoard.priority.splice(priorityIndex, 1);

        // Remove the priority from all cards
        clonedBoard.cards.forEach((card: { priority: string }) => {
          if (card.priority.toLowerCase() === priority.toLowerCase()) {
            card.priority = null as any;
          }
        });

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  assignPriorityToCard({ cardId, priorityId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the priority will be assigned
        const card = clonedBoard.cards.find(
          (_card: { id: any }) => _card.id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Find the priority with the given priorityId
        const priority = clonedBoard.priority.find(
          (_priority: { id: string }) => _priority.id === priorityId
        );

        if (!priority) {
          reject(new Error('Priority not found'));
          return;
        }

        // Assign the priority name to the card
        card.priority = priority.name;

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  unassignPriorityFromCard({ cardId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the priority will be unassigned
        const card = clonedBoard.cards.find(
          (_card: { id: any }) => _card.id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Unassign the priority from the card
        card.priority = null;

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  addMemberToCard({ cardId, memberId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the member will be added
        const card = clonedBoard.cards.find(
          (_card: { id: any }) => _card.id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Add the member ID to the card's memberIds array
        card.memberIds.push(memberId);

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  removeMemberFromCard({ cardId, memberId }: any): Promise<true> {
    return new Promise((resolve, reject) => {
      try {
        // Make a deep copy
        const clonedBoard = deepCopy(board);

        // Find the card where the member will be removed
        const card = clonedBoard.cards.find(
          (_card: { id: any }) => _card.id === cardId
        );

        if (!card) {
          reject(new Error('Card not found'));
          return;
        }

        // Remove the member ID from the card's memberIds array
        card.memberIds = card.memberIds.filter((id: string) => id !== memberId);

        // Save changes
        board = clonedBoard;

        resolve(true);
      } catch (err) {
        console.error('[Kanban Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  filterCards({
    labelIds,
    memberIds,
    priority,
    name,
  }: {
    labelIds?: string[];
    memberIds?: string[];
    priority?: string[];
    name?: string[];
  }): Promise<Board> {
    return new Promise((resolve) => {
      // Make a deep copy
      const clonedBoard = deepCopy(board);

      const filteredCards = clonedBoard.cards.filter((card: Card) => {
        // Check if the card matches the filter criteria
        const hasMatchingLabels =
          labelIds === undefined ||
          labelIds.some((labelId) => card.labelIds.includes(labelId));

        const hasMatchingMembers =
          memberIds === undefined ||
          memberIds.some((memberId) => card.memberIds.includes(memberId));

        const hasMatchingPriority =
          priority === undefined ||
          priority.some((cardPriority) =>
            card?.priority?.includes(cardPriority)
          );

        const hasMatchingName =
          name === undefined ||
          name.some((cardName) =>
            card.name.toLowerCase().includes(cardName.toLowerCase())
          );

        return (
          hasMatchingLabels ||
          hasMatchingMembers ||
          hasMatchingPriority ||
          hasMatchingName
        );
      });

      clonedBoard.columns.forEach((column: Column) => {
        column.cardIds = filteredCards
          .filter((card: Card) => card.columnId === column._id)
          .map((card: Card) => card._id);
      });

      resolve(clonedBoard);
    });
  }
}

export const kanbanApi = new KanbanApi();
