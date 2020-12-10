import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import {
  Container,
  Form,
  ButtonCadastrar,
  TextCadastrar,
  ContainerButtons,
  TextLogin,
  TextTitle,
} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/auth';
import getValidationErros from '../../utils/getValidationErros';
import { Image } from '../../components/Card/styles';

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async data => {
    setLoading(true);
    formRef.current?.setErrors({});
    try {
      const schema = yup.object().shape({
        email: yup
          .string()
          .email()
          .required('Por favor insira um e-mail valido'),
        password: yup
          .string()
          .min(6)
          .required('Por favor insira uma senha valida'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn(data.email, data.password);

      setLoading(false);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
      }
      setLoading(false);
    }
  }, []);

  return (
    <Container>
      <Image
        style={{ width: 100, height: 100 }}
        source={require('../../assets/logo.png')}
      />
      <TextTitle>Notefly</TextTitle>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Input name="email" placeholder="E-mail" />
        <Input name="password" placeholder="Senha" secureTextEntry />
      </Form>
      <ContainerButtons>
        <Button onPress={() => formRef.current?.submitForm()}>
          {loading ? (
            <ActivityIndicator size="large" color="#FFFF" />
          ) : (
            <TextLogin>Entrar</TextLogin>
          )}
        </Button>
        <ButtonCadastrar
          onPress={() => navigation.navigate('RedefinePassword')}
        >
          <TextCadastrar>Esqueceu a senha?</TextCadastrar>
        </ButtonCadastrar>
        <ButtonCadastrar onPress={() => navigation.navigate('SignUp')}>
          <TextCadastrar>Não tem uma conta, cadastre-se já</TextCadastrar>
          <Icon name="log-in" size={20} />
        </ButtonCadastrar>
      </ContainerButtons>
    </Container>
  );
};

export default SignIn;
