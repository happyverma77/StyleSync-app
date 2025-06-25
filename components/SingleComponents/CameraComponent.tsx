import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { CameraView, CameraType } from "expo-camera";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
export default function CameraComponent({ visible, setImageUri, onClose }) {
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const cameraRef = useRef(null);

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Flip the camera from back to front or vice versa
/*******  9ae9d127-8923-48f9-b6c4-37e4a739e10f  *******/
  const handleFlip = () => {
    setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo1 = await cameraRef.current.takePictureAsync();
      const photo = await ImageManipulator.manipulateAsync(
        photo1.uri,
        [], // No resize
        {
          compress: 0.6, // Compression level (0 = max compression, 1 = no compression)
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setImageUri(photo);
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.cameraWrapper}>
      <CameraView ref={cameraRef} style={styles.camera} facing={cameraType}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={handleFlip} style={styles.controlBtn}>
            <Ionicons color={"black"} name="sync-circle" size={25} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture} style={styles.controlBtn}>
            <Entypo color={"black"} name="camera" size={25} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onClose(false)}
            style={styles.controlBtn}
          >
            <Entypo color={"black"} name="circle-with-cross" size={25} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  controlBtn: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 40,
  },
});
