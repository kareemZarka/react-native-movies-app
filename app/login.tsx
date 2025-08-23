import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

const Login = () => {
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Redirect href="/" />;

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signIn(email, password);
      router.replace('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={icons.logo}
            className="w-12 h-10 mt-20 mb-10 self-center"
          />
          <View className="gap-4 mt-10">
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
              disabled={loading}
              className="bg-secondary py-3 rounded-md"
            >
              {loading ? (
                <ActivityIndicator color="#151312" />
              ) : (
                <Text className="text-primary text-center font-semibold">
                  Login
                </Text>
              )}
            </TouchableOpacity>
            <Link href="/register" className="text-center text-gray-500">
              Create an account
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
