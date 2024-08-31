import { AuthContext } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { useContext } from 'react';

export default function Index() {
  const { isLoggedIn, userToken } = useContext(AuthContext);

  return (
    <>
      {isLoggedIn !== null ? (
        <Redirect href={'/(page)/home'} />
      ) : (
        <Redirect href={'/(auth)/sign-in'} />
      )}
    </>
  );
}
