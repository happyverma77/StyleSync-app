import React, { useState, useEffect } from "react";
import { View, Modal, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

const FileUpload = ({ isMultiple = false, show, hide, setImageUri }) => {
  const [imageUri, setImageUriState] = useState(null);

  useEffect(() => {
    if (show) {
      handleImagePick();
    }
  }, [show]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: isMultiple,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0];
      if (isMultiple) {
        // setMultipleImages(result.assets);
        setImageUri(result.assets);
      } else {
        setImageUri(uri);
      }
      setImageUriState(uri);

      hide(false); // Close modal after image selection
    } else {
      hide(false); // Close modal if user cancels
    }
  };

  return null;
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    padding: 30,
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
});

export default FileUpload;
