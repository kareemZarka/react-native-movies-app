import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <StatusBar hidden={true} />

                <Stack initialRouteName="splash">
                    <Stack.Screen name="splash" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="scan"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="movie/[id]"
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack>
            </AuthProvider>
        </QueryClientProvider>
    );
}