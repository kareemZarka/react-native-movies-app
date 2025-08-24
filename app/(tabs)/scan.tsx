import { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraType } from "expo-camera";

const instructions = ["Look left", "Look right"];

export default function Scan() {
    const cameraRef = useRef<Camera>(null);
    const [step, setStep] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <SafeAreaView className="bg-primary flex-1 justify-center items-center">
                <TouchableOpacity onPress={requestPermission} className="bg-secondary px-4 py-2 rounded-full">
                    <Text className="text-primary font-semibold">Grant Permission</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const capturePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            setPhotos((prev) => [...prev, photo.uri]);
            setStep((prev) => prev + 1);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <Camera ref={cameraRef} type={CameraType.front} className="flex-1" />

            <View className="absolute bottom-8 w-full items-center">
                {step < instructions.length && (
                    <Text className="text-secondary text-base mb-4">
                        {instructions[step]}
                    </Text>
                )}
                <TouchableOpacity
                    onPress={capturePhoto}
                    className="w-16 h-16 rounded-full bg-secondary justify-center items-center"
                >
                    <View className="w-12 h-12 rounded-full bg-primary" />
                </TouchableOpacity>
            </View>

            {photos.length > 0 && (
                <ScrollView
                    horizontal
                    className="absolute top-8 left-0 px-4"
                    showsHorizontalScrollIndicator={false}
                >
                    {photos.map((uri) => (
                        <Image
                            key={uri}
                            source={{ uri }}
                            className="w-16 h-16 rounded-lg mr-2"
                        />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
