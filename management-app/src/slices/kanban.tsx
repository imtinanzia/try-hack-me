import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { kanbanApi } from '../__fakeApi__';
import type { AppThunk } from '../store';
import type {
  Board,
  Card,
  CheckItem,
  Checklist,
  Column,
  CommentWithReplies,
  Label,
  Member,
  Priority,
} from '../types';
import { objFromArray, axios } from '../utils';

interface KanbanState {
  isLoaded: boolean;
  columns: {
    byId: Record<string, Column>;
    allIds: string[];
  };
  cards: {
    byId: Record<string, Card>;
    allIds: string[];
  };
  members: {
    byId: Record<string, Member>;
    allIds: string[];
  };
  labels: {
    byId: Record<string, Label>;
    allIds: string[];
  };
  priority: {
    byId: Record<string, Priority>;
    allIds: string[];
  };
}

const initialState: KanbanState = {
  isLoaded: false,
  columns: {
    byId: {},
    allIds: [],
  },
  cards: {
    byId: {},
    allIds: [],
  },
  members: {
    byId: {},
    allIds: [],
  },
  labels: {
    byId: {},
    allIds: [],
  },
  priority: {
    byId: {},
    allIds: [],
  },
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    getBoard(state: KanbanState, action: PayloadAction<Board>): void {
      const board = action.payload;

      state.columns.byId = objFromArray(board.columns);
      state.columns.allIds = Object.keys(state.columns.byId);
      state.cards.byId = objFromArray(board.cards);
      state.cards.allIds = Object.keys(state.cards.byId);
      state.members.byId = objFromArray(board.members);
      state.members.allIds = Object.keys(state.members.byId);
      state.labels.byId = objFromArray(board.labels);
      state.labels.allIds = Object.keys(state.labels.byId);
      state.priority.byId = objFromArray(board.priority);
      state.priority.allIds = Object.keys(state.priority.byId);
      state.isLoaded = true;
    },

    createColumn(state: KanbanState, action: PayloadAction<Column>): void {
      const column = action.payload;

      state.columns.byId[column._id] = column;
      state.columns.allIds.push(column._id);
    },
    updateColumn(state: KanbanState, action: PayloadAction<Column>): void {
      const column = action.payload;

      state.columns.byId[column._id] = column;
    },
    clearColumn(state: KanbanState, action: PayloadAction<string>): void {
      const columnId = action.payload;

      // cardIds to be removed
      const { cardIds } = state.columns.byId[columnId];

      // Delete the cardIds references from the column
      state.columns.byId[columnId].cardIds = [];

      // Delete the cards from state
      cardIds.forEach((cardId) => {
        delete state.cards.byId[cardId];
      });

      state.cards.allIds = state.cards.allIds.filter((cardId) =>
        cardIds.includes(cardId)
      );
    },
    deleteColumn(state: KanbanState, action: PayloadAction<string>): void {
      const columnId = action.payload;

      delete state.columns.byId[columnId];
      state.columns.allIds = state.columns.allIds.filter(
        (_listId) => _listId !== columnId
      );
    },
    createCard(state: KanbanState, action: PayloadAction<Card>): void {
      const card = action.payload;

      state.cards.byId[card._id] = card;
      state.cards.allIds.push(card._id);

      // Add the cardId reference to the column
      state.columns.byId[card.columnId].cardIds.push(card._id);
    },

    copyCard(state: KanbanState, action: PayloadAction<Card>): void {
      const card = action.payload;

      // Add the copied card to the state
      state.cards.byId[card._id] = card;
      state.cards.allIds.push(card._id);

      // Add the cardId reference to the column
      state.columns.byId[card.columnId].cardIds.push(card._id);
    },

    updateCard(state: KanbanState, action: PayloadAction<Card>): void {
      const card = action.payload;

      Object.assign(state.cards.byId[card._id], card);
    },
    moveCard(
      state: KanbanState,
      action: PayloadAction<{
        cardId: string;
        position: number;
        columnId?: string;
      }>
    ): void {
      const { cardId, position, columnId } = action.payload;
      const sourceColumnId = state.cards.byId[cardId].columnId;
      console.log(cardId, position, columnId);
      // Remove card from source column
      state.columns.byId[sourceColumnId].cardIds = state.columns.byId[
        sourceColumnId
      ].cardIds.filter((_cardId) => _cardId !== cardId);

      // If columnId exists, it means that we have to add the card to the new column
      if (columnId) {
        // Change card's columnId reference
        state.cards.byId[cardId].columnId = columnId;
        // Push the cardId to the specified position
        state.columns.byId[columnId].cardIds.splice(position, 0, cardId);
      } else {
        // Push the cardId to the specified position
        state.columns.byId[sourceColumnId].cardIds.splice(position, 0, cardId);
      }
    },

    deleteCard(state: KanbanState, action: PayloadAction<string>): void {
      const cardId = action.payload;
      const { columnId } = state.cards.byId[cardId];

      delete state.cards.byId[cardId];
      state.cards.allIds = state.cards.allIds.filter(
        (_cardId) => _cardId !== cardId
      );
      state.columns.byId[columnId].cardIds = state.columns.byId[
        columnId
      ].cardIds.filter((_cardId) => _cardId !== cardId);
    },
    addComment(state: KanbanState, action: PayloadAction<any>): void {
      const { comment } = action.payload;
      const card = state.cards.byId[comment.cardId];

      card.comments.push(comment);
    },

    deleteComment(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; commentId: string }>
    ): void {
      const { cardId, commentId } = action.payload;
      const card = state.cards.byId[cardId];

      card.comments = card.comments.filter(
        (comment) => comment._id !== commentId
      );
    },

    updateComment(
      state: KanbanState,
      action: PayloadAction<{
        cardId: string;
        commentId: string;
        comment: CommentWithReplies;
      }>
    ): void {
      const { cardId, commentId, comment } = action.payload;
      const card = state.cards.byId[cardId];
      const singleComment = card.comments.find(
        (_comment) => _comment._id === commentId
      );

      if (singleComment) {
        singleComment.message = comment.message;
      }
    },

    addChecklist(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklist: Checklist }>
    ): void {
      const { cardId, checklist } = action.payload;
      console.log(cardId, checklist, 'data');
      const card = state.cards.byId[cardId];

      card.checklists.push(checklist);
    },
    updateChecklist(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklist: Checklist }>
    ): void {
      const { cardId, checklist } = action.payload;
      const card = state.cards.byId[cardId];

      card.checklists = card?.checklists?.map((_checklist) => {
        if (_checklist._id === checklist._id) {
          return checklist;
        }

        return _checklist;
      });
    },
    deleteChecklist(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; checklistId: string }>
    ): void {
      const { cardId, checklistId } = action.payload;
      const card = state.cards.byId[cardId];
      card.checklists = card?.checklists?.filter(
        (checklist) => checklist._id !== checklistId
      );
    },
    addCheckItem(
      state: KanbanState,
      action: PayloadAction<{
        cardId: string;
        checklistId: string;
        checkItem: CheckItem;
      }>
    ): void {
      const { cardId, checklistId, checkItem } = action.payload;
      const card = state.cards.byId[cardId];
      const checklist = card.checklists.find(
        (_checklist) => _checklist._id === checklistId
      );

      checklist?.checkItems.push(checkItem);
    },
    updateCheckItem(
      state: KanbanState,
      action: PayloadAction<{
        cardId: string;
        checklistId: string;
        checkItem: CheckItem;
      }>
    ): void {
      const { cardId, checklistId, checkItem } = action.payload;
      const card = state.cards.byId[cardId];
      const checklist = card.checklists.find(
        (_checklist) => _checklist._id === checklistId
      );

      if (checklist) {
        checklist.checkItems = checklist?.checkItems?.map((_checkItem) => {
          if (_checkItem._id === checkItem._id) {
            return checkItem;
          }

          return _checkItem;
        });
      }
    },
    deleteCheckItem(
      state: KanbanState,
      action: PayloadAction<{
        cardId: string;
        checklistId: string;
        checkItemId: string;
      }>
    ): void {
      const { cardId, checklistId, checkItemId } = action.payload;
      const card = state.cards.byId[cardId];
      const checklist = card.checklists.find(
        (_checklist) => _checklist._id === checklistId
      );

      if (checklist) {
        checklist.checkItems = checklist?.checkItems.filter(
          (checkItem) => checkItem._id !== checkItemId
        );
      }
    },

    createLabel(
      state: KanbanState,
      action: PayloadAction<{ data: Label; cardId?: string }>
    ): void {
      const { data, cardId } = action.payload;
      const { _id, name } = data;

      // Add the new label to the state's labels
      state.labels.byId[_id] = { _id, name };
      state.labels.allIds.push(_id);

      // If cardId is provided, add the label ID to the card's labelIds array
      if (cardId) {
        const card = state.cards.byId[cardId];
        if (card) {
          card.labelIds.push(_id);
        }
      }
    },

    deleteLabel(state: KanbanState, action: PayloadAction<string>): void {
      const labelId = action.payload;

      delete state.labels.byId[labelId];
      state.labels.allIds = state.labels.allIds.filter(
        (_labelId) => _labelId !== labelId
      );

      // Remove the label ID from all cards' labelIds arrays
      Object.values(state.cards.byId).forEach((card) => {
        card.labelIds = card.labelIds.filter((id) => id !== labelId);
      });
    },

    addLabelToCard(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; labelId: string }>
    ): void {
      const { cardId, labelId } = action.payload;

      const card = state.cards.byId[cardId];
      if (card) {
        card.labelIds.push(labelId);
      }
    },

    removeLabelFromCard(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; labelId: string }>
    ): void {
      const { cardId, labelId } = action.payload;

      const card = state.cards.byId[cardId];
      if (card) {
        card.labelIds = card.labelIds.filter((id) => id !== labelId);
      }
    },

    createPriority(state: KanbanState, action: PayloadAction<Priority>): void {
      const priority = action.payload;

      state.priority.byId[priority._id] = priority;
      state.priority.allIds.push(priority._id);
    },

    deletePriority(state: KanbanState, action: PayloadAction<Priority>): void {
      const priority = action.payload;

      delete state.priority.byId[priority._id];
      state.priority.allIds = state.priority.allIds.filter(
        (_priorityId) => _priorityId !== priority._id
      );

      // Unassign the priority from all cards
      Object.values(state.cards.byId).forEach((card) => {
        if (card.priority?.toLowerCase() === priority.name.toLowerCase()) {
          card.priority = null;
        }
      });
    },

    assignPriorityToCard(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; priority: string }>
    ): void {
      const { cardId, priority } = action.payload;

      const card = state.cards.byId[cardId];
      if (card) {
        card.priority = priority;
      }
    },

    unassignPriorityFromCard(
      state: KanbanState,
      action: PayloadAction<{ cardId: string }>
    ): void {
      const { cardId } = action.payload;

      const card = state.cards.byId[cardId];
      if (card) {
        card.priority = null;
      }
    },

    addMemberToCard(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; memberId: string }>
    ): void {
      const { cardId, memberId } = action.payload;
      const card = state.cards.byId[cardId];

      if (card) {
        if (!card?.memberIds.includes(memberId)) {
          card?.memberIds.push(memberId);
        }
      }
    },
    removeMemberFromCard(
      state: KanbanState,
      action: PayloadAction<{ cardId: string; memberId: string }>
    ): void {
      const { cardId, memberId } = action.payload;
      const card = state.cards.byId[cardId];

      if (card) {
        card.memberIds = card?.memberIds.filter((id) => id !== memberId);
      }
    },
    filterCards: (state: KanbanState, action: PayloadAction<any>) => {
      const { labelIds, priority, name, memberIds, data } = action.payload;
      const clonedBoard = data;

      const filteredCards = data?.cards?.filter((card: Card) => {
        // Check if the card matches the filter criteria
        const hasMatchingLabels =
          labelIds === undefined ||
          labelIds.some((labelId: string) => card.labelIds.includes(labelId));

        const hasMatchingMembers =
          memberIds === undefined ||
          memberIds.some((memberId: string) =>
            card.memberIds.includes(memberId)
          );

        const hasMatchingPriority =
          priority === undefined ||
          priority.some((cardPriority: string) =>
            card?.priority?.includes(cardPriority)
          );

        const hasMatchingName =
          name === undefined ||
          name.some((cardName: string) =>
            card.name.toLowerCase().includes(cardName.toLowerCase())
          );

        return (
          hasMatchingLabels ||
          hasMatchingMembers ||
          hasMatchingPriority ||
          hasMatchingName
        );
      });

      clonedBoard?.columns.forEach((column: Column) => {
        column.cardIds = filteredCards
          .filter((card: Card) => card.columnId === column._id)
          .map((card: Card) => card._id);
      });

      state.columns.byId = objFromArray(clonedBoard.columns);
      state.columns.allIds = Object.keys(state?.columns.byId);
      state.cards.byId = objFromArray(clonedBoard.cards);
      state.cards.allIds = Object.keys(state.cards.byId);
    },
  },
});

export const { reducer } = slice;

export const getBoard =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.get('/api/boards');
    const { data } = response;
    dispatch(slice.actions.getBoard(data));
  };

export const createColumn =
  (name: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.post('/api/columns', { name });
    const { data } = response;
    dispatch(slice.actions.createColumn(data));
  };

export const updateColumn =
  (columnId: string, update: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.patch(`/api/columns/${columnId}`, {
      columnId,
      update,
    });
    const { data } = response;

    dispatch(slice.actions.updateColumn(data));
  };

export const clearColumn =
  (columnId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    await axios.patch(`/api/columns/${columnId}/clear`);

    dispatch(slice.actions.clearColumn(columnId));
  };

export const deleteColumn =
  (columnId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    await axios.delete(`/api/columns/${columnId}`);

    dispatch(slice.actions.deleteColumn(columnId));
  };

export const createCard =
  (columnId: string, name: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.post('/api/cards', { columnId, name });
    const { data } = response;
    dispatch(slice.actions.createCard(data));
  };
export const copyCard =
  (cardId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.post(`api/cards/${cardId}/copy`);
    const { data } = response;
    dispatch(slice.actions.copyCard(data as any));
  };

export const updateCard =
  (cardId: string, update: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.patch(`/api/cards/${cardId}`, { update });
    const { data } = response;

    dispatch(slice.actions.updateCard(data));
  };

export const moveCard =
  (cardId: string, position: number, columnId?: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(
      slice.actions.moveCard({
        cardId,
        position,
        columnId,
      })
    );

    await axios.patch(`/api/cards/${cardId}/move`, { position, columnId });
  };

export const moveCardToColumn =
  (cardId: string, columnId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    // Dispatch the moveCard action to update the state
    dispatch(
      slice.actions.moveCard({
        cardId,
        position: 0, // Move to the top of the target column
        columnId,
      })
    );
    await axios.patch(`/api/cards/${cardId}/move`, { position: 0, columnId });
  };

export const deleteCard =
  (cardId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    await axios.delete(`/api/cards/${cardId}`);

    dispatch(slice.actions.deleteCard(cardId));
  };

export const addComment =
  (cardId: string, message: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.post('/api/comments', { cardId, message });

    const { data } = response;
    dispatch(slice.actions.addComment(data));
  };

export const deleteComment =
  (cardId: string, commentId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    await axios.delete(`/api/comments/${cardId}/${commentId}`);

    dispatch(slice.actions.deleteComment({ cardId, commentId }));
  };

export const updateComment =
  (cardId: string, commentId: string, update: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.patch(`/api/comments/${cardId}/${commentId}`, {
      update,
    });
    const { data } = response;

    dispatch(
      slice.actions.updateComment({
        cardId,
        commentId,
        comment: data,
      })
    );
  };

export const addChecklist =
  (cardId: string, name: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.post(
      `/api/checklist/cards/${cardId}/checklists`,
      { name }
    );
    const { data } = response;
    console.log(data, 'data from api');
    dispatch(
      slice.actions.addChecklist({
        cardId,
        checklist: data,
      })
    );
  };

export const updateChecklist =
  (cardId: string, checklistId: string, update: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.patch(
      `/api/checklist/cards/${cardId}/checklists/${checklistId}`,
      {
        update,
      }
    );

    const { data } = response;

    dispatch(
      slice.actions.updateChecklist({
        cardId,
        checklist: data,
      })
    );
  };

export const deleteChecklist =
  (cardId: string, checklistId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(
      slice.actions.deleteChecklist({
        cardId,
        checklistId,
      })
    );
    await axios.delete(
      `/api/checklist/cards/${cardId}/checklists/${checklistId}`
    );
  };

export const addCheckItem =
  (cardId: string, checklistId: string, name: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.post(
      `/api/checkitem/cards/${cardId}/checklists/${checklistId}/checkItems`,
      { name }
    );
    const { data } = response;

    dispatch(
      slice.actions.addCheckItem({
        cardId,
        checklistId,
        checkItem: data,
      })
    );
  };

export const updateCheckItem =
  (
    cardId: string,
    checklistId: string,
    checkItemId: string,
    update: any
  ): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.patch(
      `/api/checkitem/cards/${cardId}/checklists/${checklistId}/checkItems/${checkItemId}`,
      {
        update,
      }
    );

    const { data } = response;

    dispatch(
      slice.actions.updateCheckItem({
        cardId,
        checklistId,
        checkItem: data,
      })
    );
  };

export const deleteCheckItem =
  (cardId: string, checklistId: string, checkItemId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(
      slice.actions.deleteCheckItem({
        cardId,
        checklistId,
        checkItemId,
      })
    );
    await axios.delete(
      `/api/checkitem/cards/${cardId}/checklists/${checklistId}/checkItems/${checkItemId}`
    );
  };

export const createLabel =
  (name: string, cardId?: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.post(`/api/labels`, { name, cardId });
    const { data } = response;
    dispatch(slice.actions.createLabel({ data, cardId }));
  };

export const deleteLabel =
  (labelId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.deleteLabel(labelId));

    await axios.delete(`/api/labels/${labelId}`);
  };

export const addLabelToCard =
  (cardId: string, labelId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.addLabelToCard({ cardId, labelId }));

    await axios.post(`/api/labels/cards/${cardId}/labels/${labelId}`);
  };

export const removeLabelFromCard =
  (cardId: string, labelId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.removeLabelFromCard({ cardId, labelId }));
    await axios.delete(`/api/labels/cards/${cardId}/labels/${labelId}`);
  };

export const addMemberToCard =
  (cardId: string, memberId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.addMemberToCard({ cardId, memberId }));
    await axios.post(`/api/members/cards/addMember`, { cardId, memberId });
  };

export const removeMemberFromCard =
  (cardId: string, memberId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.removeMemberFromCard({ cardId, memberId }));
    await axios.post(`/api/members/cards/removeMember`, { cardId, memberId });
  };

export const assignPriority =
  (cardId: string, priority: { _id: string; name: string }): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(
      slice.actions.assignPriorityToCard({ cardId, priority: priority.name })
    );
    await axios.patch(`/api/priority/${cardId}`, { priority: priority.name });
  };

export const unAssignPriority =
  (cardId: string): AppThunk =>
  async (dispatch): Promise<void> => {
    dispatch(slice.actions.unassignPriorityFromCard({ cardId }));
    await axios.delete(`/api/priority/delete/${cardId}`);
  };

export const filterTasks =
  (
    labelIds?: string[],
    memberIds?: string[],
    priority?: string[],
    name?: string[]
  ): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axios.get('/api/boards');
    const { data } = response;
    dispatch(
      slice.actions.filterCards({ labelIds, memberIds, priority, name, data })
    );
  };

export default slice;
