import React, {
    useMemo,
    useReducer,
    useRef,
    useCallback,
    useEffect,
} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    BackHandler,
    StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera"; // eslint-disable-line import/no-unresolved
import { LinearGradient } from "expo-linear-gradient"; // eslint-disable-line import/no-unresolved
import Button from "@/components/Button";
import { LABEL, POSES, uploadFaces } from "@/services/scan";

const initialState: State = {
    permissionReady: false,
    phase: "live",
    current: "left",
    previewUri: null,
    photos: { left: null, right: null, straight: null },
    sending: false,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "PERMISSION_READY":
            return { ...state, permissionReady: true };
        case "CAPTURED":
            return { ...state, phase: "preview", previewUri: action.uri };
        case "RETAKE":
            return { ...state, phase: "live", previewUri: null };
        case "CONFIRM": {
            const updated: Photos = { ...state.photos, [state.current]: state.previewUri };
            const idx = POSES.indexOf(state.current);
            const hasNext = idx < POSES.length - 1;
            const nextPose = hasNext ? POSES[idx + 1] : state.current;
            const allDone = POSES.every((p) => !!updated[p]);
            return {
                ...state,
                photos: updated,
                phase: allDone ? "completed" : "live",
                current: allDone ? state.current : nextPose,
                previewUri: null,
            };
        }
        case "SEND_START":
            return { ...state, sending: true };
        case "SEND_SUCCESS":
        case "SEND_FAIL":
            return { ...state, sending: false };
        default:
            return state;
    }
}

export default function Scan() {
    const cameraRef = useRef<any>(null);
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { phase, current, previewUri, photos, sending } = state;

    // Request permission on mount
    useEffect(() => {
        (async () => {
            if (!permission?.granted) await requestPermission();
        })();
    }, [permission?.granted, requestPermission]);

    // Mark permission ready when object exists
    useEffect(() => {
        if (permission) dispatch({ type: "PERMISSION_READY" });
    }, [permission]);

    // Android back = Retake while in Preview
    useEffect(() => {
        if (phase !== "preview") return;
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            dispatch({ type: "RETAKE" });
            return true;
        });
        return () => sub.remove();
    }, [phase]);

    const progress = useMemo(
        () => (POSES.filter((p) => photos[p]).length / POSES.length) * 100,
        [photos]
    );

    const ensurePermission = useCallback(async () => {
        if (!permission?.granted) {
            const res = await requestPermission();
            if (!res.granted) Alert.alert("Permission required", "Please allow camera to continue.");
        }
    }, [permission, requestPermission]);

    const capture = useCallback(async () => {
        try {
            if (!cameraRef.current) return;
            const shot =
                cameraRef.current.takePictureAsync?.({ quality: 0.85, skipProcessing: true }) ??
                cameraRef.current.takePhotoAsync?.({ quality: 0.85, skipProcessing: true });
            const result = await shot;
            const uri = result?.uri;
            if (!uri) throw new Error("No URI returned by camera.");
            dispatch({ type: "CAPTURED", uri });
        } catch (e: any) {
            Alert.alert("Camera error", e?.message ?? "Failed to take photo.");
        }
    }, []);

    const confirm = useCallback(() => dispatch({ type: "CONFIRM" }), []);
    const retake = useCallback(() => dispatch({ type: "RETAKE" }), []);

    const send = useCallback(async () => {
        try {
            dispatch({ type: "SEND_START" });
            await uploadFaces(photos);
            Alert.alert("Success", "Photos sent successfully.");
            dispatch({ type: "SEND_SUCCESS" });
        } catch (e: any) {
            Alert.alert("Upload error", e?.message ?? "Could not send photos.");
            dispatch({ type: "SEND_FAIL" });
        }
    }, [photos]);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <SafeAreaView className="flex-1 bg-primary justify-center items-center">
                <Button
                    label="Grant Permission"
                    onPress={ensurePermission}
                    className="text-light-100 px-4 py-2"
                    textClassName="text-primary"
                />
            </SafeAreaView>
        );
    }

    const instruction =
        phase === "preview"
            ? `Preview — ${LABEL[current]}`
            : phase === "completed"
                ? "All set — Ready to send"
                : LABEL[current];

    const onPrimaryPress = () => {
        if (phase === "live") return capture();
        if (phase === "completed") return send();
    };

    return (
        <SafeAreaView className="flex-1 bg-primary">
            {/* Camera or Preview Image */}
            {previewUri ? (
                <Image source={{ uri: previewUri }} style={StyleSheet.absoluteFillObject} />
            ) : (
                <CameraView ref={cameraRef} facing="front" style={{ flex: 1 }} />
            )}

            {/* Bottom gradient */}
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 240 }}
                pointerEvents="none"
            />

            {/* Progress bar */}
            <View
                style={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    bottom: insets.bottom + 128,
                    height: 4,
                    borderRadius: 999,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                }}
                pointerEvents="none"
            >
                <View style={{ width: `${progress}%` }} className="h-full bg-accent" />
            </View>

            {/* Instruction pill */}
            <View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: insets.bottom + 160,
                    alignItems: "center",
                }}
                pointerEvents="box-none"
            >
                <View
                    style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.12)",
                    }}
                >
                    <Text className="text-light-100 opacity-90 text-base font-semibold">{instruction}</Text>
                </View>
            </View>

            {/* Controls */}
            {phase === "preview" ? (
                // Compact Retake + wide Use
                <View
                    style={{
                        position: "absolute",
                        left: 16,
                        right: 16,
                        bottom: insets.bottom + 24,
                        flexDirection: "row",
                        gap: 12,
                    }}
                    pointerEvents="box-none"
                >
                    {/* Retake: compact pill */}
                    <Button
                        label="Retake"
                        onPress={retake}
                        accessibilityLabel="Retake photo"
                        className="w-[120px] h-12 border border-light-100/60 bg-dark-200/35"
                        textClassName="text-light-100"
                    />

                    {/* Use: fills remaining space */}
                    <Button
                        label="Use"
                        onPress={confirm}
                        accessibilityLabel="Use this photo"
                        className="flex-1 h-12 bg-accent"
                        textClassName="text-primary"
                    />
                </View>
            ) : (
                // Single primary button for Live (Capture) and Completed (Send)
                <View
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: insets.bottom + 24,
                        alignItems: "center",
                    }}
                    pointerEvents="box-none"
                >
                    <TouchableOpacity
                        onPress={onPrimaryPress}
                        activeOpacity={0.9}
                        accessibilityRole="button"
                        accessibilityLabel={
                            phase === "live"
                                ? "Capture photo"
                                : sending
                                    ? "Sending"
                                    : "Send photos"
                        }
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: 999,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: phase === "live" ? "#FFFFFF" : "#AB8BFF",
                        }}
                    >
                        {phase === "live" && (
                            <View style={{ width: 68, height: 68, borderRadius: 999, backgroundColor: "#EDEDED" }} />
                        )}
                        {phase === "completed" &&
                            (sending ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text className="text-primary font-bold">Send</Text>
                            ))}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
