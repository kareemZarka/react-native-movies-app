import { useMemo, useState } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import SearchBar from "@/components/SearchBar";
import type { FootEntry } from "@/constants/feetData";
import { footHighlights, recentRatings } from "@/constants/feetData";

const allEntries = [...footHighlights, ...recentRatings];

const Search = () => {
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        if (!query.trim()) return [] as FootEntry[];
        return allEntries.filter((entry) =>
            `${entry.username} ${entry.caption}`.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    return (
        <View className="flex-1 bg-primary px-5">
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        className="flex-row items-center justify-between bg-surface border border-border rounded-2xl px-4 py-3 mb-3"
                    >
                        <View className="flex-row items-center gap-3">
                            <LinearGradient
                                colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                                className="w-12 h-12 rounded-full items-center justify-center"
                            >
                                <Text className="text-2xl">{item.avatar}</Text>
                            </LinearGradient>
                            <View>
                                <Text className="text-white font-semibold text-base">{item.username}</Text>
                                <Text className="text-text-secondary text-xs">Best score</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-neon-pink font-bold text-lg">{item.score.toFixed(1)}</Text>
                            <Ionicons name="chevron-forward" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingTop: 80, paddingBottom: 140 }}
                ListHeaderComponent={
                    <View className="gap-4">
                        <Text className="text-center text-white text-3xl font-bold mt-6">Search</Text>
                        <SearchBar
                            placeholder="Search users…"
                            value={query}
                            onChangeText={setQuery}
                        />
                        {!query.trim() && (
                            <Text className="text-text-secondary text-center">
                                Find the hottest toes on RateMyFeet.
                            </Text>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    query.trim() ? (
                        <Text className="text-center text-text-secondary mt-10">No feet found. Try a new vibe.</Text>
                    ) : null
                }
            />
        </View>
    );
};

export default Search;
