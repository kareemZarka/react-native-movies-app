import { useState, useCallback, useEffect } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { images } from "@/constants/images";

type Status = {
    type: "" | "error" | "success";
    message: string;
};

const Login = () => {
    const { signIn, signUp, user } = useAuth();
    const router = useRouter();

    const [mode, setMode] = useState<"login" | "register">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<Status>({ type: "", message: "" });

    const authMutation = useMutation({
        mutationFn: async (flow: "login" | "register") => {
            if (flow === "login") {
                await signIn(email, password);
            } else {
                await signUp(email, password, name);
            }
        },
        onSuccess: (_, flow) => {
            if (flow === "register") {
                setStatus({ type: "success", message: "Account created successfully 🎉" });
            }
            router.replace("/");
        },
        onError: (err: any) => {
            const rawMessage = err?.message || "Something went wrong";
            let displayMessage = rawMessage;

            if (err.code === 409) {
                displayMessage = "Account already exists. Please login.";
            } else if (err.code === 401 || rawMessage.toLowerCase().includes("invalid")) {
                displayMessage = "Invalid email or password.";
            }

            setStatus({ type: "error", message: displayMessage });
        },
    });

    useEffect(() => {
        if (status.type === "success") {
            const t = setTimeout(() => setStatus({ type: "", message: "" }), 3000);
            return () => clearTimeout(t);
        }
    }, [status]);

    const setAndSubmit = useCallback(
        (flow: "login" | "register") => {
            setMode(flow);
            setStatus({ type: "", message: "" });
            authMutation.mutate(flow);
        },
        [authMutation]
    );

    const errorLower = status.type === "error" ? status.message.toLowerCase() : "";
    const emailError = errorLower.includes("email");
    const passwordError = errorLower.includes("password");

    if (user) return <Redirect href="/" />;

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <Image source={images.bg} className="absolute w-full h-full opacity-30" resizeMode="cover" />

            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
                <ScrollView
                    className="flex-1 px-5"
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="mt-14 mb-10 items-center">
                        <Text className="text-4xl font-bold text-text-primary">RateMy
                            <Text className="text-neon-pink">Feet</Text>
                        </Text>
                        <Text className="text-4xl font-bold text-text-primary mt-2">🦶🔥</Text>
                        <Text className="text-center text-text-primary text-2xl font-bold mt-6 leading-8">
                            ARE YOUR FEET{"\n"}HOT OR NOT?
                        </Text>
                        <LinearGradient
                            colors={["#36F1CD", "#4A90F7"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="px-4 py-1 rounded-full mt-3"
                        >
                            <Text className="text-black font-bold text-lg">TikTok-ready neon vibes</Text>
                        </LinearGradient>
                    </View>

                    <View className="bg-surface border border-border rounded-3xl p-5 shadow-xl shadow-[#FF4F9A33]">
                        <Text className="text-center text-white text-4xl font-bold mb-2">
                            Join the community 👣🔥
                        </Text>
                        <Text className="text-center text-text-secondary mb-6">
                            Where your feet finally get the attention they deserve.
                        </Text>

                        {mode === "register" && (
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#666"
                                value={name}
                                onChangeText={setName}
                                className="bg-border text-white px-4 py-4 rounded-2xl mb-3"
                            />
                        )}

                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            className={`bg-border text-white px-4 py-4 rounded-2xl mb-3 ${
                                emailError ? "border border-neon-pink" : ""
                            }`}
                        />

                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#666"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            className={`bg-border text-white px-4 py-4 rounded-2xl mb-2 ${
                                passwordError ? "border border-neon-pink" : ""
                            }`}
                        />

                        {status.type === "error" && (
                            <Text className="text-red-400 text-center mb-2">{status.message}</Text>
                        )}
                        {status.type === "success" && (
                            <Text className="text-green-400 text-center mb-2">{status.message}</Text>
                        )}

                        <TouchableOpacity
                            onPress={() => setAndSubmit("register")}
                            disabled={authMutation.isPending}
                            className="rounded-full overflow-hidden mt-2"
                        >
                            <LinearGradient
                                colors={["#FF4F9A", "#4A90F7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="py-4"
                            >
                                {authMutation.isPending && mode === "register" ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text className="text-black text-center font-bold text-lg">Create Account</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setAndSubmit("login")}
                            disabled={authMutation.isPending}
                            className="mt-4 py-4 border border-neon-blue rounded-full"
                        >
                            {authMutation.isPending && mode === "login" ? (
                                <ActivityIndicator color="#4A90F7" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-base">Login</Text>
                            )}
                        </TouchableOpacity>

                        <Text className="text-center text-text-secondary mt-4">No weird stuff. Just vibes.</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
