import auth from '@react-native-firebase/auth';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { IChat, MessageProps } from './interfaces';

async function getChatData(chat: string) {
  const userId = auth().currentUser?.uid;
  let group: IChat = {} as IChat;
  const data: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> = await firestore()
    .collection('Chats')
    .doc(chat)
    .get();

  if (!data.data()) {
    return null;
  }
  await firestore()
    .collection('ChatsMessages')
    .doc(data.data()?.chatId)
    .collection('Messages')
    .limit(25)
    .get()
    .then(responseMessage => {
      const messages: MessageProps[] = [];
      responseMessage.docs.map(doc => {
        messages.push({
          chatId: doc.data().chatId,
          messageContent: doc.data().messageContent,
          messageId: doc.data().messageId,
          user: doc.data().user,
          createdAt: doc.data().createdAt.toDate(),
          sent: doc.data().sent,
          received: doc.data().received,
          pending: doc.data().pending,
        });
      });
      let newMessages = 0;
      messages.map((message: MessageProps) => {
        if (message.received === false && message.user._id !== userId) {
          newMessages++;
        }
      });
      group = {
        chatId: data.data()?.chatId,
        chatAvatarUrl: data.data()?.chatAvatarUrl,
        chatMembers: data.data()?.chatMembers,
        chatName: data.data()?.chatName,
        chatType: data.data()?.chatType,
        creatAt: data.data()?.creatAt.toDate(),
        chatAdmin: data.data()?.chatAdmin,
        messages,
        lastMessage: data.data()?.lastMessage,
        newMessages,
        lastUpdate: data.data()?.lastUpdate.toDate(),
      };
    });
  return group;
}

async function getUserChats(): Promise<IChat[]> {
  const userId = auth().currentUser?.uid;
  const userChatsResponse: IChat[] = [];
  const userData = await firestore().collection('Users').doc(userId).get();

  if (userData.data()?.userChats.length === 0) {
    return [];
  }

  const promise = userData.data()?.userChats.map(async (chat: string) => {
    const group = await getChatData(chat);
    group !== null && userChatsResponse.push(group as IChat);
  });

  await Promise.all(promise);
  userChatsResponse.sort((a, b) => {
    return b.lastUpdate - a.lastUpdate;
  });
  return userChatsResponse;
}

export default getUserChats;
