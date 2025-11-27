import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/contexts/AuthContext";

const Splash = () => {
    const { user } = useAuth();
    const router = useRouter();

    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroTranslate = useRef(new Animated.Value(20)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const ctaScale = useRef(new Animated.Value(0.9)).current;
    const ctaOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(heroOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(heroTranslate, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]),
            Animated.timing(subtitleOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(ctaOpacity, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
                Animated.timing(ctaScale, { toValue: 1, duration: 400, delay: 200, useNativeDriver: true }),
            ]),
        ]).start();
    }, [ctaOpacity, ctaScale, heroOpacity, heroTranslate, subtitleOpacity]);

    if (user) return <Redirect href="/" />;

    return (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 items-center justify-center px-6">
                <Animated.View
                    style={{ opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }}
                    className="items-center w-full space-y-5"
                >
                    <View className="items-center">
                        <Text className="text-6xl font-extrabold leading-tight">
                            <Text style={{ color: "#FF4F9A" }}>RateMy</Text>
                            <Text className="text-white"> Feet</Text>
                        </Text>
                        <Text className="text-5xl mt-2">🦶</Text>
                    </View>

                    <Animated.View style={{ opacity: subtitleOpacity }}>
                        <MaskedView
                            maskElement={
                                <Text className="text-2xl font-extrabold text-center tracking-wide">
                                    ARE YOUR FEET
                                    {"\n"}
                                    HOT OR NOT?
                                </Text>
                            }
                        >
                            <LinearGradient
                                colors={["#36F1CD", "#4A90F7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text className="text-transparent text-2xl font-extrabold text-center tracking-wide">
                                    ARE YOUR FEET
                                    {"\n"}
                                    HOT OR NOT?
                                </Text>
                            </LinearGradient>
                        </MaskedView>
                    </Animated.View>
                </Animated.View>

                <Animated.View style={{ opacity: ctaOpacity, transform: [{ scale: ctaScale }] }} className="w-full items-center mt-12">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.replace("/login")}
                        className="w-[70%] h-[60px] rounded-full items-center justify-center"
                        style={{ shadowColor: "#FF4F9A", shadowOpacity: 0.7, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}
                    >
                        <View className="w-full h-full rounded-full" style={{ backgroundColor: "#FF4F9A" }}>
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-white font-bold text-xl tracking-wide">CONTINUE</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default Splash;
