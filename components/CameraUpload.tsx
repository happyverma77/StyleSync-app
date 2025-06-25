import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import useAppContext from "@/ContextProvider/AppProvider";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendUrl } from "@/utils/api";
interface UploadImageProps {
  uri: string;
  name?: string;
  type?: string;
}
export default function CameraUpload({
  modalVisible,
  setModalVisible,
  setCameraUri,
  fetchUserDetails1 = undefined,
  forFittingRoom,
  setFittingRoom,
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const {
    setIsFullScreen,
    setFittingRoomCameraImage,
    cameraOpen,
    setCameraOpen,
    fetchUserDetails,
    fetchWardrobes,
  } = useAppContext();

  const [cameraType, setCameraType] = useState<CameraType>("back");
  const cameraRef = useRef(null);

  const handleTakePhoto = () => {
    setIsFullScreen(true);
    setCameraOpen(true);
    // setModalVisible(false);
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      if (forFittingRoom) {
        setFittingRoomCameraImage(result.assets[0].uri);
        await uploadImage(result.assets[0], "fittingroom");
        await fetchWardrobes();
      } else {
        setCameraUri(result.assets[0]);
        uploadImage(result.assets[0], "homemodel");
      }

      setFittingRoom(false);
      setModalVisible(false);
      setCameraOpen(false);
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo1 = await cameraRef.current.takePictureAsync();
      // const photo = await cameraRef.current.takePictureAsync();

      // Compress only — no resizing
      const photo = await ImageManipulator.manipulateAsync(
        photo1.uri,
        [], // No resize
        {
          compress: 0.6, // Compression level (0 = max compression, 1 = no compression)
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      setCameraOpen(false);
      setModalVisible(false);
      if (forFittingRoom) {
        setFittingRoomCameraImage(photo);
        await uploadImage(photo, "fittingroom");
        await fetchWardrobes();
      } else {
        setCameraUri(photo);
        uploadImage(photo, "homemodel");
      }
      setCameraOpen(false);
    }
  };

  const uploadImage = async (
    image: UploadImageProps,
    type: "homemodel" | "fittingroom"
  ): Promise<void> => {
    if (!image || !image.uri) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    const uri = image.uri;
    const fileName = uri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(fileName);
    const ext = match?.[1]?.toLowerCase() || "jpg";
    const mimeType = `image/${ext}`;

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: mimeType,
    } as any); // React Native requires `as any` for file objects

    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.put(
        `https://stylesyncchanging.app/api/v1/user/image/${type}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      fetchUserDetails?.();
      if (fetchUserDetails1) {
        fetchUserDetails1();
      }
    } catch (error: any) {
      console.error("Upload error:", error.response.data);
    }
  };

  // const uploadImage = async (image, type) => {

  //   if (!image) return;

  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     if (!token) throw new Error("No token found");
  //     const base64 = await FileSystem.readAsStringAsync(image, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  //     // const formData = new FormData();
  //     // formData.append("image", image);

  //     // const imgRes = await fetch(image.uri);
  //     // const blob = await imgRes.blob();
  //     // formData.append("fittingroom", blob, { name: filename, type } as any);

  //     const response = await axios.put(
  //       `https://stylesyncchanging.app/api/v1/user/image/${type}`, // Replace with your local IP
  //       {
  //         image: `data:image/jpeg;base64,${base64}`,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     fetchUserDetails();
  //   } catch (error) {
  //     console.log("Upload Failed:", error);
  //     Alert.alert("Upload Failed", error.message);
  //   }
  // };

  const handleFlip = () => {
    setCameraType((prev) => (prev === "back" ? "front" : "back"));
  };

  // if (!permission) return <View />;
  // if (!permission?.granted) {
  //   Alert.alert(
  //     "Camera Access Required",
  //     "Camera access is required for clicking photos to upload for try-on and other features. Do you want to allow access to the camera?",
  //     [
  //       {
  //         text: "Cancel",
  //         style: "cancel",
  //         onPress: () => setModalVisible(false),
  //       },
  //       {
  //         text: "Allow",
  //         onPress: async () => {
  //           requestPermission();
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );
  //   return;
  // }

  return (
    <>
      {/* Modal with options */}
      {!cameraOpen && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Button title="Take Photo" onPress={handleTakePhoto} />
              <View style={{ height: 10 }} />
              <Button title="Upload from Files" onPress={handleImagePick} />
              <View style={{ height: 10 }} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Camera View */}
      {cameraOpen && (
        <View style={styles.cameraWrapper}>
          <CameraView ref={cameraRef} style={styles.camera} facing={cameraType}>
            <View style={styles.controls}>
              <TouchableOpacity onPress={handleFlip} style={styles.controlBtn}>
                <Text style={styles.controlText}>
                  <Ionicons
                    color={"black"}
                    name="sync-circle"
                    size={25}
                  ></Ionicons>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCapture}
                style={styles.controlBtn}
              >
                <Text style={styles.controlText}>
                  <Entypo name="camera" color={"black"} size={25}></Entypo>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setFittingRoom(false);
                  setCameraOpen(false);
                  setIsFullScreen(false);
                }}
                style={styles.controlBtn}
              >
                <Text style={styles.controlText}>
                  <Entypo
                    color={"black"}
                    name="circle-with-cross"
                    size={25}
                  ></Entypo>
                </Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 20,
    borderRadius: 10,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cameraWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    flex: 1,
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
  controlText: {
    // fontSize: 24,
  },
});
