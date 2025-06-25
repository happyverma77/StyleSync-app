import CameraComponent from "@/components/SingleComponents/CameraComponent";
import { useLang } from "@/utils/LangContext";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Loader from "@/components/Loader";
import useAppContext from "@/ContextProvider/AppProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ScrollView } from "react-native-actions-sheet";
interface RenderCategoryProps {
  title: string;
  expandable?: boolean;
  isShow?: boolean;
  data?: any[];
  setIsShow?: React.Dispatch<React.SetStateAction<boolean>>;
  onClick?: (item: any) => void;
}
interface UploadImageProps {
  uri: string;
  name?: string;
  type?: string;
}
const FittingRoomTryOn = () => {
  const [tryOnImage, setTryOnImage] = useState(null);
  const [isShow, setIsShow] = useState<boolean>(true); // Show Top section by default
  const [isShowActionSheet, setIsActionSheet] = useState(true);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [allClothes, setAllClothes] = useState<any[]>([]);
  const [userFittngRoomImage, setUserFittngRoomImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    fittingRoomImage,
    setIsLoading,
    fetchUserDetails,
    fittingRoomCameraImage,
    userData,
  } = useAppContext();
  const [uploadType, setUploadType] = useState<"human" | "clothing" | null>(
    "clothing"
  );

  const imageUrl: string | ImageSourcePropType =
    userData?.fittingRoomModel || require("../../assets/images/modal.jpg");

  const [imageStack, setImageStack] = useState([imageUrl]);

  const [selectedClothImage, setSelectedClothImage] = useState(null);
  const [isLoader, setIsLoader] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setImageStack((pre) => [...pre, userData?.fittingRoomModel]);
  }, [userData?.fittingRoomModel]);

  useEffect(() => {
    return () => {
      setIsActionSheet(true);
      setIsCameraVisible(false);
    };
  }, [pathname]);

  useEffect(() => {
    if (selectedClothImage) {
      handleImageUpload(selectedClothImage);
    }
  }, [selectedClothImage]);

  const fetchUploadedImages = async () => {
    try {
      setIsLoader(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get(
        `https://stylesyncchanging.app/api/v1/user/my-cloths`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      setAllClothes(response.data.responseData);
      setIsLoader(false);
    } catch (error) {
      setIsLoader(false);
      console.log("Upload Failed:", error.response.data);
      Alert.alert("Upload Failed", error.message);
    }
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const handleImageUpload = async (image) => {
    // if (!image) return;
    const uri = image.uri || image;
    const fileName = uri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(fileName);
    const ext = match?.[1]?.toLowerCase() || "jpg";
    const mimeType = `image/${ext}`;

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: mimeType,
    } as any);
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No token found");
    if (userFittngRoomImage) {
      const response = await axios.put(
        `https://stylesyncchanging.app/api/v1/user/image/fittingroom`,
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
      setUserFittngRoomImage(false);
    } else {
      try {
        router.replace("/FittingRoom");
        setIsLoader(true);
        const response = await axios.post(
          `https://stylesyncchanging.app/api/v1/user/upload-cloth`,
          formData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        setSelectedClothImage(null);

        // tryOn(
        //   response?.data?.responseData?.image,
        //   response?.data?.responseData?._id
        // );
        setIsLoader(false);
        // router.replace("/FittingRoom");
      } catch (error) {
        Alert.alert("Upload Failed", error?.message);
      }
    }
  };

  const tryOn = async (img, id) => {
    setIsLoader(true);
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.warn("No token found in AsyncStorage");
        setIsLoader(false);
        return;
      }

      // Hardcoded or previously uploaded images (replace with your real URIs or values)
      const payload = {
        human_image: imageStack[imageStack.length - 1],
        cloth_image: img || allClothes[0]?.image,
      };

      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/instent/try-on",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response?.data);

      setTryOnImage(response?.data?.responseData?.tryOnImageUrl);
      setImageStack((pre) => [
        ...pre,
        response?.data?.responseData?.tryOnImageUrl,
      ]);
      setIsLoader(false);
      fetchUploadedImages();
      // fetchUserDetails();
      if (id) {
        const storedValue = await AsyncStorage.getItem("cachedData");
        const newValue = storedValue ? JSON.parse(storedValue) : {};
        newValue[id] = response?.data?.responseData?.tryOnImageUrl;
        await AsyncStorage.setItem("cachedData", JSON.stringify(newValue));
      }
    } catch (error) {
      Alert.alert(error.response?.data?.metadata?.message, "Purchase now");
      setIsLoader(false);
      console.log(
        "Try-on API error:",
        error.response?.data?.metadata?.message || error.message
      );
    }
  };
  const handleImageClick = async (data) => {
    const storedValue = await AsyncStorage.getItem("cachedData");
    const newValue = storedValue ? JSON.parse(storedValue) : {};
    if (newValue[data._id]) {
      setTryOnImage(newValue[data._id]);

      setSelectedImage(data);
    } else {
      setSelectedImage(data);
      // tryOn(data.image, data._id);
    }

    // console.log(data);
    //  await AsyncStorage.setItem(key, JSON.stringify(newValue));
  };

  const handleImageSaved = async (image) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/save-image",
        {
          image: image,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );
      Alert.alert("Saved Successfully", "Image saved successfully.");
    } catch (error) {
      Alert.alert("Error", error.response?.data.metadata?.message);
      console.log(error.response?.data.metadata?.message || error.message);
    }
  };
  const handlePutOn = () => {
    if (!selectedImage) {
      Alert.alert("Please select an image first.");
      return;
    }
    tryOn(selectedImage.image, selectedImage._id);
  };

  const returnValue = useLocalSearchParams();

  useEffect(() => {
    if (returnValue?.image) {
      setIsActionSheet(false);
      setSelectedClothImage({ uri: returnValue?.image });
    }
    router.replace("/FittingRoomTryOn");
  }, [returnValue?.image]);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {/* <Text>{pathname}</Text> */}

        <View style={styles.wrapper}>
          <View style={styles.innerWrapper}>
            {/* Left Panel: Model Image */}
            <View style={styles.leftPanel}>
              <TouchableOpacity
                onPress={() => {
                  setUserFittngRoomImage(true);
                  setIsActionSheet(true);
                }}
                style={styles.refreshButton}
              >
                <EvilIcons name="refresh" size={30} color="black" />
              </TouchableOpacity>

              <Image
                // source={
                //   typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl
                // }
                source={
                  typeof imageUrl === "string"
                    ? { uri: imageStack[imageStack.length - 1] }
                    : imageStack[imageStack.length - 1]
                }
                style={styles.modelImage}
                resizeMode="cover"
              />

              <View style={styles.bottomButtons}>
                <TouchableOpacity
                  onPress={() =>
                    handleImageSaved(imageStack[imageStack.length - 1])
                  }
                  style={styles.iconButton}
                >
                  <Ionicons name="bookmark-outline" size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handlePutOn()}
                  style={styles.putOnButton}
                >
                  <Text style={styles.putOnText}>PUT ON</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (imageStack.length > 1) {
                      setImageStack((pre) => pre.slice(0, pre.length - 1));
                    }
                  }}
                  style={styles.iconButton}
                >
                  <MaterialCommunityIcons
                    name="arrow-u-left-top"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Right Panel: Category List */}
            <ScrollView style={styles.rightPanel}>
              {renderCategory({
                title: `All (${allClothes?.length || 0})`,
                expandable: true,
                isShow,
                data: allClothes,
                setIsShow,
                onClick: handleImageClick,
              })}
              {/* {renderCategory({
                title: "Top (50)",
                expandable: true,
                isShow,
                setIsShow,
              })}
              {renderCategory({ title: "Pants (40)" })}
              {renderCategory({ title: "Shirts (40)" })}
              {renderCategory({ title: "Jeans (40)" })}
              {renderCategory({ title: "Dresses (40)" })}
              {renderCategory({ title: "Accessories" })} */}
            </ScrollView>
          </View>
        </View>

        {isShowActionSheet && pathname === "/FittingRoomTryOn" && (
          <ActionSheetModal
            setIsActionSheet={setIsActionSheet}
            setIsCameraVisible={setIsCameraVisible}
            returnUrl={"/FittingRoomTryOn"}
            setSelectedClothImage={setSelectedClothImage}
          />
        )}
        <CameraComponent
          setImageUri={setSelectedClothImage}
          visible={isCameraVisible}
          onClose={setIsCameraVisible}
        />
      </View>
      {isLoader && <Loader isLoading={isLoader} />}
    </GestureHandlerRootView>
  );
};

const ActionSheetModal = ({
  setSelectedClothImage,
  setIsActionSheet,
  returnUrl,
  setIsCameraVisible,
}) => {
  const { t, lang, switchLanguage } = useLang();
  const returnValue = useLocalSearchParams();
  console.log(returnValue, "fefe");

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0];
        setSelectedClothImage(uri);
        setIsActionSheet(false);
        // console.log("Picked image URI:", uri);
      } else {
        console.log("Image picking was cancelled.");
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };
  const options = [
    {
      label: t("Upload.Take_Photo"),
      onPress: () => {
        setIsActionSheet(false);
        setIsCameraVisible(true);
      },
    },
    {
      label: t("Upload.Choose_Album"),
      onPress: () => handleImagePick(),
    },
    {
      label: t("Upload.Pick_Closet"),
      onPress: () => {
        setIsActionSheet(false);
        router.replace({
          pathname: "/Closet",
          params: { return: returnUrl },
        });
        // router.push("/Closet")
        // console.log("dwdw");
      },
    },
  ];
  // const openModal = () => setIsVisible(true);
  const closeModal = () => setIsActionSheet(false);

  return (
    <View style={styles1.container}>
      <Modal
        visible={returnValue?.actionsheet == "true" ? true : false}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
      >
        {/* Blurred background */}
        <BlurView
          intensity={40}
          tint="regular"
          experimentalBlurMethod="dimezisBlurView"
          style={styles1.absolute}
        />

        {/* Modal content */}
        <View style={styles1.bottomSheet}>
          <View style={styles1.optionsContainer}>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles1.optionButton}
                  onPress={() => {
                    option.onPress();
                    //  closeModal();
                  }}
                >
                  <Text style={styles1.optionText}>{option.label}</Text>
                </TouchableOpacity>

                {index < options.length - 1 && (
                  <View style={styles1.separator} />
                )}
              </React.Fragment>
            ))}
          </View>

          <TouchableOpacity
            style={styles1.cancelButton}
            onPress={() => {
              setIsActionSheet(false);
              router.push("/(tabs)/FittingRoom");
            }}
          >
            <Text style={styles1.cancelButtonText}>{t("Upload.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const renderCategory = ({
  title,
  expandable = false,
  isShow = false,
  data,
  onClick,
  setIsShow = () => {},
}: RenderCategoryProps): React.ReactElement => {
  const isActive = expandable;
  const [activeImage, setActiveImage] = useState(null);
  return (
    <View
      style={[
        styles.categoryContainer,
        isActive ? styles.activeCategory : null,
      ]}
    >
      <TouchableOpacity onPress={() => expandable && setIsShow(!isShow)}>
        <Text style={styles.categoryText}>{title}</Text>
      </TouchableOpacity>

      {isShow && expandable && (
        <View style={styles.itemGrid}>
          {data.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                setActiveImage(item._id);
                onClick(item);
              }}
              key={index}
              style={styles.itemImageContainer}
            >
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.itemImage,
                  item._id === activeImage && styles.active,
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  wrapper: {
    width: "100%",
    maxWidth: 768,
    alignSelf: "center",
    paddingTop: 20,
  },
  innerWrapper: {
    flexDirection: "row",
    backgroundColor: "#D67D2A",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: "hidden",
    height: "100%",
  },
  leftPanel: {
    width: 260,
    position: "relative",
  },
  refreshButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "black",
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modelImage: {
    width: "100%",
    height: "100%",
    maxHeight: 850,
  },
  bottomButtons: {
    position: "absolute",
    bottom: 35,
    left: 12,
    right: 12,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 45,
    height: 45,
    backgroundColor: "#d67d2aba",
    borderRadius: 45 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  putOnButton: {
    backgroundColor: "#D67D2A",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  putOnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  rightPanel: {
    width: 150,
    // paddingHorizontal: 8,
    backgroundColor: "#D67D2A",
  },
  categoryContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: "#B96B23",
    borderBottomWidth: 1,
  },
  activeCategory: {
    backgroundColor: "#E39144",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    lineHeight: 22,
  },
  itemGrid: {
    flexDirection: "column",
    gap: 10,
    paddingTop: 10,
  },
  itemImageContainer: {
    width: 107,
    height: 117,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "center",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  active: {
    borderWidth: 2,
    borderColor: "red",
  },
});
const styles1 = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#EFEFEF",
    // justifyContent: "center",
    // alignItems: "center",
  },
  triggerButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  triggerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: "transparent",
    paddingBottom: 50,
  },
  optionsContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  optionButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  cancelButton: {
    backgroundColor: "#F28B29",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default FittingRoomTryOn;
