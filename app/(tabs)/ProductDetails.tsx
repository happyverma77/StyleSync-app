import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
import ImageCarousel from "@/components/ImageCarousel";
import * as ImagePicker from "expo-image-picker";
import useAppContext from "@/ContextProvider/AppProvider";
import TextInputWithSubmit from "@/components/SingleComponents/TextInputWithSubmit";
import TagsActionSheet from "@/components/SingleComponents/TagsActionSheet";
import axios from "axios";
import { backendUrl } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useLang } from "@/utils/LangContext";
import ActionSheetFilter from "@/components/ActionSheetFilter";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ProductDetails = () => {
  const { singlewardrobe, setSingleWardrobe, fetchWardrobes, setIsLoading } =
    useAppContext();
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const actionSheetRef = React.useRef<any>(null);
  const [seletedTags, setSelectedTags] = useState([]);
  const { t, lang, switchLanguage } = useLang();
  const scrollViewRef = useRef(null);
  const [note, setNote] = useState(singlewardrobe.note);

  const fetchsinglewardrobe = async (id: string) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token"); // or the correct key where token is stored
      const response = await axios.get(
        `https://stylesyncchanging.app/api/v1/wardrobe/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleWardrobe(response.data.responseData);
      console.log(response.data.responseData);

      setNote(response.data.responseData.note || "");
      setIsLoading(false);
      fetchWardrobes();
    } catch (error) {
      Alert.alert("Error", error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (singlewardrobe._id) {
      fetchsinglewardrobe(singlewardrobe._id);
    }
    return () => {
      setNote("");
      // setSingleWardrobe({});
    };
  }, [singlewardrobe._id]);

  const openActionSheet = () => {
    actionSheetRef.current?.show();
  };

  const handleTagActionSheetCancel = () => {
    actionSheetRef.current?.hide();
  };

  const handleTagActionSheetSubmit = async (tags: string[]) => {
    actionSheetRef.current?.hide();
    const payload = { tags: tags };
    try {
      const token = await AsyncStorage.getItem("token"); // or the correct key where token is stored
      const response = await axios.put(
        `https://stylesyncchanging.app/api/v1/wardrobe/${singlewardrobe._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleWardrobe(response.data.responseData);
      fetchWardrobes();
      Alert.alert("Success", "Tags updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdate = async (payload: {
    title?: string;
    description?: string;
    note?: string;
  }) => {
    try {
      const token = await AsyncStorage.getItem("token"); // or the correct key where token is stored
      const response = await axios.put(
        `https://stylesyncchanging.app/api/v1/wardrobe/${singlewardrobe._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleWardrobe(response.data.responseData);
      fetchWardrobes();
      // Alert.alert("Success", "Updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // or the correct key where token is stored
      const response = await axios.delete(
        `https://stylesyncchanging.app/api/v1/wardrobe/${singlewardrobe._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.responseData);
      setSingleWardrobe({});
      fetchWardrobes();
      router.replace("/Closet");
      Alert.alert("Success", "Deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const handleNoteUpdate = async (payload: { note?: string }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `https://stylesyncchanging.app/api/v1/wardrobe/${singlewardrobe._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleWardrobe(response.data.responseData);

      // fetchWardrobes();
      // Alert.alert("Success", "Updated successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error.response.data);
    }
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (note?.trim() !== "") {
        handleNoteUpdate({ note });
      }
    }, 3000); // 300ms debounce

    return () => clearTimeout(delayDebounce); // Cleanup the timeout on note change
  }, [note]);

  // /upload-secondaryImage
  interface UploadImageProps {
    uri: string;
    name?: string;
    type?: string;
  }

  const handleSecondaryImageUpload = async (image: UploadImageProps) => {
    try {
      const uri = image.uri;
      const fileName = uri.split("/").pop() || `image_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(fileName);
      const ext = match?.[1]?.toLowerCase() || "jpg";
      const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;

      const formData = new FormData();
      formData.append("wardrobeId", singlewardrobe._id);
      formData.append("file", {
        uri,
        name: fileName,
        type: mimeType,
      } as unknown as Blob); // safest cast for FormData file input in RN

      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/wardrobe/upload-secondaryImage",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchsinglewardrobe(singlewardrobe._id);
      Alert.alert("Success", "Image uploaded successfully");
      console.log("Upload Success:", response.data);
    } catch (error: any) {
      console.error("Upload Error:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to upload secondary image");
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: false,
      quality: 1,
    });
    console.log();

    if (!result.canceled && result.assets.length > 0) {
      handleSecondaryImageUpload(result.assets[0]);
      console.log(result.assets[0]);
    } else {
      // hide(false); // Close modal if user cancels
    }
  };

  const [isSecondaryImage, setIsSecondaryImage] = useState(false);

  const handleAddtoCalender = async (data) => {
    try {
      console.log(data);

      const today = new Date();
      const token = await AsyncStorage.getItem("token");
      const formattedDate = today.toISOString().split("T")[0];
      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/task/add/product-details",
        { date: formattedDate, image: data.image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert("Successfull", "Added to the calender");
    } catch (error) {
      Alert.alert("Failed", "Something went wrong");
    }
  };
  const downloadAndShare = async (imageUrl): Promise<void> => {
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
  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <ScrollView style={styles.container}>
        <KeyboardAwareScrollView
          // contentContainerStyle={styles.container}
          enableOnAndroid={true}
          extraScrollHeight={20}
          ref={scrollViewRef}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.wrapper}>
            <View style={styles.carousel}>
              <ImageCarousel
                data={singlewardrobe}
                isSecondaryImage={isSecondaryImage}
                secondaryImage={singlewardrobe?.secondaryImage}
                setIsSecondaryImage={setIsSecondaryImage}
                images={[singlewardrobe?.image]}
              />
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsHeader}>
                <View style={styles.rating}>
                  {Array.from({ length: 5 }).map((_, index) =>
                    index < singlewardrobe?.stars ? (
                      <FontAwesome
                        key={index}
                        name="star"
                        size={14}
                        color="#FFAC33"
                      />
                    ) : (
                      <Feather
                        key={index}
                        name="star"
                        size={14}
                        color="#FFAC33"
                      />
                    )
                  )}
                </View>
                <Text style={styles.ratingText}>{singlewardrobe.stars}</Text>
              </View>
              {!isTextEditing ? (
                <Text style={styles.title}>
                  {singlewardrobe?.title || "Title"}
                  <TouchableOpacity onPress={() => setIsTextEditing(true)}>
                    <FontAwesome
                      name="pencil"
                      style={styles.editIcon}
                      size={16}
                      color="blue"
                    />
                  </TouchableOpacity>
                </Text>
              ) : (
                <TextInputWithSubmit
                  onChangeText={() => {}}
                  onSubmit={(txt) => {
                    if (txt?.trim() !== "") {
                      handleUpdate({ title: txt?.trim() });
                    }
                    setIsTextEditing(false);
                  }}
                  value={singlewardrobe?.title}
                />
              )}
              {/* {!isDescriptionEditing ? (
                <Text style={styles.description}>
                  {singlewardrobe?.description || "Description"}
                  <TouchableOpacity
                    onPress={() => setIsDescriptionEditing(true)}
                  >
                    <FontAwesome
                      name="pencil"
                      style={styles.editIcon}
                      size={16}
                      color="blue"
                    />
                  </TouchableOpacity>
                </Text>
              ) : (
                <TextInputWithSubmit
                  onChangeText={() => {}}
                  onSubmit={(txt) => {
                    if (txt.trim() !== "") {
                      console.log(txt);

                      handleUpdate({ description: txt.trim() });
                    }
                    setIsDescriptionEditing(false);
                  }}
                  value={singlewardrobe?.description}
                />
              )} */}
              <View style={styles.tagSection}>
                <Text style={styles.sectionTitle}>{t("Product.Add_Tags")}</Text>
                <View style={styles.tagsContainer}>
                  {singlewardrobe?.tags?.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                  <Pressable
                    style={styles.addTagButton}
                    onPress={openActionSheet}
                  >
                    <AntDesign name="plus" size={10} color="white" />
                    <Text style={styles.addTagText}>{t("Product.Add")}</Text>
                  </Pressable>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <Pressable
                  onPress={() => {
                    // setIsVisible(true);
                    // setUploadType("cloth");
                    handleImagePick();
                  }}
                  style={styles.addButton}
                >
                  <FontAwesome5 name="plus-circle" size={24} color="#D67D2A" />
                </Pressable>
                <View style={styles.imageThumb}>
                  <Image
                    source={{ uri: singlewardrobe?.secondaryImage }}
                    style={styles.thumbImage}
                  />
                </View>
              </View>
              <View style={styles.noteSection}>
                <Text style={styles.sectionTitle}>{t("Product.Add_Note")}</Text>

                <TextInput
                  style={styles.textInput}
                  multiline
                  onChange={(e) => setNote(e.nativeEvent.text)}
                  value={note}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 100); // slight delay ensures keyboard is fully visible
                  }}
                  numberOfLines={8}
                  placeholder="Type your message..."
                />
              </View>

              <View style={styles.actionButtons}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleAddtoCalender(singlewardrobe)}
                >
                  <MaterialIcons name="meeting-room" size={18} color="white" />
                  <Text style={styles.actionButtonText}>
                    {t("Product.Add_to_Calender")}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => downloadAndShare(singlewardrobe?.image)}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={18}
                    color="white"
                  />
                  <Text style={styles.actionButtonText}>
                    {t("Product.Share")}
                  </Text>
                </Pressable>
                <Pressable onPress={handleDelete} style={styles.deleteButton}>
                  <AntDesign name="delete" size={18} color="white" />
                  <Text style={styles.deleteButtonText}>
                    {t("Product.Delete")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
      <ActionSheetFilter
        seletedTags={seletedTags}
        setSelectedTags={setSelectedTags}
        editmode={true}
        actionSheetRef={actionSheetRef}
      />
      {/* <TagsActionSheet
        tags={singlewardrobe?.tags || []}
        handleCancel={handleTagActionSheetCancel}
        handleSubmit={handleTagActionSheetSubmit}
        actionSheetRef={actionSheetRef}
      /> */}
    </SafeAreaProviderCustom>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 5,
    color: "black",
    marginBottom: 5,
  },
  wrapper: {
    maxWidth: 768,
    marginLeft: "auto",
    paddingBottom: 45,
    marginRight: "auto",
    width: "100%",
  },
  carousel: {
    width: "100%",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 5,
  },
  rowContainer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    borderColor: "#D67D2A",
    borderWidth: 1,
    width: 100,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: 2,
  },
  imageThumb: {
    maxWidth: 150,
    width: "100%",
    height: 140,
    borderRadius: 2,
    overflow: "hidden",
  },
  thumbImage: {
    maxHeight: 140,
    width: "100%",
    resizeMode: "cover",
    height: "100%",
    borderRadius: 10,
  },
  rating: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: 16,
    color: "#FFAC33",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18,
    paddingBottom: 5,
  },
  description: {
    fontSize: 12,
    fontWeight: "500",
    color: "#525252",
    lineHeight: 18,
  },
  editIcon: {
    marginLeft: 8,
  },
  tagSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: "#EEEEEE",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  addTagButton: {
    backgroundColor: "#D67D2A",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addTagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  noteSection: {
    marginTop: 20,
    gap: 15,
  },

  textInput: {
    borderWidth: 1,
    paddingStart: 5,
    borderColor: "#D8DADC",
    color: "black",
    borderRadius: 10,
    height: 160,
    textAlignVertical: "top",
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 25,
  },
  actionButton: {
    backgroundColor: "#D67D2A",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#F00909",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
});

export default ProductDetails;
