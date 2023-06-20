export interface Attachment {
  _id: string;
}

export interface CheckItem {
  _id: string;
  name: string;
  checklistId?: string;
  state: 'incomplete' | 'complete';
}

export interface Label {
  _id: string;
  name: string;
}
export interface Priority {
  _id: string;
  name: string;
}
export interface Checklist {
  _id: string;
  name: string;
  checkItems: CheckItem[];
}

export interface Comment {
  _id: string;
  cardId: string;
  createdAt: number;
  memberId: string;
  message: string;
}

export interface CommentWithReplies extends Comment {
  replies?: Comment[];
}

export interface Card {
  _id: string;
  attachments: Attachment[];
  checklists: Checklist[];
  columnId: string;
  comments: CommentWithReplies[];
  cover: string | null;
  description: string | null;
  due: number | null;
  isSubscribed: boolean;
  memberIds: string[];
  labelIds: string[];
  name: string;
  priority: string | null;
}

export interface Column {
  _id: string;
  name: string;
  cardIds: string[];
}

export interface Member {
  _id: string;
  avatar: string | null;
  name: string;
}

export interface Board {
  cards: Card[];
  columns: Column[];
  members: Member[];
  labels: Label[];
  priority: Priority[];
}
