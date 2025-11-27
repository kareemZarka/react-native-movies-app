import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface FootCardProps {
    entry: FootEntry;
    onPress?: () => void;
    showRank?: boolean;
}

const FootCard = ({ entry, onPress, showRank }: FootCardProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            className="w-full bg-surface border border-border rounded-2xl overflow-hidden mb-4"
        >
            <View className="relative">
                <Image source={{ uri: entry.image }} className="w-full h-44" resizeMode="cover" />
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.85)"]}
                    className="absolute inset-0"
                />
                <View className="absolute left-4 bottom-4">
                    <View className="flex-row items-center gap-2">
                        <View className="bg-black/60 px-3 py-1 rounded-full border border-border">
                            <Text className="text-white font-semibold text-base">{entry.score.toFixed(1)}🔥</Text>
                        </View>
                        {entry.bestLabel ? (
                            <LinearGradient
                                colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="px-3 py-1 rounded-full"
                            >
                                <Text className="text-black font-semibold text-xs uppercase">
                                    {entry.bestLabel}
                                </Text>
                            </LinearGradient>
                        ) : null}
                    </View>
                    <Text className="text-white font-bold text-xl mt-2">{entry.caption}</Text>
                </View>
                {showRank && entry.rank ? (
                    <View className="absolute top-4 left-4">
                        {entry.rank && entry.rank > 3 ? (
                            <View className="px-3 py-1 rounded-full bg-[#111111] border border-border">
                                <Text className="text-white font-bold">#{entry.rank}</Text>
                            </View>
                        ) : (
                            <LinearGradient
                                colors={
                                    entry.rank === 1
                                        ? ["#FFD700", "#FFB347"]
                                        : ["#FF4F9A", "#36F1CD", "#4A90F7"]
                                }
                                className="px-3 py-1 rounded-full"
                            >
                                <Text className="text-black font-bold">#{entry.rank}</Text>
                            </LinearGradient>
                        )}
                    </View>
                ) : null}
            </View>

            <View className="px-4 py-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                    <LinearGradient
                        colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                        className="w-12 h-12 rounded-full items-center justify-center"
                    >
                        <Text className="text-2xl">{entry.avatar}</Text>
                    </LinearGradient>
                    <View>
                        <Text className="text-white font-semibold">{entry.username}</Text>
                        <Text className="text-text-secondary text-xs">{entry.date || "Just now"}</Text>
                    </View>
                </View>
                <View className="bg-black/60 border border-border rounded-full px-3 py-1">
                    <Text className="text-white font-semibold text-sm">Rate again</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default FootCard;
