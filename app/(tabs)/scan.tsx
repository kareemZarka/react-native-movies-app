import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

import { analyzeFaceMetadata } from '@/services/chatgpt';
import type { FaceMetadata } from '@/types/scan';

export default function Scan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [direction, setDirection] = useState('');
  const [captured, setCaptured] = useState<FaceMetadata[]>([]);
  const [analysis, setAnalysis] = useState('');

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const onFacesDetected = ({ faces }: FaceDetector.FacesDetectedEvent) => {
    if (!faces.length) return;
    const face = faces[0] as FaceDetector.FaceFeature;
    const yaw = face.yawAngle ?? 0;
    const pitch = face.pitchAngle ?? 0;
    let dir = 'center';
    if (yaw < -15) dir = 'left';
    else if (yaw > 15) dir = 'right';
    else if (pitch > 10) dir = 'up';
    if (dir !== direction) {
      setDirection(dir);
      setCaptured((prev) => [...prev, { direction: dir, yaw, pitch }]);
    }
  };

  const handleAnalyze = async () => {
    try {
      const result = await analyzeFaceMetadata(captured);
      setAnalysis(result);
    } catch {
      setAnalysis('Analysis failed');
    }
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <Text className="text-light-100 mb-4">Camera permission is required</Text>
        <TouchableOpacity
          className="bg-accent px-4 py-2 rounded-full"
          onPress={requestPermission}
        >
          <Text className="text-secondary font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <CameraView
        className="flex-1"
        facing="front"
        onFacesDetected={onFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
        }}
      />
      <View className="absolute bottom-8 left-0 right-0 items-center">
        <Text className="text-light-100 mb-2">Direction: {direction || 'center'}</Text>
        <TouchableOpacity
          className="bg-accent px-4 py-2 rounded-full"
          onPress={handleAnalyze}
        >
          <Text className="text-secondary font-semibold">Analyze with ChatGPT</Text>
        </TouchableOpacity>
        {analysis ? (
          <View className="mt-4 px-4">
            <Text className="text-light-100 text-center">{analysis}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
