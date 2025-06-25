import ActionButton from "@/components/ActionButton";
import ActionSheetFilter from "@/components/ActionSheetFilter";
// import ImageViewerModal from "@/components/ImageViewerModal";
import useAppContext from "@/ContextProvider/AppProvider";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
  Image,
  ListRenderItem,
} from "react-native";
import CameraComponent from "@/components/SingleComponents/CameraComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendUrl } from "@/utils/api";
import FileUpload from "@/components/SingleComponents/FileUpload";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
interface UploadImageProps {
  uri: string;
  name?: string;
  type?: string;
}
const categories = ["All", "Skirts", "Tops"];
const subCategories = [
  "All",
  "T-shirts",
  "Tops",
  "Polo shirts",
  "Tank tops",
  "Sweaters",
];

type WardrobeItem = {
  _id: string;
  image: string | number;
  uri?: string;
};

export default function App() {
  const {
    wardrobes,
    setSingleWardrobe,
    fetchWardrobes,
    setIsLoading,
    fetchUserDetails,
    topBarSelected,
  } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [selectedImg, setselectedImg] = useState<{ url: string }[]>([]);
  const [visible, setVisible] = useState(false);
  const [isFileUpload, setIsFileUpload] = useState(false);
  const [gridColumns, setGridColumns] = useState(2);
  const actionSheetRef = useRef<any>(null);
  const path = usePathname();
  const [seletedTags, setSelectedTags] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);
  const [showSheet, setShowSheet] = useState(false);

  const returnValue = useLocalSearchParams();
  // const path = usePathname();
  console.log("Query param:", returnValue.return, path);

  const openActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const handleImageSelect = (id: string, item: WardrobeItem) => {
    if (topBarSelected[path]) {
      setSelectedImageIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((itemId) => itemId !== id)
          : [...prevSelected, id]
      );
    } else {
      if (returnValue.return) {
        router.replace({
          pathname: returnValue.return,
          params: { image: item.image },
        });
        return;
      }
      router.replace(`/(tabs)/ProductDetails`);
      setSingleWardrobe({ _id: item._id });
      setselectedImg([{ url: item.uri || "" }]);
    }
  };

  // useEffect(() => {
  //   fetchWardrobes();
  // }, []);

  useEffect(() => {
    if (!topBarSelected[path]) {
      setSelectedImageIds([]);
    }
  }, [topBarSelected]);

  const handleActionButton = (type: string) => {
    if (type === "Camera") {
      setVisible(true);
    } else {
      setIsFileUpload(true);
    }
  };

  const renderImageItem: ListRenderItem<WardrobeItem> = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleImageSelect(item._id, item)}
      style={styles.imageWrapper}
    >
      <Image
        source={
          typeof item.image === "string" ? { uri: item.image } : item.image
        }
        style={styles.image}
      />
      {selectedImageIds.includes(item._id) && (
        <View style={styles.selectedOverlay}>
          <View style={styles.selectedTick}>
            <AntDesign name="check" size={15} color="white" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
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
          `https://stylesyncchanging.app/api/v1/user/image/wardrobe`,
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

      fetchWardrobes();
      fetchUserDetails();
      // setIsLoading(fa);
    } catch (error: any) {
      console.log("Upload Failed:", error);
      Alert.alert("Upload Failed", error?.message || "Something went wrong");
    }
  };

  const handleImageUploadCamera = async (image) => {
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
      setIsLoading(true);
      await axios.put(
        `https://stylesyncchanging.app/api/v1/user/image/wardrobe`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      fetchWardrobes();
      fetchUserDetails();
    } catch (error: any) {
      console.log("Upload Failed:", error);
      Alert.alert("Upload Failed", error?.message || "Something went wrong");
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
        "https://stylesyncchanging.app/api/v1/wardrobe/delete-multiple",
        { ids: selectedImageIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Delete response:", response.data);
      setSelectedImageIds([]);
      fetchWardrobes();
    } catch (error: any) {
      console.log(
        "Error deleting images:",
        error?.response?.data || error.message
      );
    }
  };
  const filteredData = wardrobes.filter((item) => {
    const tags = item.tags || [];
    const matchCategory =
      activeCategory === "All" || tags.includes(activeCategory);
    const matchSubcategory =
      activeSubCategory === "All" || tags.includes(activeSubCategory);
    return matchCategory && matchSubcategory;
  });

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <View style={styles.container}>
        <FileUpload
          hide={setIsFileUpload}
          isMultiple={true}
          show={isFileUpload}
          setImageUri={handleImageUploadFile}
        />
        <CameraComponent
          visible={visible}
          setImageUri={handleImageUploadCamera}
          onClose={() => setVisible(false)}
        />
        {!visible && (
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
              paddingTop: 20,
            }}
          >
            <View style={styles.topTabs}>
              <View style={styles.tabsLeft}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setActiveCategory(cat)}
                    style={[
                      styles.tabButton,
                      activeCategory === cat && styles.activeTabButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeCategory === cat && styles.activeTabText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.iconButtons}>
                {selectedImageIds.length > 0 && (
                  <TouchableOpacity
                    onPress={handleDeleteMultiple}
                    style={{ marginRight: 10 }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={25}
                      color="black"
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setGridColumns((pre) => (pre === 2 ? 3 : 2))}
                >
                  <Ionicons name="grid" size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openActionSheet}
                  style={{ marginLeft: 10 }}
                >
                  <FontAwesome6 name="sliders" size={25} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subTabsContainer}
              >
                {subCategories.map((sub) => (
                  <TouchableOpacity
                    key={sub}
                    onPress={() => setActiveSubCategory(sub)}
                    style={styles.subTabButton}
                  >
                    <Text
                      style={[
                        styles.subTabText,
                        activeSubCategory === sub && styles.activeSubTabText,
                      ]}
                    >
                      {sub}
                    </Text>
                    {activeSubCategory === sub && (
                      <View style={styles.activeIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.tabBarLine} />
            </View>
            {/* <View style={{ paBottom: 100 }}> */}
            <ScrollView style={{ marginHorizontal: 16 }}>
              <View style={styles.suitGrid}>
                {filteredData.map((item) => (
                  <Pressable
                    key={item._id}
                    onPress={() => handleImageSelect(item._id, item)}
                    style={[
                      styles.suitItem,
                      { width: gridColumns == 3 ? "30%" : "48%" },
                    ]}
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

            {/* <FlatList
              data={filteredData}
              renderItem={renderImageItem}
              keyExtractor={(item) => item._id}
              numColumns={gridColumns}
              key={gridColumns}
              contentContainerStyle={{ padding: 10 ,justifyContent:""}}
              showsVerticalScrollIndicator={false}
            /> */}
            {/* </View> */}
            {filteredData.length === 0 && (
              <Text
                style={{
                  textAlign: "center",
                  color: "black",
                  marginVertical: 20,
                }}
              >
                You have no wardrobe items
              </Text>
            )}

            <ActionSheetFilter
              seletedTags={seletedTags}
              setSelectedTags={setSelectedTags}
              actionSheetRef={actionSheetRef}
            />
          </View>
        )}
      </View>
      <ActionButton handleFun={handleActionButton} />
    </SafeAreaProviderCustom>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
    // marginTop: 10,
    paddingBottom: 15,
  },
  topTabs: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
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
  suitGrid: {
    marginVertical: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 13,
    paddingBottom: 9,
    marginBottom: 10,
  },
  tabsLeft: {
    flexDirection: "row",
    flex: 1,
  },
  tabButton: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeTabButton: {
    backgroundColor: "#FF8C00",
    borderColor: "#FF8C00",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  iconButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTabsContainer: {
    paddingHorizontal: 10,
  },
  subTabButton: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    paddingBottom: 8,
  },
  subTabText: {
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
  },
  activeSubTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  activeIndicator: {
    height: 2,
    backgroundColor: "#007AFF",
    width: "100%",
    borderRadius: 2,
    zIndex: 1,
  },
  tabBarLine: {
    height: 2,
    backgroundColor: "rgba(227, 229, 232, 0.5)",
    width: "100%",
    marginHorizontal: 8,
    borderRadius: 2,
    position: "absolute",
    bottom: 8,
  },
  imageWrapper: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
    aspectRatio: 1,
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: 0,
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
});
