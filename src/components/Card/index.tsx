import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { MessageProps, IChat } from '../../utils/interfaces';
import {
  Container,
  Image,
  Content,
  TextNameGroup,
  TextLastMessage,
  NumberOfMessages,
  NumberOfMessagesText,
} from './styles';
import DefaultGroup from '../../assets/icones/defaultGroup.svg';
import { useAuth } from '../../hooks/auth';

interface Props {
  chat: IChat;
}

const Card: React.FC<Props> = ({ chat }) => {
  const navigation = useNavigation();
  const [chatInfo, setChatInfo] = useState<IChat>({} as IChat);
  const { user } = useAuth();
  useEffect(() => {
    if (chat.chatType === 'chat') {
      const userInfo = chat.chatUsers?.filter(
        userFilter => userFilter.userEmail !== user.userEmail,
      );

      const chatNewInfo: IChat = {
        ...chat,
        chatAvatarUrl: userInfo[0].userAvatarUrl,
        chatName: userInfo[0].userName,
      };
      setChatInfo(chatNewInfo);
    }
  }, [chat]);

  return (
    <>
      {chat.chatType === 'group' ? (
        <Container onPress={() => navigation.navigate('Chat', { chat })}>
          {chat.chatAvatarUrl !== undefined ? (
            <Image source={{ uri: chat.chatAvatarUrl }} />
          ) : (
            <DefaultGroup width={60} height={60} />
          )}

          <Content>
            <TextNameGroup>{chat.chatName}</TextNameGroup>
            <TextLastMessage numberOfLines={1} new={false}>
              {chat.lastMessage?.messageContent}
            </TextLastMessage>
          </Content>
          {chat.newMessages !== 0 && (
            <NumberOfMessages>
              <NumberOfMessagesText>{chat.newMessages}</NumberOfMessagesText>
            </NumberOfMessages>
          )}
        </Container>
      ) : (
        <Container
          onPress={() => navigation.navigate('Chat', { chat: chatInfo })}
        >
          {chatInfo.chatAvatarUrl !== undefined ? (
            <Image source={{ uri: chatInfo.chatAvatarUrl }} />
          ) : (
            <DefaultGroup width={60} height={60} />
          )}

          <Content>
            <TextNameGroup>{chatInfo.chatName}</TextNameGroup>
            <TextLastMessage numberOfLines={1} new={false}>
              {chatInfo.lastMessage?.messageContent}
            </TextLastMessage>
          </Content>
          {chatInfo.newMessages !== 0 && (
            <NumberOfMessages>
              <NumberOfMessagesText>
                {chatInfo.newMessages}
              </NumberOfMessagesText>
            </NumberOfMessages>
          )}
        </Container>
      )}
    </>
  );
};

export default Card;
