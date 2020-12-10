import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { AuthState } from '../utils/interfaces';
import { gerarSenha } from '../utils/cryptoSenha';
import { toastError } from '../utils/toastMessage';

interface AuthContextData {
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): void;
  user: AuthState;
  setData: Dispatch<SetStateAction<AuthState | undefined>>;
  isLogged: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>();
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    async function getUserBySessionStorage() {
      setLoading(true);
      const userData = await AsyncStorage.getItem('@notefly:user');
      if (userData) {
        setData(JSON.parse(userData));
        setIsLogged(true);
      }
      setLoading(false);
    }
    getUserBySessionStorage();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<
    void
  > => {
    let userData: AuthState = {
      userEmail: '',
      userAvatar: '',
      userName: '',
      userChats: [],
      userId: '',
    };

    await auth()
      .signInWithEmailAndPassword(email, password)
      .then(async response => {
        const userId = response.user.uid;
        const { _data: dataUser }: any = await firestore()
          .collection('Users')
          .doc(userId)
          .get()
          .catch(error => toastError(error));
        await gerarSenha(password);
        if (!dataUser.userFirstAccess) {
          userData = {
            userEmail: dataUser.userEmail,
            userAvatar: dataUser.userAvatarUrl,
            userFirstName: dataUser.userFirstName,
            userLastName: dataUser.userLastName,
            userName: `${dataUser.userFirstName} ${dataUser.userLastName}`,
            userChats: dataUser.userUserChats,
            userId: dataUser.userId,
            userFirstAccess: false,
          };
        } else {
          userData = {
            userEmail: dataUser.userEmail,
            userAvatar: '',
            userName: '',
            userFirstAccess: true,
            userChats: dataUser.userChats,
            userId,
          };
        }

        await AsyncStorage.setItem('@notefly:user', JSON.stringify(userData));
        setData(userData);
        setIsLogged(true);
      })
      .catch(error => toastError('Email ou senha invalido'));
  }, []);

  const signUp = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        await auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async response => {
            const userId = response.user.uid;

            await firestore()
              .collection('Users')
              .doc(userId)
              .set({
                userEmail: email,
                userFirstAccess: true,
                userId,
                userChats: [],
              })
              .catch(error => toastError(error));

            await signIn(email, password);
          });
      } catch (error) {
        toastError(error);
      }
    },
    [signIn],
  );

  const signOut = useCallback(async () => {
    setIsLogged(false);
    await AsyncStorage.removeItem('@notefly:user');
    await AsyncStorage.removeItem('@notefly:hash');
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        user: data as AuthState,
        isLogged,
        loading,
        setData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthProvider;
