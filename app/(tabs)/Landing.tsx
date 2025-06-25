import React, { JSX, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";

import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
import CameraUpload from "@/components/CameraUpload";
import useAppContext from "@/ContextProvider/AppProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Landing = (): JSX.Element => {
  const [cameraUri, setCameraUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [forFittingRoom, setFittingRoom] = useState<boolean>(false);

  const [userData, setUserData] = useState<any>({});
  const defaultImage: ImageSourcePropType = require("../../assets/images/defaultIMG.png");

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await fetch(
        "https://stylesyncchanging.app/api/v1/user/details",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data?.metadata?.success) {
        setUserData(data.responseData);
      } else {
        console.log("Failed to fetch user data:", data.metadata.message);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const getImageSource = (): ImageSourcePropType | { uri: string } => {
    // if (cameraUri) return { uri: cameraUri };
    if (userData?.homeModel) return { uri: userData.homeModel };
    return defaultImage;
  };
  console.log(modalVisible);

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <View style={styles.container}>
        <ImageBackground
          source={getImageSource()}
          style={styles.image}
          imageStyle={styles.imageRounded}
        >
          <Pressable
            style={styles.topRightIcon}
            onPress={() => {
              setFittingRoom(false);
              setModalVisible(true);
            }}
          >
            <Ionicons name="sync" size={20} color="black" />
          </Pressable>
          <View style={styles.bottomCenter}>
            <TouchableOpacity
              onPress={() => {
                setFittingRoom(true);
                setModalVisible(true);
              }}
              style={styles.cameraButton}
            >
              <Ionicons name="camera" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {modalVisible && (
          <CameraUpload
            modalVisible={modalVisible}
            setCameraUri={setCameraUri}
            forFittingRoom={forFittingRoom}
            fetchUserDetails1={fetchUserDetails}
            setFittingRoom={setFittingRoom}
            setModalVisible={setModalVisible}
          />
        )}
      </View>
    </SafeAreaProviderCustom>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "white",
  },
  image: {
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 16,
    overflow: "hidden",
  },
  imageRounded: {
    borderRadius: 16,
  },
  topRightIcon: {
    borderColor: "black",
    borderWidth: 1,
    position: "absolute",
    fontWeight: "900",
    top: 40,
    backgroundColor: "white",
    right: 20,
    borderRadius: 50,
    padding: 5,
    zIndex: 1,
  },
  bottomCenter: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    zIndex: 1,
  },
  cameraButton: {
    backgroundColor: "#D67D2A",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});
