import { User } from 'react-native-gifted-chat';

export interface AuthState {
  userName?: string;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userAvatar?: string;
  userFirstAccess?: boolean;
  password?: string;
  userChats: IChat[];
  userId: string;
}

export interface UserUpdateProps {
  oldPassword?: string | null;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
}

export interface GroupUpdateProps {
  chatId: string;
  chatName?: string | null;
  chatMembers?: Array<string> | null;
  chatAvatar?: string | null;
}

export interface FirstUpdadeData {
  firstName: string;
  lastName: string;
}

export interface IChat {
  chatName?: string;
  chatMembers?: Array<string>;
  chatId?: string;
  chatAvatarUrl?: string;
  chatType?: 'group' | 'chat';
  chatAdmin?: string | null;
  creatAt?: Date;
  lastMessage?: MessageProps;
  newMessages?: number;
  lastUpdate?: any;
  chatUsers?: Array<any>;
}

export interface MessageProps {
  chatId: string;
  messageContent: string;
  messageId: string | number;
  user: User;
  createdAt: any;
  sent: boolean;
  received: boolean;
  pending: boolean;
}
