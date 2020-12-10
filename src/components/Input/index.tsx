import React, { useEffect, useRef } from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';
import {
  Container,
  Label,
  InputContainer,
  TextInput,
  ErrorText,
} from './styles';

interface Props extends TextInputProps {
  name: string;
  label?: string;
  defaultValue?: string;
}

interface InputValueReference {
  value: string;
}
const Input: React.FC<Props> = ({ name, label, defaultValue, ...rest }) => {
  const inputElementRef = useRef<any>(null);
  const { fieldName, registerField, error } = useField(name);
  const inputValueRef = useRef<InputValueReference>({
    value: defaultValue as string,
  });

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);
  return (
    <Container>
      <Label error={!!error}>{label && label}</Label>
      <InputContainer error={!!error}>
        <TextInput
          ref={inputElementRef}
          keyboardAppearance="dark"
          placeholderTextColor="#666360"
          defaultValue={defaultValue}
          onChangeText={value => {
            inputValueRef.current.value = value;
          }}
          {...rest}
        />
      </InputContainer>
      {!!error && <ErrorText>{error}</ErrorText>}
    </Container>
  );
};

export default Input;
