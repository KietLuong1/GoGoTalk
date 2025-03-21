import { User as FirebaseUser } from '@firebase/auth';

export interface User {
  uid?: string;
  email: string;
  name: string;
  deletedFromChat?: boolean;
}

export interface Message {
  _id: string;
  createdAt: Date;
  text: string;
  image?: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  sent?: boolean;
  received?: boolean;
}

export interface Chat {
  id: string;
  lastUpdated: number;
  users: User[];
  messages: Message[];
  groupName?: string;
  groupAdmins?: string[];
}

export interface AuthContextType {
  user: FirebaseUser | null;
  setUser: React.Dispatch<React.SetStateAction<FirebaseUser | null>>;
}

export interface UnreadMessagesContextType {
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}
