import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (user) return <Redirect href="/" />;

  const handleLogin = async () => {
    await signIn(email, password);
    router.replace('/');
  };

  return (
    <SafeAreaView className="bg-primary flex-1 px-10 justify-center">
      <View className="gap-4">
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="bg-gray-800 text-white px-4 py-3 rounded-md"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-gray-800 text-white px-4 py-3 rounded-md"
        />
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-secondary py-3 rounded-md"
        >
          <Text className="text-primary text-center font-semibold">Login</Text>
        </TouchableOpacity>
        <Link href="/register" className="text-center text-gray-500">
          Create an account
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default Login;
