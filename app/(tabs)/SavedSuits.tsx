import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as FileSystem from "expo-file-system";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import ActionSheetFilter from "@/components/ActionSheetFilter";
import ActionButton from "@/components/ActionButton";
import FileUpload from "@/components/SingleComponents/FileUpload";
import CameraComponent from "@/components/SingleComponents/CameraComponent";
import { backendUrl } from "@/utils/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppContext from "@/ContextProvider/AppProvider";
import { usePathname } from "expo-router";

interface Suit {
  _id: string;
  image: string;
}

interface UploadImageProps {
  uri: string;
  name?: string;
  type?: string;
}

const SavedSuits: React.FC = () => {
  const actionSheetRef = useRef<any>(null);
  const path = usePathname();
  const [is3x3, setIs3x3] = useState<boolean>(false);
  const [savedSuitsData, setSavedSuitsData] = useState<Suit[]>([]);
  const { setIsLoading, topBarSelected, setsavedSuitCount } = useAppContext();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [seletedTags, setSelectedTags] = useState([]);
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);

  const openActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const reverseData = () => {
    setSavedSuitsData((prevData) => [...prevData].reverse());
  };

  const handleActionButton = (type: string) => {
    if (type === "Camera") {
      setVisible(true);
    } else {
      setIsFileUpload(true);
    }
  };

  const handleImageUploadCamera = async (image: UploadImageProps) => {
    if (!image) return;
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
      if (!token) throw new Error("No token found");

      // const base64 = await FileSystem.readAsStringAsync(image, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });

      const response = await axios.put(
        `${backendUrl}/api/v1/user/image/savedsuits`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      fetchSavedSuits();
    } catch (error) {
      console.log("Upload Failed:", error);
      Alert.alert("Upload Failed", error.message);
    }
  };
  const handleImageUploadFile = async (images: { uri: string }[]) => {
    if (!images || images.length === 0) return;
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      setIsLoading(true);

      for (const [index, image] of images.entries()) {
        const uri = image.uri;
        const fileName = uri.split("/").pop() || `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(fileName);
        const ext = match?.[1]?.toLowerCase() || "jpg";
        const mimeType = `image/${ext}`;

        const formData = new FormData();
        formData.append("file", {
          uri,
          name: fileName,
          type: mimeType,
        } as any);

        await axios.put(
          `${backendUrl}/api/v1/user/image/savedsuits`,
          formData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // fetchWardrobes();
      // fetchUserDetails();
      // setIsLoading(fa);
      fetchSavedSuits();
    } catch (error: any) {
      console.log("Upload Failed:", error);
      Alert.alert("Upload Failed", error?.message || "Something went wrong");
    }
  };
  const fetchSavedSuits = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found in storage");
        return;
      }

      const res = await axios.get(`${backendUrl}/api/v1/savedsuits`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.metadata?.success) {
        setSavedSuitsData(res.data.responseData);
        setsavedSuitCount(res.data.responseData.length);
      } else {
        console.log(
          "Failed to fetch saved suits:",
          res.data?.metadata?.message
        );
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("Axios error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const pathname = usePathname();

  useEffect(() => {
    if (pathname == "/SavedSuits") {
      fetchSavedSuits();
    }
  }, [pathname]);

  const handleImageSelect = (id: string, item: Suit) => {
    if (topBarSelected[path]) {
      setSelectedImageIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id)
          : [...prevSelected, id]
      );
    } else {
      // Navigate to details or show image modal
    }
  };

  const handleDeleteMultiple = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/v1/savedsuits/delete-multiple`,
        { ids: selectedImageIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedImageIds([]);
      fetchSavedSuits();
    } catch (error) {
      console.log(
        "Error deleting images:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <FileUpload
        hide={setIsFileUpload}
        show={isFileUpload}
        isMultiple={true}
        setImageUri={handleImageUploadFile}
      />
      <CameraComponent
        visible={visible}
        setImageUri={handleImageUploadCamera}
        onClose={() => setVisible(false)}
      />

      <View style={styles.actionBar}>
        {selectedImageIds.length > 0 && (
          <TouchableOpacity onPress={handleDeleteMultiple}>
            <MaterialCommunityIcons name="delete" size={25} color="black" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={reverseData} style={styles.icon}>
          <Octicons name="arrow-switch" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIs3x3(!is3x3)} style={styles.icon}>
          <Ionicons name="grid" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openActionSheet} style={styles.icon}>
          <FontAwesome6 name="sliders" size={25} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.suitGrid}>
          {savedSuitsData.length === 0 && (
            <View style={styles.noSuits}>
              <Text style={styles.noSuitsText}>No saved suits</Text>
            </View>
          )}
          {savedSuitsData.map((item) => (
            <Pressable
              key={item._id}
              onPress={() => handleImageSelect(item._id, item)}
              style={[styles.suitItem, { width: is3x3 ? "30%" : "48%" }]}
            >
              {selectedImageIds.includes(item._id) && (
                <View style={styles.selectedOverlay}>
                  <View style={styles.selectedTick}>
                    <AntDesign name="check" size={14} color="white" />
                  </View>
                </View>
              )}
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ActionSheetFilter
        seletedTags={seletedTags}
        setSelectedTags={setSelectedTags}
        actionSheetRef={actionSheetRef}
      />
      <ActionButton handleFun={handleActionButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  actionBar: {
    marginTop: 15,
    flexDirection: "row",
    gap: 15,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 5,
  },
  icon: {
    transform: [{ rotate: "90deg" }],
  },
  scrollView: {
    marginHorizontal: 16,
  },
  suitGrid: {
    marginVertical: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 13,
    paddingBottom: 9,
    marginBottom: 10,
  },
  noSuits: {
    width: "100%",
    height: 187,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 5,
  },
  noSuitsText: {
    fontSize: 18,
    color: "#9E9E9E",
  },
  suitItem: {
    height: 220,
    marginBottom: 13,
    borderRadius: 10,
    overflow: "hidden",
    aspectRatio: 1,
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  selectedTick: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF8C00",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default SavedSuits;
