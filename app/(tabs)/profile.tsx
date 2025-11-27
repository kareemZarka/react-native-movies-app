import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect, useRouter } from "expo-router";

import FootCard from "@/components/FootCard";
import { profileHistory } from "@/constants/feetData";

const Profile = () => {
    const { user, logOut } = useAuth();
    const router = useRouter();

    if (!user) return <Redirect href="/login" />;

    const bestScore = profileHistory.reduce((max, item) => Math.max(max, item.score), 0);
    const latestCaption = profileHistory[0]?.caption ?? "Certified toe-model energy";

    return (
        <SafeAreaView className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }}>
                <View className="items-center mt-6">
                    <LinearGradient
                        colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                        className="w-28 h-28 rounded-full items-center justify-center"
                    >
                        <Text className="text-4xl">👣</Text>
                    </LinearGradient>
                    <Text className="text-white text-2xl font-bold mt-4">{user.name}</Text>
                    <Text className="text-text-secondary">@{user.email?.split("@")[0]}</Text>
                </View>

                <View className="bg-surface border border-border rounded-3xl p-5 mt-8 shadow-lg shadow-[#FF4F9A33]">
                    <Text className="text-white text-xl font-bold">Best score</Text>
                    <Text className="text-neon-pink text-5xl font-extrabold mt-3">{bestScore.toFixed(1)}</Text>
                    <LinearGradient
                        colors={["#36F1CD", "#4A90F7"]}
                        className="px-3 py-2 rounded-full mt-3 self-start"
                    >
                        <Text className="text-black font-semibold">{latestCaption}</Text>
                    </LinearGradient>
                </View>

                <View className="mt-8 gap-4">
                    <Text className="text-white text-xl font-bold">Feet analyzed</Text>
                    {profileHistory.map((entry) => (
                        <FootCard key={entry.id} entry={entry} />
                    ))}
                </View>

                <View className="mt-6 gap-4">
                    <Text className="text-white text-xl font-bold">Unlock profiles</Text>
                    <ImageBackground
                        source={{ uri: profileHistory[1]?.image }}
                        className="rounded-3xl overflow-hidden"
                        imageStyle={{ opacity: 0.25 }}
                    >
                        <View className="p-6 bg-black/60">
                            <Text className="text-white text-lg font-semibold mb-2">🔒 Locked History</Text>
                            <Text className="text-text-secondary mb-4">
                                Blur lifted after a one-time €1.99 unlock.
                            </Text>
                            <TouchableOpacity activeOpacity={0.9} className="rounded-full overflow-hidden">
                                <LinearGradient
                                    colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="py-3 px-6"
                                >
                                    <Text className="text-black font-bold text-center">UNLOCK FULL PROFILE (€1.99)</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                <TouchableOpacity onPress={logOut} className="mt-6 py-4 bg-surface border border-border rounded-2xl">
                    <Text className="text-white text-center font-semibold">Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/scan")} className="mt-3 py-4 bg-surface border border-border rounded-2xl">
                    <Text className="text-white text-center font-semibold">Rate new feet</Text>
                </TouchableOpacity>

                <Text className="text-center text-[#FF6B6B] mt-6">Delete my data</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
