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
            <View className="flex-1 items-center justify-between px-6 pb-16 pt-10">
                <View className="items-center w-full" style={{ marginTop: "20%" }}>
                    <Text className="text-5xl font-extrabold text-neon-pink leading-tight text-center">RateMy</Text>
                    <Text className="text-5xl font-extrabold text-text-primary text-center">Feet🦶</Text>
                    <View className="mt-4">
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
                    className="w-[70%] rounded-full overflow-hidden shadow-2xl shadow-[#FF4F9A80]"
                    style={{ height: 60 }}
                >
                    <LinearGradient
                        colors={["#FF4F9A", "#FF4F9A", "#36F1CD", "#4A90F7"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="flex-1 items-center justify-center"
                    >
                        <Text className="text-white font-bold text-xl">CONTINUE</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Splash;
