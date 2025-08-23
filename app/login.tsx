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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

const Login = () => {
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Redirect href="/" />;

  const toggleMode = () => {
    setError('');
    setMode(mode === 'login' ? 'register' : 'login');
  };

  const handleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
        Alert.alert('Success', 'Account created successfully');
      }
      router.replace('/');
    } catch (err: any) {
      const rawMessage = err?.message || 'Something went wrong';
      let displayMessage = rawMessage;
      if (err.code === 409) {
        displayMessage = 'Account already exists. Please login.';
      } else if (
        err.code === 401 ||
        rawMessage.toLowerCase().includes('invalid')
      ) {
        displayMessage = 'Invalid email or password.';
      }
      setError(displayMessage);
      Alert.alert('Error', displayMessage);
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
            {mode === 'register' && (
              <TextInput
                placeholder="Name"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
                className="bg-gray-800 text-white px-4 py-3 rounded-md"
              />
            )}
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
            {error ? (
              <Text className="text-red-500 text-center">{error}</Text>
            ) : null}
            <TouchableOpacity
              onPress={handleAuth}
              disabled={loading}
              className={`py-3 rounded-full shadow-lg ${
                loading ? 'bg-accent/60' : 'bg-accent'
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#030014" />
              ) : (
                <Text className="text-primary text-center font-semibold">
                  {mode === 'login' ? 'Login' : 'Register'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMode} className="mt-2">
              <Text className="text-center text-accent font-semibold">
                {mode === 'login'
                  ? 'Create an account'
                  : 'Already have an account? Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
