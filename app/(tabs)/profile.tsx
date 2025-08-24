import { icons } from "@/constants/icons";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect, useRouter } from "expo-router";

const Profile = () => {
    const { user, logOut } = useAuth();
    const router = useRouter();

    if (!user) return <Redirect href="/login" />;

    return (
        <SafeAreaView className="bg-primary flex-1 px-10">
            <View className="flex justify-center items-center flex-1 flex-col gap-5">
                <Image source={icons.person} className="size-10" tintColor="#fff" />
                <Text className="text-gray-100 text-xl font-semibold">
                    {user.name}
                </Text>
                <Text className="text-gray-500">{user.email}</Text>

                <TouchableOpacity
                    className="bg-secondary px-5 py-2 rounded-md"
                    onPress={() => router.push("/scan")}
                >
                    <Text className="text-primary font-semibold">Scan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-secondary px-5 py-2 rounded-md mt-4"
                    onPress={logOut}
                >
                    <Text className="text-primary font-semibold">Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Profile;