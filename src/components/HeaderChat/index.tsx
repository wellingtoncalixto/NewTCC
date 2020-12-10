import React from 'react';
import { Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DefaultGroup from '../../assets/icones/defaultGroup.svg';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  AvatarContainer,
  NameContainer,
  NameText,
  InfoIcon,
} from './styles';
import { IChat } from '../../utils/interfaces';

interface Props {
  chat: IChat;
}

const HeaderChat: React.FC<Props> = ({ chat }) => {
  const navigation = useNavigation();

  return (
    <Container>
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Icon name="arrow-left" size={20} />
        <AvatarContainer>
          {chat.chatAvatarUrl ? (
            <Image
              source={{
                uri: chat.chatAvatarUrl,
              }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            />
          ) : (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: '#C6C6C6',
              }}
            >
              <DefaultGroup width={60} height={60} />
            </View>
          )}
          <NameContainer>
            <NameText>{chat.chatName}</NameText>
          </NameContainer>
        </AvatarContainer>
      </TouchableOpacity>

      {chat.chatType === 'group' && (
        <InfoIcon>
          <TouchableOpacity
            onPress={() => navigation.navigate('GroupDetails', { chat })}
          >
            <Icon name="information-outline" size={25} />
          </TouchableOpacity>
        </InfoIcon>
      )}
    </Container>
  );
};

export default HeaderChat;
