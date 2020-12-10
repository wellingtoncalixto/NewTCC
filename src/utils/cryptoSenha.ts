import crypto from 'react-native-simple-crypto';
import AsyncStorage from '@react-native-community/async-storage';

const toHex = crypto.utils.convertArrayBufferToHex;
const toUtf8 = crypto.utils.convertArrayBufferToUtf8;

export async function gerarSenha(senha: string): Promise<void> {
  const keyArrayBuffer = await crypto.utils.randomBytes(32);
  const ivArrayBuffer = await crypto.utils.randomBytes(16);
  const messageArrayBuffer = await crypto.utils.convertUtf8ToArrayBuffer(senha);

  const hash = await crypto.AES.encrypt(
    messageArrayBuffer,
    keyArrayBuffer,
    ivArrayBuffer,
  );
  const hashPassword = {
    hash: toHex(hash),
    keyArrayBuffer: toHex(keyArrayBuffer),
    ivArrayBuffer: toHex(ivArrayBuffer),
  };
  await AsyncStorage.setItem('@notefly:hash', JSON.stringify(hashPassword));
}

export async function decrypted(senha: string): Promise<boolean> {
  const hash = JSON.parse(
    (await AsyncStorage.getItem('@notefly:hash')) as string,
  );
  const key = await crypto.utils.convertHexToArrayBuffer(hash.keyArrayBuffer);
  const iv = await crypto.utils.convertHexToArrayBuffer(hash.ivArrayBuffer);
  const hasp = await crypto.utils.convertHexToArrayBuffer(hash.hash);
  const decryptedArrayBuffer = await crypto.AES.decrypt(hasp, key, iv);

  if (toUtf8(decryptedArrayBuffer) !== senha) {
    return false;
  }
  return true;
}
