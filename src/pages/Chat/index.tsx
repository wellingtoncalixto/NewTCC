import React, { useCallback, useEffect, useState } from 'react';
import {
  GiftedChat,
  IMessage,
  Send,
  Bubble,
  SystemMessage,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { StackScreenProps } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '../../hooks/auth';
import { MessageProps } from '../../utils/interfaces';
import { Text } from '../SignIn/styles';
import HeaderChat from '../../components/HeaderChat';
import { colors } from '../../utils/colors';

const Chat: React.FC<StackScreenProps<{}, 'Chat'>> = ({ route }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const navigation = useNavigation();
  const { user } = useAuth();
  const { chat } = route.params;
  useEffect(() => {
    navigation.setOptions({
      header: () => <HeaderChat chat={chat} />,
    });
  }, [chat]);

  useEffect(() => {
    firestore()
      .collection('ChatsMessages')
      .doc(chat.chatId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .limit(12)
      .onSnapshot(doc => {
        const receivedMessages: Array<any> = [];
        if (doc) {
          doc.docs.map(doc => {
            receivedMessages.push({
              _id: doc.data().messageId,
              text: doc.data().messageContent,
              createdAt: doc.data().createdAt.toDate(),
              pending: doc.data().pending,
              received: doc.data().received,
              sent: doc.data().sent,
              user: doc.data().user,
            });
          });
        }
        setMessages(GiftedChat.append(messages, receivedMessages));
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.chatId]);

  const onSendMessage = useCallback(async ([message]: IMessage[]) => {
    const newMessage: MessageProps = {
      chatId: chat.chatId,
      messageContent: message.text,
      messageId: message._id,
      user: message.user,
      createdAt: new Date(),
      sent: false,
      received: false,
      pending: true,
    };

    await firestore()
      .collection('ChatsMessages')
      .doc(chat.chatId)
      .collection('Messages')
      .doc(newMessage.messageId as string)
      .set(newMessage)
      .then(async () => {
        await firestore()
          .collection('ChatsMessages')
          .doc(chat.chatId)
          .collection('Messages')
          .doc(newMessage.messageId as string)
          .update({ sent: true, pending: false });
      });
    await firestore()
      .collection('Chats')
      .doc(chat.chatId)
      .update({ lastUpdate: new Date(), lastMessage: newMessage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 10;
    return (
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y
    );
  }

  async function loadMoreMessage() {
    const ultimo = messages[messages.length - 1];
    setLoadMore(true);
    await firestore()
      .collection('ChatsMessages')
      .doc(chat.chatId)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .startAfter(ultimo.createdAt)
      .limit(12)
      .onSnapshot(doc => {
        const receivedMessages: Array<any> = [];
        if (doc) {
          if (doc.docs) {
            doc.docs.map(doc => {
              receivedMessages.push({
                _id: doc.data().messageId,
                text: doc.data().messageContent,
                createdAt: doc.data().createdAt.toDate(),
                pending: doc.data().pending,
                received: doc.data().received,
                sent: doc.data().sent,
                user: doc.data().user,
              });
            });
          }
        }
        setMessages(prev => GiftedChat.append(receivedMessages, prev));
      });
    setLoadMore(false);
  }

  function renderLoading() {
    return (
      <View>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  function renderSend(props: any) {
    return (
      <Send {...props}>
        <TouchableOpacity style={{ top: -5, marginRight: 15, width: 30 }}>
          <Icon name="send-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View>
        <Icon name="chevron-double-down" size={36} color="#000" />
      </View>
    );
  }

  function renderSystemMessage(props: any) {
    return (
      <SystemMessage currentMessage={() => <Text>be vindo</Text>} {...props} />
    );
  }

  function renderBubble(props: any) {
    return (
      <>
        <Bubble
          {...props}
          renderUsername={<Text>{props.currentMessage.user.name}</Text>}
          renderUsernameOnMessage
          wrapperStyle={{
            right: {
              backgroundColor: colors.secondary,
            },
          }}
          textStyle={{
            right: {
              color: '#fff',
            },
          }}
        />
      </>
    );
  }

  return (
    <>
      <GiftedChat
        messages={messages}
        onSend={async (message: any) => {
          onSendMessage(message);
        }}
        user={{
          _id: auth().currentUser?.uid as string,
          name: user.userName,
        }}
        renderUsernameOnMessage
        infiniteScroll
        alwaysShowSend
        scrollToBottom
        renderBubble={renderBubble}
        renderLoading={renderLoading}
        renderSend={renderSend}
        scrollToBottomComponent={scrollToBottomComponent}
        renderSystemMessage={renderSystemMessage}
        isLoadingEarlier={loadMore}
        loadEarlier={loadMore}
        renderLoadEarlier={renderLoading}
        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: async ({ nativeEvent }) => {
            if (loadMore === false) {
              if (isCloseToTop(nativeEvent)) {
                loadMoreMessage();
              }
            }
          },
        }}
      />
    </>
  );
};

export default Chat;
