import { Tabs, Redirect } from "expo-router";
import { Text, View } from "react-native";

import { useAuth } from "@/contexts/AuthContext";

const EmojiTab = ({ focused, emoji }: { focused: boolean; emoji: string }) => (
    <View className="items-center justify-center flex-1">
        <Text className={`text-2xl ${focused ? "text-neon-blue" : "text-white"}`}>{emoji}</Text>
    </View>
);

export default function TabsLayout() {
    const { user } = useAuth();

    if (!user) return <Redirect href="/login" />;

    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#000000",
                    borderRadius: 28,
                    marginHorizontal: 20,
                    marginBottom: 24,
                    height: 70,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#1F1F1F",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <EmojiTab focused={focused} emoji="🏠" />,
                }}
            />

            <Tabs.Screen
                name="best"
                options={{
                    title: "Best Feet",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <EmojiTab focused={focused} emoji="⭐" />,
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <EmojiTab focused={focused} emoji="🔍" />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <EmojiTab focused={focused} emoji="👤" />,
                }}
            />
        </Tabs>
    );
}
