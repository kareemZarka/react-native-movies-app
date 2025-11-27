import { LinearGradient } from "expo-linear-gradient";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

import FootCard from "@/components/FootCard";
import { footHighlights, recentRatings } from "@/constants/feetData";

const Index = () => {
    const router = useRouter();
    const diameter = Math.min(Dimensions.get("window").width * 0.7, 340);
    const inner = diameter * 0.78;

    return (
        <View className="flex-1 bg-primary">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center mt-14 mb-10">
                    <Text className="text-white text-4xl font-extrabold leading-tight text-center">
                        SHOW ME{"\n"}THEM DOGS 😂
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push("/scan")}
                    className="items-center justify-center"
                >
                    <LinearGradient
                        colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: diameter, height: diameter }}
                        className="rounded-full items-center justify-center shadow-[0_0_35px_rgba(255,79,154,0.6)]"
                    >
                        <View
                            className="rounded-full bg-primary items-center justify-center border border-border"
                            style={{ width: inner, height: inner }}
                        >
                            <Text className="text-white font-extrabold text-4xl text-center leading-tight">
                                RATE{"\n"}MY{"\n"}FEET
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                <Text className="text-text-secondary text-center mt-4">AI will be brutally honest.</Text>

                <View className="mt-10">
                    <Text className="text-white text-lg font-bold mb-4">Best feet (24h)</Text>
                    {footHighlights.map((entry) => (
                        <FootCard key={entry.id} entry={entry} showRank />
                    ))}
                </View>

                <View className="mt-8">
                    <Text className="text-white text-lg font-bold mb-4">Recent heat</Text>
                    {recentRatings.map((entry) => (
                        <FootCard key={entry.id} entry={entry} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Index;
