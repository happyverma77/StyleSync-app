import { useLang } from "@/utils/LangContext";
import React, { JSX } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

const FollowUs = (): JSX.Element => {
  const { t, lang, switchLanguage } = useLang();

  const isUri = (source: string | number): boolean => {
    return typeof source === "string";
  };

  const renderImage = (source: string | number, style: any) => {
    if (isUri(source)) {
      return <Image source={{ uri: source as string }} style={style} />;
    } else {
      return <Image source={source as ImageSourcePropType} style={style} />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <View style={styles.mainImageContainer}>
            {renderImage(
              require("../../assets/images/Fimage.png"),
              styles.mainImage
            )}
          </View>
          <Text style={styles.title}>{t("FollowUs.title")}</Text>
          <Text style={styles.description}>{t("FollowUs.description")}</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.iconButton}>
              {renderImage(
                require("../../assets/images/Facebook.png"),
                styles.iconImage
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              {renderImage(
                require("../../assets/images/Instagram.png"),
                styles.iconImage
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              {renderImage(
                require("../../assets/images/twitter.png"),
                styles.iconImage
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              {renderImage(
                require("../../assets/images/Youtube.png"),
                styles.iconImage
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>{t("FollowUs.FollowUs")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.buttonText}>{t("FollowUs.Skip")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default FollowUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  contentContainer: {
    maxWidth: 768,
    width: "100%",
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  mainImageContainer: {
    width: "100%",
    maxHeight: 286,
  },
  mainImage: {
    maxHeight: 286,
    maxWidth: 286,
    width: "100%",
    alignSelf: "center",
    resizeMode: "contain",
  },
  title: {
    color: "#D67D2A",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
    marginTop: 20,
  },
  description: {
    color: "#7B7B7B",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
  },
  socialContainer: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 24,
  },
  iconButton: {
    width: 54,
    height: 54,
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginTop: 40,
  },
  primaryButton: {
    backgroundColor: "#D67D2A",
    paddingVertical: 14,
    borderRadius: 9999,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "600",
  },
});
