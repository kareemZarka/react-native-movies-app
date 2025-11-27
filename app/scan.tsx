import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { footHighlights } from "@/constants/feetData";

const scanningCopy = [
    "EVALUATING MOISTURIZATION LEVEL…",
    "CHECKING IF NAILS ARE LEGAL…",
];

const Scan = () => {
    const [stage, setStage] = useState<"choose" | "scanning" | "result">("choose");
    const [progress] = useState(new Animated.Value(0));
    const confetti = useMemo(() => [...Array(12)].map(() => new Animated.Value(0)), []);
    const heroFoot = useMemo(() => footHighlights[0], []);

    useEffect(() => {
        if (stage === "scanning") {
            progress.setValue(0);
            Animated.timing(progress, {
                toValue: 1,
                duration: 2500,
                useNativeDriver: false,
            }).start(() => setStage("result"));
        }
    }, [stage, progress]);

    useEffect(() => {
        confetti.forEach((value, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(value, {
                        toValue: 1,
                        duration: 3200 + index * 50,
                        useNativeDriver: true,
                    }),
                    Animated.timing(value, {
                        toValue: 0,
                        duration: 3200 + index * 50,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, [confetti]);

    const startScan = () => {
        setStage("scanning");
    };

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <SafeAreaView className="flex-1 bg-primary">
            {stage === "result" ? (
                <View className="absolute inset-0">
                    <ImageBackground
                        source={{ uri: heroFoot.image }}
                        className="flex-1"
                        imageStyle={{ opacity: 0.3, blurRadius: 26 }}
                    >
                        <LinearGradient
                            colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.95)"]}
                            className="absolute inset-0"
                        />
                        <LinearGradient
                            colors={["transparent", "rgba(0,0,0,0.85)", "transparent"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="absolute inset-0"
                        />
                    </ImageBackground>
                    {confetti.map((value, i) => (
                        <Animated.View
                            key={i}
                            className="absolute w-3 h-3 rounded-full"
                            style={{
                                top: `${(i * 17) % 100}%`,
                                left: `${(i * 31) % 100}%`,
                                transform: [
                                    {
                                        translateY: value.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -10],
                                        }),
                                    },
                                    {
                                        translateX: value.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 6],
                                        }),
                                    },
                                ],
                                backgroundColor: ["#FF4F9A", "#36F1CD", "#4A90F7"][i % 3],
                                opacity: 0.6,
                            }}
                        />
                    ))}
                </View>
            ) : null}

            <View className="flex-1 px-5 pb-12 pt-10">
                {stage === "choose" && (
                    <View className="items-center gap-8 flex-1 justify-center">
                        <Text className="text-white text-4xl font-extrabold text-center">READY TO RATE</Text>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            className="w-[70%] rounded-full overflow-hidden shadow-2xl shadow-[#FF4F9A66]"
                            onPress={startScan}
                            style={{ height: 60 }}
                        >
                            <LinearGradient
                                colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="flex-1 flex-row items-center justify-center gap-3"
                            >
                                <Ionicons name="camera" size={24} color="#FFFFFF" />
                                <Text className="text-white font-bold text-lg">TAKE PHOTO</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            className="w-[70%] rounded-full overflow-hidden shadow-2xl shadow-[#4A90F766]"
                            onPress={startScan}
                            style={{ height: 60 }}
                        >
                            <LinearGradient
                                colors={["#FF4F9A", "#36F1CD", "#4A90F7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="flex-1 flex-row items-center justify-center gap-3"
                            >
                                <Ionicons name="image" size={24} color="#FFFFFF" />
                                <Text className="text-white font-bold text-lg">UPLOAD FROM GALLERY</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text className="text-text-secondary text-center">No socks. No cheating. 😭</Text>
                    </View>
                )}

                {stage === "scanning" && (
                    <View className="flex-1 items-center justify-center gap-8">
                        <Text className="text-neon-pink text-5xl font-extrabold text-center leading-tight">
                            SCANNING
                            {"\n"}
                            YOUR TOES…
                        </Text>
                        <View className="gap-3">
                            {scanningCopy.map((line) => (
                                <Text key={line} className="text-white text-xl font-semibold text-center">
                                    {line}
                                </Text>
                            ))}
                        </View>
                        <View className="w-[70%] h-2.5 bg-border rounded-full overflow-hidden">
                            <Animated.View style={{ width: progressWidth }} className="h-full">
                                <LinearGradient
                                    colors={["#36F1CD", "#FF4F9A"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="flex-1"
                                />
                            </Animated.View>
                        </View>
                        <Text className="text-text-secondary">JUDGING.. PLEASE HOLD.</Text>
                    </View>
                )}

                {stage === "result" && (
                    <View className="flex-1">
                        <View className="items-center mt-6">
                            <Text className="text-neon-pink text-7xl font-extrabold drop-shadow-lg">7.4🔥</Text>
                            <Text className="text-white text-xl font-semibold mt-2 text-center">
                                Certified toe-model energy 💅🔥
                            </Text>
                        </View>

                        <View className="mt-10 gap-4 items-center">
                            <TouchableOpacity activeOpacity={0.9} className="w-full rounded-full overflow-hidden">
                                <LinearGradient
                                    colors={["#36F1CD", "#4A90F7"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="h-16 items-center justify-center"
                                >
                                    <Text className="text-black font-bold text-lg">PUBLISH</Text>
                                    <Text className="text-black/70 text-xs mt-1">Profile history + Daily Best/Worst</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                className="w-full rounded-full border border-white/40 py-4 bg-black/40"
                            >
                                <Text className="text-white font-bold text-lg">SHARE</Text>
                                <Text className="text-text-secondary text-xs mt-1">Come rate your feet 😉🔥</Text>
                            </TouchableOpacity>

                            <View className="flex-row gap-5 mt-1">
                                <View className="w-12 h-12 rounded-full border border-white/40 items-center justify-center bg-black/50">
                                    <Ionicons name="logo-instagram" size={22} color="#FFFFFF" />
                                </View>
                                <View className="w-12 h-12 rounded-full border border-white/40 items-center justify-center bg-black/50">
                                    <Ionicons name="logo-tiktok" size={22} color="#FFFFFF" />
                                </View>
                                <View className="w-12 h-12 rounded-full border border-white/40 items-center justify-center bg-black/50">
                                    <Ionicons name="share-outline" size={22} color="#FFFFFF" />
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => setStage("choose")}>
                                <Text className="text-text-secondary">SKIP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Scan;
