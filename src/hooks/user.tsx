import React, { createContext, useCallback, useContext } from 'react';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import AsyncStorage from '@react-native-community/async-storage';
import { useAuth } from './auth';
import { AuthState, UserUpdateProps } from '../utils/interfaces';
import { toastSuccess, toastError } from '../utils/toastMessage';
import { sha512, decrypted } from '../utils/cryptoSenha';

interface UserContextData {
  updateUser({
    oldPassword,
    password,
    firstName,
    lastName,
    avatar,
  }: UserUpdateProps): void;
  firstUpdate({ avatar, firstName, lastName }: UserUpdateProps): void;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

const UserProvider: React.FC = ({ children }) => {
  const { user, setData } = useAuth();
  const firstUpdate = useCallback(
    async ({ avatar, firstName, lastName }: UserUpdateProps) => {
      const { currentUser } = auth();
      const userId = currentUser?.uid;
      let avatarUrl = '';
      if (avatar !== null) {
        const reference = storage().ref(`UsersAvatars/${userId}Avatar`);
        await reference.putFile(avatar as string);
        avatarUrl = await storage()
          .ref(`UsersAvatars/${userId}Avatar`)
          .getDownloadURL();
        await firestore().collection('Users').doc(userId).update({
          userAvatarUrl: avatarUrl,
        });
      }
      if (firstName) {
        await firestore().collection('Users').doc(userId).update({
          userFirstName: firstName,
        });
      }
      if (lastName) {
        await firestore().collection('Users').doc(userId).update({
          userLastName: lastName,
        });
      }
      await firestore().collection('Users').doc(userId).update({
        userFirstAccess: false,
      });

      const userData: AuthState = {
        ...user,
        userFirstAccess: false,
        userAvatar: avatarUrl,
        userFirstName: firstName as string,
        userLastName: lastName as string,
        userName: `${firstName} ${lastName}`,
      };

      setData(userData);

      await AsyncStorage.setItem('@notefly:user', JSON.stringify(userData));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const updateUser = useCallback(
    async ({
      oldPassword = null,
      password = null,
      firstName = null,
      lastName = null,
      avatar = null,
    }: UserUpdateProps) => {
      const userId = auth().currentUser?.uid;
      if (oldPassword && password) {
        const correct: any = await decrypted(oldPassword);
        if (!correct) {
          return toastError('Senha Incorreta');
        }
        auth()
          .currentUser?.updatePassword(password)
          .then(() => {
            toastSuccess('Senha atualizada com sucesso');
          })
          .catch(() => {
            toastError('Erro ao atualizar a senha, por favor tenta mais tarde');
          });
      }
      if (avatar) {
        const avatarRef = await storage().ref(`UsersAvatars/${userId}Avatar`);
        await avatarRef.delete();
        await avatarRef.putFile(avatar);
        const userAvatarUrl = await storage()
          .ref(`UsersAvatars/${userId}Avatar`)
          .getDownloadURL();

        firestore()
          .collection('Users')
          .doc(userId)
          .update({
            userAvatarUrl,
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
      if (firstName && lastName) {
        return firestore().collection('Users').doc(userId).update({
          userFirstName: firstName,
          userLastName: lastName,
        });
      }
      if (firstName) {
        return firestore().collection('Users').doc(userId).update({
          userFirstName: firstName,
        });
      }
      if (lastName) {
        return firestore().collection('Users').doc(userId).update({
          userLastName: lastName,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <UserContext.Provider
      value={{
        updateUser,
        firstUpdate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser(): UserContextData {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useAuth must be used within an UserProvider');
  }

  return context;
}

export default UserProvider;
