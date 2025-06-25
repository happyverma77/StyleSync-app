import React, { useState, useEffect, useCallback, useRef } from "react";
import * as FileSystem from "expo-file-system";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import ActionSheetModal from "./ActionSheetModal";
import useAppContext from "@/ContextProvider/AppProvider";
import { backendUrl } from "@/utils/api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");
interface UploadImageProps {
  uri: string;
  name?: string;
  type?: string;
}
let isAddTaskModalOpenCopy = false;

export default function AddTaskModal({
  setIsCameraVisible,
  isCameraVisible,
  setUploadType,
  date,
  selectedItems,

  setHumanImageUrl,
  humanImageUrl,
  clothingImageUrl,
  fetchCalenderDetails,
  setClothingImageUrl,
  showFileUpload,
  setShowFileUpload,
  isVisible,
  setIsVisible,
}) {
  const {
    iskeyboardOpen,
    setIsLoading,
    isAddTaskModalOpen,
    setIsAddTaskModalOpen,
  } = useAppContext();

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const scrollViewRef = useRef(null);
  // Handle modal exclusivity
  useEffect(() => {
    if (isAddTaskModalOpen) {
      if (isAddTaskModalOpenCopy) {
        setIsAddTaskModalOpen(false);
      } else {
        isAddTaskModalOpenCopy = true;
      }
    }
    console.log(selectedItems);
    setNote(selectedItems?.[0]?.note);
    setTitle(selectedItems?.[0]?.title);
    setClothingImageUrl(
      selectedItems?.[0]?.cloth_image
        ? { uri: selectedItems?.[0]?.cloth_image }
        : null
    );
    setHumanImageUrl(
      selectedItems?.[0]?.human_image
        ? { uri: selectedItems?.[0]?.human_image }
        : null
    );
    return () => {
      if (isAddTaskModalOpen) {
        isAddTaskModalOpenCopy = false;
      }
    };
  }, [isAddTaskModalOpen]);

  if (!isAddTaskModalOpen || isCameraVisible) return null;

  const handleSaveTask = async (image1, image2, text1, text2) => {
    // if (!image1 || !image2 || !text1 || !text2) {
    //   Alert.alert("Missing Data", "Please provide all required inputs.");
    //   return;
    // }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      // Prepare file details
      const getFileDetails = (image) => {
        const uri = image.uri;
        const fileName = uri.split("/").pop() || "image.jpg";
        const extMatch = /\.(\w+)$/.exec(fileName);
        const ext = extMatch?.[1]?.toLowerCase() || "jpg";
        const type = `image/${ext}`;

        return {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          name: fileName,
          type,
        };
      };
      console.log("ddw");

      const formData = new FormData();
      if (image1) {
        formData.append("human_image", getFileDetails(image1) as any);
      }
      if (image2) {
        formData.append("cloth_image", getFileDetails(image2) as any);
      }
      formData.append("title", text1);
      formData.append("note", text2);
      formData.append("date", date); // make sure `date` is defined in your component scope

      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/task/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCalenderDetails();
      setIsAddTaskModalOpen(false);
      setClothingImageUrl(null);
      setHumanImageUrl(null);
      setNote("");
      setTitle("");
      console.log("Upload ");
      setIsLoading(false);
    } catch (error) {
      console.log("Upload Failed:", error.response.data);
      setIsLoading(false);
      Alert.alert("Upload Failed", error.message || "Something went wrong");
    }
  };

  // useEffect(() => {
  //   if (isAddTaskModalOpen) {
  //     setHumanImageUrl(selectedItems.human_image);
  //     setClothingImageUrl(selectedItems.cloth_image);
  //     setNote(selectedItems.note);
  //     setTitle(selectedItems.title);
  //   }
  // }, [selectedItems]);

  return (
    <Pressable
      style={styles.absoluteOverlay}
      onPress={() => setIsAddTaskModalOpen(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlayBackground}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setIsAddTaskModalOpen(false)}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalContent}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // Adjust vertical offset for iOS
          >
            <ScrollView
              ref={scrollViewRef}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: iskeyboardOpen
                  ? Platform.OS === "ios"
                    ? 100
                    : 10
                  : 0,
              }} // Add padding when keyboard is open
            >
              <View style={styles.fullWidth}>
                {!humanImageUrl ? (
                  <Pressable
                    onPress={() => {
                      setIsVisible(true);
                      setUploadType("human");
                    }}
                    style={styles.humanUpload}
                  >
                    <FontAwesome5
                      name="plus-circle"
                      size={24}
                      color="#D67D2A"
                    />
                  </Pressable>
                ) : (
                  <>
                    <Image
                      source={{ uri: humanImageUrl.uri }}
                      style={styles.mainImage}
                    />
                    <Pressable
                      onPress={() => setHumanImageUrl(null)}
                      style={styles.deleteIcon}
                    >
                      <FontAwesome name="trash-o" size={25} color="red" />
                    </Pressable>
                  </>
                )}
              </View>

              <View style={styles.rowContainer}>
                <Pressable
                  onPress={() => {
                    setIsVisible(true);
                    setUploadType("cloth");
                  }}
                  style={styles.addButton}
                >
                  <FontAwesome5 name="plus-circle" size={24} color="#D67D2A" />
                </Pressable>

                {clothingImageUrl && (
                  <View style={styles.imageThumb}>
                    <Image
                      source={{ uri: clothingImageUrl.uri }}
                      style={styles.thumbImage}
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { height: 40, padding: 7 }]}
                    placeholder="Add Title"
                    onChangeText={setTitle}
                    onFocus={() => {
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 100); // slight delay ensures keyboard is fully visible
                    }}
                    value={title}
                    placeholderTextColor="#BEBEBE"
                  />
                  <TextInput
                    style={[styles.input, { height: 90, padding: 7 }]}
                    multiline
                    value={note}
                    onFocus={() => {
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 100); // slight delay ensures keyboard is fully visible
                    }}
                    onChangeText={setNote}
                    placeholder="Note"
                    placeholderTextColor="#BEBEBE"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  handleSaveTask(humanImageUrl, clothingImageUrl, title, note)
                }
                style={[
                  styles.cancelButton,
                  // {
                  //   marginBottom:
                  //     iskeyboardOpen && Platform.OS === "ios" ? 150 : 0,
                  // },
                ]}
              >
                <Text style={styles.cancelButtonText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>

      {/* {isVisible && ( */}
      <ActionSheetModal
        setIsCameraVisible={setIsCameraVisible}
        isVisible={isVisible}
        returnUrl={"/CalenderScreen"}
        setShowFileUpload={setShowFileUpload}
        setIsVisible={setIsVisible}
      />
      {/* )} */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  absoluteOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999999,
    elevation: 10,
  },
  overlayBackground: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    maxHeight: height * 0.8,
    height: height * 0.8,
    backgroundColor: "#fff",
    padding: 16,
    // paddingBottom: 50,
    // paddingBottom: 8,
    zIndex: 999,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fullWidth: {
    width: "100%",
    position: "relative",
  },
  mainImage: {
    height: 360,
    width: "100%",
    resizeMode: "cover",

    borderRadius: 10,
  },
  deleteIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  rowContainer: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
  },
  addButton: {
    borderColor: "#D67D2A",
    borderWidth: 1,
    width: 54,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: 2,
  },
  imageThumb: {
    maxWidth: 93,
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
  inputContainer: {
    flex: 1,
  },
  input: {
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    textAlignVertical: "top",
  },
  humanUpload: {
    height: 360,
    width: "100%",
    borderColor: "#D67D2A",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderRadius: 2,
  },
  cancelButton: {
    backgroundColor: "#F28B29",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
