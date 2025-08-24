import { useCallback, useRef, useState } from "react";
import { View, Text, Image } from "react-native";
// eslint-disable-next-line import/no-unresolved
import { CameraView, useCameraPermissions, CameraCapturedPicture } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import ScanButton from "@/components/ScanButton";
import { useRouter } from "expo-router";

const Scan = () => {
    const router = useRouter();
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const takePhoto = useCallback(async () => {
        if (!cameraRef.current) return;
        try {
            const result: CameraCapturedPicture = await cameraRef.current.takePictureAsync();
            setPhoto(result.uri);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const onUsePhoto = useCallback(() => {
        setSaving(true);
        // placeholder for any upload or processing
        setTimeout(() => {
            setSaving(false);
            router.back();
        }, 500);
    }, [router]);

    if (!permission) {
        return <View className="flex-1 bg-primary" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 items-center justify-center bg-primary px-5">
                <Text className="text-white text-center mb-4">
                    We need your permission to access the camera
                </Text>
                <ScanButton label="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            {photo ? (
                <Image source={{ uri: photo }} className="flex-1" />
            ) : (
                <CameraView ref={cameraRef} className="flex-1" />
            )}

            {photo ? (
                <View className="absolute bottom-10 left-0 right-0 flex-row px-5 gap-4">
                    <ScanButton
                        label="Retake"
                        variant="outline"
                        onPress={() => setPhoto(null)}
                        className="flex-1"
                    />
                    <ScanButton
                        label={saving ? "Saving..." : "Use"}
                        onPress={onUsePhoto}
                        className="flex-1"
                        disabled={saving}
                    />
                </View>
            ) : (
                <View className="absolute bottom-10 left-0 right-0 items-center">
                    <View className="w-20 h-20 rounded-full items-center justify-center bg-white">
                        <ScanButton
                            label=""
                            onPress={takePhoto}
                            className="w-16 h-16 rounded-full bg-light-100"
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default Scan;
