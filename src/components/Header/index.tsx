import React, { useState } from 'react';
import { Image, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Link, useNavigation } from '@react-navigation/native';
import DefaultGroup from '../../assets/icones/defaultGroup.svg';
import { useAuth } from '../../hooks/auth';
import {
  Container,
  SearchContainer,
  TextInput,
  AvatarContainer,
  NameContainer,
  NameText,
  IconsContainer,
} from './styles';

const Header: React.FC = () => {
  const [search, setSearch] = useState(false);
  const { user } = useAuth();
  const navigation = useNavigation();

  function profileNavigation() {
    navigation.navigate('Profile');
  }

  return (
    <>
      <Container>
        <AvatarContainer>
          {user.userAvatar ? (
            <Image
              source={{
                uri: user.userAvatar,
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
            <NameText>{user.userName}</NameText>
          </NameContainer>
          <IconsContainer>
            <Icon
              name="settings"
              size={20}
              onPress={() => profileNavigation()}
            />
          </IconsContainer>
        </AvatarContainer>
      </Container>
    </>
  );
};

export default Header;
