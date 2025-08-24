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
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";

enum Pose {
    Left = "left",
    Right = "right",
    Straight = "straight",
}
const POSES: Pose[] = [Pose.Left, Pose.Right, Pose.Straight];
const LABEL: Record<Pose, string> = {
    [Pose.Left]: "Look left",
    [Pose.Right]: "Look right",
    [Pose.Straight]: "Look straight",
};

type Photos = Record<Pose, string | null>;

enum Phase {
    Live = "live",
    Preview = "preview",
    Completed = "completed",
}

type State = {
    permissionReady: boolean;
    phase: Phase;
    current: Pose;
    previewUri: string | null;
    photos: Photos;
    sending: boolean;
};

type Action =
    | { type: "PERMISSION_READY" }
    | { type: "CAPTURED"; uri: string }
    | { type: "RETAKE" }
    | { type: "CONFIRM" }
    | { type: "SEND_START" }
    | { type: "SEND_SUCCESS" }
    | { type: "SEND_FAIL" };

const initialState: State = {
    permissionReady: false,
    phase: Phase.Live,
    current: Pose.Left,
    previewUri: null,
    photos: { left: null, right: null, straight: null },
    sending: false,
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "PERMISSION_READY":
            return { ...state, permissionReady: true };
        case "CAPTURED":
            return { ...state, phase: Phase.Preview, previewUri: action.uri };
        case "RETAKE":
            return { ...state, phase: Phase.Live, previewUri: null };
        case "CONFIRM": {
            const updated: Photos = { ...state.photos, [state.current]: state.previewUri };
            const idx = POSES.indexOf(state.current);
            const hasNext = idx < POSES.length - 1;
            const nextPose = hasNext ? POSES[idx + 1] : state.current;
            const allDone = POSES.every((p) => !!updated[p]);
            return {
                ...state,
                photos: updated,
                phase: allDone ? Phase.Completed : Phase.Live,
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

async function appendBlob(form: FormData, name: string, uri: string) {
    const blob = await (await fetch(uri)).blob();
    form.append(name, blob, `${name}.jpg`);
}

async function uploadFaces(photos: Photos) {
    const form = new FormData();
    for (const pose of POSES) {
        const uri = photos[pose];
        if (!uri) throw new Error(`Missing photo for ${pose}`);
        await appendBlob(form, pose, uri);
    }
    const res = await fetch("https://example.com/api/upload-faces", {
        method: "POST",
        body: form,
    });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
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
        if (phase !== Phase.Preview) return;
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
            <SafeAreaView
                style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}
            >
                <TouchableOpacity
                    onPress={ensurePermission}
                    style={{ backgroundColor: "#AB8BFF", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 }}
                >
                    <Text style={{ color: "#000", fontWeight: "700" }}>Grant Permission</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const instruction =
        phase === Phase.Preview
            ? `Preview — ${LABEL[current]}`
            : phase === Phase.Completed
                ? "All set — Ready to send"
                : LABEL[current];

    const onPrimaryPress = () => {
        if (phase === Phase.Live) return capture();
        if (phase === Phase.Completed) return send();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
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
                <View style={{ width: `${progress}%`, height: "100%", backgroundColor: "#AB8BFF" }} />
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
                    <Text style={{ color: "#fff", opacity: 0.9, fontSize: 16, fontWeight: "600" }}>{instruction}</Text>
                </View>
            </View>

            {/* Controls */}
            {phase === Phase.Preview ? (
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
                    <TouchableOpacity
                        onPress={retake}
                        activeOpacity={0.85}
                        accessibilityRole="button"
                        accessibilityLabel="Retake photo"
                        style={{
                            width: 120,                 // compact
                            height: 48,                 // smaller height
                            borderRadius: 999,
                            borderWidth: 1,
                            borderColor: "rgba(255,255,255,0.6)",
                            backgroundColor: "rgba(0,0,0,0.35)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "700" }}>Retake</Text>
                    </TouchableOpacity>

                    {/* Use: fills remaining space */}
                    <TouchableOpacity
                        onPress={confirm}
                        activeOpacity={0.9}
                        accessibilityRole="button"
                        accessibilityLabel="Use this photo"
                        style={{
                            flex: 1,                    // fills the rest
                            height: 48,
                            borderRadius: 999,
                            backgroundColor: "#AB8BFF",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#000", fontWeight: "700" }}>Use</Text>
                    </TouchableOpacity>
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
                            phase === Phase.Live
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
                            backgroundColor: phase === Phase.Live ? "#FFFFFF" : "#AB8BFF",
                        }}
                    >
                        {phase === Phase.Live && (
                            <View style={{ width: 68, height: 68, borderRadius: 999, backgroundColor: "#EDEDED" }} />
                        )}
                        {phase === Phase.Completed &&
                            (sending ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={{ color: "#000", fontWeight: "700" }}>Send</Text>
                            ))}
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}
