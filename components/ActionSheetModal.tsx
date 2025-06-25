import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { useLang } from "@/utils/LangContext";
import { router, useLocalSearchParams } from "expo-router";

const ActionSheetModal = ({
  setShowFileUpload,
  setIsCameraVisible,
  isVisible,
  setIsVisible,
  returnUrl = "/",
}) => {
  const { t, lang, switchLanguage } = useLang();
  const options = [
    {
      label: t("Upload.Take_Photo"),
      onPress: () => {
        setIsCameraVisible(true);
        setIsVisible(false);
      },
    },
    {
      label: t("Upload.Choose_Album"),
      onPress: () => {
        setShowFileUpload(true);
        // setIsVisible(false);
        // setTimeout(() => {
        //   setIsVisible(false);
        // }, 100);
      },
    },
    {
      label: t("Upload.Pick_Closet"),
      onPress: () => {
        setIsVisible(false);
        router.replace({
          pathname: "/Closet",
          params: { return: returnUrl },
        });
      },
    },
  ];
  const openModal = () => setIsVisible(true);
  const closeModal = () => {
    setIsVisible(false);
    console.log(4566);

    // router.push("/(tabs)/FittingRoom");
  };
  useEffect(() => {
    if (isVisible) {
      openModal();
    }
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
      >
        {/* Blurred background */}
        <BlurView
          intensity={40}
          tint="regular"
          experimentalBlurMethod="dimezisBlurView"
          style={styles.absolute}
        />

        {/* Modal content */}
        <View style={styles.bottomSheet}>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    option.onPress();
                    // closeModal();
                  }}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>

                {index < options.length - 1 && (
                  <View style={styles.separator} />
                )}
              </React.Fragment>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>{t("Upload.cancel")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ActionSheetModal;

const styles = StyleSheet.create({
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
