import React, { createContext, useCallback, useContext } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import app from '@react-native-firebase/app';

import uuid from 'uuidv4';

import { array } from 'yup';
import { IChat, GroupUpdateProps } from '../utils/interfaces';
import { toastSuccess, toastError } from '../utils/toastMessage';
import { SelectedOptions } from '../pages/NewGroup/GroupMembers';

interface ChatContextData {
  addGroup(
    groupName: string,
    groupAvatar: string,
    groupMembers: SelectedOptions[],
  ): void;
  addChatUser(userIdRecive: string): Promise<IChat | null>;
  updateGroup({
    chatId,
    chatName,
    chatMembers,
    chatAvatar,
  }: GroupUpdateProps): void;
  removeMemberGroup(memberId: string, chatId: string): void;
  deleteGroup(chatId: string): void;
  addNewMembers(chatId: string, newMembers: SelectedOptions[]): Promise<void>;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

const GroupProvider: React.FC = ({ children }) => {
  const addGroup = useCallback(
    async (groupName, groupAvatar, groupMembers) => {
      const userId = auth().currentUser?.uid;
      const groupId = uuid();
      const arr = [];
      const promise = groupMembers.map(members => arr.push(members.userId));
      await Promise.all(promise);
      arr.push(userId);
      const refAvatar = await storage().ref(`GroupsAvatars/${groupId}Avatar`);
      await refAvatar.putFile(groupAvatar);
      const avatarUrl = await storage()
        .ref(`GroupsAvatars/${groupId}Avatar`)
        .getDownloadURL();

      const group: IChat = {
        chatName: groupName,
        chatMembers: arr,
        chatId: groupId,
        chatAvatarUrl: avatarUrl,
        chatType: 'group',
        chatAdmin: userId as string,
        creatAt: new Date(),
        lastUpdate: new Date(),
        newMessages: 0,
      };

      await firestore().collection('Chats').doc(groupId).set(group);

      arr.map(userId =>
        firestore()
          .collection('Users')
          .doc(userId)
          .update({
            userChats: app.firestore.FieldValue.arrayUnion(group.chatId),
          }),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const addChatUser = useCallback(
    async (userIdRecive: string): Promise<IChat | null> => {
      let chat: IChat = {};
      try {
        const userId = auth().currentUser?.uid;
        const dataCurrentUser = await firestore()
          .collection('Users')
          .doc(userId)
          .get();
        const dataUserChat = await firestore()
          .collection('Users')
          .doc(userIdRecive)
          .get();
        const currentUser = {
          userAvatarUrl: dataCurrentUser.data()?.userAvatarUrl,
          userName: `${dataCurrentUser.data()?.userFirstName} ${
            dataCurrentUser.data()?.userLastName
          }`,
          userEmail: dataCurrentUser.data()?.userEmail,
        };
        const userChat = {
          userAvatarUrl: dataUserChat.data()?.userAvatarUrl,
          userName: `${dataUserChat.data()?.userFirstName} ${
            dataUserChat.data()?.userLastName
          }`,
          userEmail: dataUserChat.data()?.userEmail,
        };
        const chatsInfo = await firestore()
          .collection('Chats')
          .where('chatType', '==', 'chat')
          .where(
            'chatMembers',
            'array-contains',
            dataCurrentUser?.data()?.userId,
          )
          .get();

        const chatExist = chatsInfo.docs.map(conversantion => {
          const exist = conversantion
            .data()
            .chatMembers.filter(
              filter => filter === dataUserChat.data()?.userId,
            );
          if (exist.length > 0) {
            return conversantion.data();
          }
          return {};
        });
        if (Object.keys(chatExist[0]).length === 0) {
          const chatId = uuid();

          const chatObject: IChat = {
            chatId,
            chatType: 'chat',
            creatAt: new Date(),
            lastUpdate: new Date(),
            newMessages: 0,
            chatMembers: [
              dataCurrentUser.data()?.userId,
              dataUserChat.data()?.userId,
            ],
            chatUsers: [currentUser, userChat],
          };

          await firestore().collection('Chats').doc(chatId).set(chatObject);

          await firestore()
            .collection('Users')
            .doc(userId)
            .update({
              userChats: app.firestore.FieldValue.arrayUnion(chatId),
            });
          await firestore()
            .collection('Users')
            .doc(userIdRecive)
            .update({
              userChats: app.firestore.FieldValue.arrayUnion(chatId),
            });
          const userInfo = chatObject.chatUsers?.filter(
            userFilter =>
              userFilter.userEmail !== dataCurrentUser.data()?.userEmail,
          );

          chat = {
            ...chatObject,
            chatAvatarUrl: userInfo[0]?.userAvatarUrl,
            chatName: userInfo[0]?.userName,
          };
        } else {
          const userInfo = chatExist[0].chatUsers?.filter(
            userFilter =>
              userFilter.userEmail !== dataCurrentUser.data()?.userEmail,
          );

          chat = {
            ...chatExist[0],
            chatAvatarUrl: userInfo[0].userAvatarUrl,
            chatName: userInfo[0].userName,
          };
        }
      } catch {
        () =>
          toastError(
            'Erro ao iniciar a conversa por favor tente de novo mais tarde',
          );
      }
      if (Object.keys(chat).length !== 0) {
        return chat;
      }
    },
    [],
  );

  const updateGroup = useCallback(
    async ({
      chatId,
      chatName = null,
      chatMembers = null,
      chatAvatar = null,
    }) => {
      if (chatName) {
        await firestore().collection('Chats').doc(chatId).update({ chatName });
      }
      if (chatMembers) {
        await firestore()
          .collection('Chats')
          .doc(chatId)
          .update({
            chatMembers: app.firestore.FieldValue.arrayUnion(chatMembers),
          });
      }
      if (chatAvatar) {
        const avatarRef = await storage().ref(`GroupsAvatars/${chatId}Avatar`);
        await avatarRef.delete();
        await avatarRef.putFile(chatAvatar);
        const chatAvatarUrl = await storage()
          .ref(`GroupsAvatars/${chatId}Avatar`)
          .getDownloadURL();

        firestore()
          .collection('Chats')
          .doc(chatId)
          .update({
            chatAvatarUrl,
          })
          .then(() => {
            toastSuccess('Avatar atualizado com sucesso');
          })
          .catch(() =>
            toastError(
              'Erro ao atualizar a o avatar, por favor tenta mais tarde',
            ),
          );
      }
    },
    [],
  );

  const removeMemberGroup = useCallback(
    async (memberId: string, chatId: string) => {
      const group = await firestore().collection('Chats').doc(chatId).get();

      const newMembers = group
        .data()
        ?.chatMembers.filter((member: string) => member !== memberId);

      await firestore()
        .collection('Chats')
        .doc(chatId)
        .update({ chatMembers: newMembers });

      const user = await firestore().collection('Users').doc(memberId).get();

      const userChats = user
        .data()
        ?.userChats.filter((chat: string) => chat !== chatId);

      await firestore().collection('Users').doc(memberId).update({ userChats });
    },
    [],
  );

  const deleteGroup = useCallback(async (chatId: string) => {
    let array: string[] = [];
    await firestore().collection('Chats').doc(chatId).delete();
    await firestore().collection('ChatsMessages').doc(chatId).delete();
    await firestore()
      .collection('Users')
      .where('userChats', 'array-contains', chatId)
      .get()
      .then(async response => {
        if (response.docs) {
          const promise = response.docs.map(async user => {
            const chats: string[] = user
              .data()
              .userChats.filter((chatFilter: string) => chatFilter !== chatId);
            array = chats;
            await firestore()
              .collection('Users')
              .doc(user.data().userId)
              .update({ userChats: array });
          });
          await Promise.all(promise);
        }
      });
  }, []);

  const addNewMembers = useCallback(
    async (chatId: string, newMembers: SelectedOptions[]): Promise<void> => {
      const arr = [];
      const promise = newMembers.map(member => arr.push(member.userId));
      await Promise.all(promise);

      await arr.map(userId =>
        firestore()
          .collection('Chats')
          .doc(chatId)
          .update({
            chatMembers: app.firestore.FieldValue.arrayUnion(userId),
          }),
      );

      await arr.map(userId =>
        firestore()
          .collection('Users')
          .doc(userId)
          .update({
            userChats: app.firestore.FieldValue.arrayUnion(chatId),
          }),
      );
    },
    [],
  );
  return (
    <ChatContext.Provider
      value={{
        addGroup,
        addChatUser,
        updateGroup,
        removeMemberGroup,
        deleteGroup,
        addNewMembers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export function useGroup(): ChatContextData {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useGroup must be used within an GroupProvider');
  }

  return context;
}

export default GroupProvider;
