import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { Redirect, useRouter } from "expo-router";

import { useAuth } from "@/contexts/AuthContext";

const Splash = () => {
    const { user } = useAuth();
    const router = useRouter();

    if (user) return <Redirect href="/" />;

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <View className="flex-1 items-center justify-between px-6 pb-16 pt-14">
                <View className="items-center w-full" style={{ marginTop: "20%" }}>
                    <Text className="text-6xl font-extrabold text-neon-pink leading-tight text-center">RateMy</Text>
                    <Text className="text-6xl font-extrabold text-text-primary text-center">Feet</Text>
                    <Text className="text-5xl mt-1">🦶</Text>
                    <View className="mt-6">
                        <MaskedView
                            maskElement={
                                <Text className="text-2xl font-extrabold text-center leading-8">
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
                                <Text className="text-transparent text-2xl font-extrabold text-center leading-8">
                                    ARE YOUR FEET
                                    {"\n"}
                                    HOT OR NOT?
                                </Text>
                            </LinearGradient>
                        </MaskedView>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.replace("/login")}
                    className="w-[70%] h-[60px] rounded-full items-center justify-center"
                    style={{ shadowColor: "#FF4F9A", shadowOpacity: 0.7, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}
                >
                    <View className="w-full h-full rounded-full" style={{ backgroundColor: "#FF4F9A" }}>
                        <View className="flex-1 items-center justify-center">
                            <Text className="text-white font-bold text-xl">CONTINUE</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Splash;
