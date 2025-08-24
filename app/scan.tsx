import React, { useMemo, useReducer, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from "react-native";
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
    | { type: "GOTO"; pose: Pose }
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
        case "GOTO":
            return { ...state, current: action.pose, phase: Phase.Live, previewUri: null };
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
    const { permissionReady, phase, current, previewUri, photos, sending } = state;

    const allDone = useMemo(() => POSES.every((p) => !!photos[p]), [photos]);
    const showSend = phase === Phase.Completed && !previewUri && allDone;

    if (permission && !permissionReady) dispatch({ type: "PERMISSION_READY" });

    const ensurePermission = useCallback(async () => {
        if (!permission?.granted) {
            const res = await requestPermission();
            if (!res.granted) {
                Alert.alert("Permission required", "Please allow camera to continue.");
            }
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

    const confirm = useCallback(() => {
        dispatch({ type: "CONFIRM" });
    }, []);

    const retake = useCallback(() => {
        dispatch({ type: "RETAKE" });
    }, []);

    const gotoPose = useCallback((pose: Pose) => {
        dispatch({ type: "GOTO", pose });
    }, []);

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
                <TouchableOpacity onPress={ensurePermission} className="bg-secondary px-4 py-2 rounded-full">
                    <Text className="text-primary font-semibold">Grant Permission</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            {previewUri ? (
                <Image source={{ uri: previewUri }} style={{ flex: 1 }} />
            ) : (
                <CameraView ref={cameraRef} facing="front" style={{ flex: 1 }} />
            )}

            <ScrollView
                horizontal
                className="absolute top-4 left-0 px-4"
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16, alignItems: "center" }}
            >
                {POSES.map((pose) => {
                    const uri = photos[pose];
                    const active = pose === current && !previewUri;
                    return (
                        <TouchableOpacity
                            key={pose}
                            onPress={() => uri && gotoPose(pose)}
                            activeOpacity={uri ? 0.8 : 1}
                            style={{ marginRight: 10, alignItems: "center" }}
                            accessibilityRole="button"
                            accessibilityLabel={`Thumbnail ${pose}`}
                        >
                            <View
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 12,
                                    borderWidth: active ? 2 : 1,
                                    borderColor: active ? "#AB8BFF" : "rgba(255,255,255,0.4)",
                                    overflow: "hidden",
                                    backgroundColor: "rgba(255,255,255,0.06)",
                                }}
                            >
                                {uri ? (
                                    <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
                                ) : (
                                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                        <Text className="text-white/70 text-[10px] capitalize">{pose}</Text>
                                    </View>
                                )}
                            </View>
                            <Text className="text-white/70 text-[10px] mt-4 capitalize">{pose}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
                style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 240 }}
            />

            <View
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: insets.bottom + 20,
                    paddingHorizontal: 24,
                    alignItems: "center",
                    gap: 14,
                }}
            >
                {!previewUri ? (
                    <Text className="text-white/90 text-base">{LABEL[current]}</Text>
                ) : (
                    <Text className="text-white/90 text-base">Preview — {LABEL[current]}</Text>
                )}

                {!previewUri ? (
                    <>
                        <TouchableOpacity
                            onPress={capture}
                            activeOpacity={0.9}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 999,
                                backgroundColor: "white",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Capture photo"
                        >
                            <View style={{ width: 64, height: 64, borderRadius: 999, backgroundColor: "#EDEDED" }} />
                        </TouchableOpacity>

                        {showSend && (
                            <TouchableOpacity
                                onPress={send}
                                disabled={sending}
                                style={{
                                    marginTop: 8,
                                    paddingHorizontal: 18,
                                    paddingVertical: 12,
                                    borderRadius: 999,
                                    backgroundColor: "#AB8BFF",
                                    opacity: sending ? 0.7 : 1,
                                }}
                                accessibilityRole="button"
                                accessibilityLabel="Send photos"
                            >
                                {sending ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text className="text-black font-semibold">Send</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </>
                ) : (
                    <View style={{ flexDirection: "row", gap: 16 }}>
                        <TouchableOpacity
                            onPress={retake}
                            className="px-5 py-3 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.14)" }}
                            accessibilityRole="button"
                            accessibilityLabel="Retake photo"
                        >
                            <Text className="text-white font-medium">Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={confirm}
                            className="px-5 py-3 rounded-full"
                            style={{ backgroundColor: "#AB8BFF" }}
                            accessibilityRole="button"
                            accessibilityLabel="Use photo"
                        >
                            <Text className="text-black font-semibold">Use Photo</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
