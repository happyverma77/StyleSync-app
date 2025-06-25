import React, { JSX, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ImageSourcePropType,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  Entypo,
  Feather,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import ActionSheetModal from "@/components/ActionSheetModal";
import useAppContext from "@/ContextProvider/AppProvider";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

import CameraUpload from "@/components/CameraUpload";
import { useLang } from "@/utils/LangContext";

type IconComponentName =
  | "Ionicons"
  | "MaterialIcons"
  | "Entypo"
  | "Feather"
  | "MaterialCommunityIcons";

interface CustomButtonProps {
  iconComponent: IconComponentName;
  icon: string;
  text: string;
  onPress?: () => void;
}

export default function FashionClosetScreen(): JSX.Element {
  const { t, lang, switchLanguage } = useLang();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [forFittingRoom, setFittingRoom] = useState<boolean>(true);
  const {
    fittingRoomImage,
    fetchUserDetails,
    setIsLoading,
    fittingRoomCameraImage,
    userData,
  } = useAppContext();
  const [cameraUri, setCameraUri] = useState<string | null>(null);

  const imageUrl: string | ImageSourcePropType =
    userData?.fittingRoomModel || require("../../assets/images/modal.jpg");

  const downloadAndShare = async (): Promise<void> => {
    try {
      setIsLoading(true);

      if (typeof imageUrl !== "string") {
        Alert.alert("Error", "Invalid image URL for sharing.");
        setIsLoading(false);
        return;
      }

      const fileUri = FileSystem.cacheDirectory + "shared-image.jpg";
      const downloaded = await FileSystem.downloadAsync(imageUrl, fileUri);

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Sharing is not available on this device");
        setIsLoading(false);
        return;
      }

      await Sharing.shareAsync(downloaded.uri);
    } catch (error) {
      console.log("Sharing error:", error);
      Alert.alert("Error", "Could not share image");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Left Side Image */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.refreshButton}
          >
            <EvilIcons name="refresh" size={30} color="black" />
          </TouchableOpacity>
          <Image
            source={typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl}
            style={styles.image}
          />
        </View>

        {/* Right Side Options */}
        <View style={styles.menuContainer}>
          <Text style={styles.title}>{t("FittingRoom.title")}</Text>
          <ScrollView contentContainerStyle={styles.buttonList}>
            <CustomButton
              icon="tshirt-crew-outline"
              text={t("FittingRoom.Changing")}
              onPress={() => router.replace("/FittingRoomTryOn")}
              iconComponent="MaterialCommunityIcons"
            />
            <CustomButton
              icon="add-circle-outline"
              text={t("FittingRoom.Add_clothes")}
              iconComponent="Ionicons"
              onPress={() => {
                router.replace({
                  pathname: "/(tabs)/FittingRoomTryOn",
                  params: { actionsheet: "true" },
                });
                // router.replace("/(tabs)/FittingRoomTryOn")
              }}
            />
            <CustomButton
              icon="upload"
              text={t("FittingRoom.Upload")}
              iconComponent="Feather"
              onPress={downloadAndShare}
            />
            <CustomButton
              icon="calendar"
              iconComponent="Feather"
              text={t("FittingRoom.Calendar")}
              onPress={() => router.replace("/CalenderScreen")}
            />
            <CustomButton
              icon="back-in-time"
              iconComponent="Entypo"
              text={t("FittingRoom.Put_on_record")}
              onPress={() => router.replace("/PutOnRecords")}
            />
            <CustomButton
              icon="playlist-check"
              iconComponent="MaterialCommunityIcons"
              text={t("FittingRoom.Saved_Suit")}
              onPress={() => router.replace("/SavedSuits")}
            />
          </ScrollView>
        </View>
      </View>

      <CameraUpload
        modalVisible={modalVisible}
        setCameraUri={setCameraUri}
        forFittingRoom={true}
        setFittingRoom={setFittingRoom}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}

const CustomButton: React.FC<CustomButtonProps> = ({
  iconComponent,
  icon,
  text,
  onPress = () => {},
}) => {
  const components: Record<string, any> = {
    Ionicons,
    MaterialIcons,
    Entypo,
    Feather,
    MaterialCommunityIcons,
  };

  const IconComponent = components[iconComponent];

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {IconComponent && (
        <IconComponent
          name={icon}
          size={20}
          color="#333"
          style={{ marginRight: 10 }}
        />
      )}
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf5",
  },
  innerContainer: {
    flexDirection: "row",
    flex: 1,
    padding: 20,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 50,
    gap: 20,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
  },
  refreshButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "white",

    zIndex: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  menuContainer: {
    flex: 1,
    maxWidth: "40%",
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
  },
  buttonList: {
    gap: 15,
  },
  button: {
    backgroundColor: "#fdebd0",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 50,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
