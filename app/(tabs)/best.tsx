import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, Text, View } from "react-native";

import FootCard from "@/components/FootCard";
import { footHighlights } from "@/constants/feetData";

const Best = () => {
    return (
        <View className="flex-1 bg-primary">
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                <View className="items-center mt-12 mb-6">
                    <Text className="text-5xl font-extrabold text-white">TOP FEET</Text>
                    <View className="flex-row items-center gap-3 mt-2">
                        <Text className="text-3xl">🏆</Text>
                        <Text className="text-text-secondary text-lg">Hall of Fame 🔥</Text>
                        <Text className="text-3xl">🏆</Text>
                    </View>
                </View>

                {footHighlights.map((entry) => (
                    <FootCard key={entry.id} entry={entry} showRank />
                ))}

                <LinearGradient
                    colors={["rgba(255,79,154,0.4)", "rgba(54,241,205,0.12)"]}
                    className="mt-6 p-4 rounded-2xl border border-border"
                >
                    <Text className="text-white font-semibold text-lg text-center">
                        Publish to join the daily best list. Delete anytime.
                    </Text>
                </LinearGradient>
            </ScrollView>
        </View>
    );
};

export default Best;
