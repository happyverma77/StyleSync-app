import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  Feather,
  Entypo,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppContext from "@/ContextProvider/AppProvider";
import { useLang } from "@/utils/LangContext";

interface UserData {
  name: string;
  email: string;
  profilePicture?: string;
}

export default function Settings() {
  const { userData } = useAppContext();
  const { t, lang, switchLanguage } = useLang();
  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={
              userData?.profilePicture
                ? { uri: userData?.profilePicture }
                : { uri: "https://randomuser.me/api/portraits/women/44.jpg" }
            }
            style={styles.profileImage}
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>
              {userData?.name || "Emily Smith"}{" "}
            </Text>
            <Text style={styles.profileEmail}>{userData?.email}</Text>
          </View>
        </View>
        <View style={styles.line} />
        {/* Settings Sections */}
        <View style={styles.card}>
          {["PersonalInfo", "PasswordScreen", "Language"].map(
            (route, index) => (
              <SettingItem
                key={index}
                icon={
                  route === "PersonalInfo" ? (
                    <AntDesign name="info" size={22} color="#333" />
                  ) : route === "PasswordScreen" ? (
                    <Ionicons name="key-outline" size={22} color="#333" />
                  ) : (
                    <MaterialCommunityIcons name="web" size={22} color="#333" />
                  )
                }
                routes={route}
                label={t(
                  `Settings.${
                    route == "PasswordScreen" ? "ChangePassword" : route
                  }`
                )}
              />
            )
          )}
        </View>

        <View style={styles.card}>
          {["RateUs", "Share", "FollowUs"].map((route, index) => (
            <SettingItem
              key={index}
              routes={route}
              icon={
                route === "RateUs" ? (
                  <Entypo name="star-outlined" size={22} color="#333" />
                ) : route === "Share" ? (
                  <Feather name="share-2" size={22} color="#333" />
                ) : (
                  <FontAwesome5 name="reddit-alien" size={20} color="#333" />
                )
              }
              isArrow={false}
              label={t(`Settings.${route}`)}
            />
          ))}
        </View>

        <View style={[styles.card, { marginBottom: 50 }]}>
          {["Subscription", "Feedback", "PrivacyPolicy", "Terms", "Logout"].map(
            (route, index) => (
              <SettingItem
                key={index}
                routes={route}
                icon={
                  route === "Subscription" ? (
                    <AntDesign name="mail" size={22} color="#333" />
                  ) : route === "Feedback" ? (
                    <MaterialCommunityIcons
                      name="message-alert-outline"
                      size={22}
                      color="#333"
                    />
                  ) : route === "PrivacyPolicy" ? (
                    <MaterialIcons name="privacy-tip" size={22} color="#333" />
                  ) : route === "Terms" ? (
                    <MaterialCommunityIcons
                      name="file-check-outline"
                      size={22}
                      color="#333"
                    />
                  ) : (
                    <AntDesign name="logout" size={22} color="#333" />
                  )
                }
                label={t(
                  `Settings.${route == "Subscription" ? "Subscribe" : route}`
                )}
              />
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaProviderCustom>
  );
}

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  routes: string;
  isArrow?: boolean;
  labelColor?: string;
}

function SettingItem({
  icon,
  label,
  isArrow = true,
  labelColor = "#333",
  routes,
}: SettingItemProps) {
  const [isPressed, setIsPressed] = useState(false);
  const router = useRouter();

  const handlePressIn = () => setIsPressed(true);

  const handlePressOut = () => setIsPressed(false);

  const handlePress = async () => {
    try {
      switch (routes) {
        case "PrivacyPolicy":
          router.replace(`/PrivacyPolicy`);
          break;
        case "Logout":
          await AsyncStorage.clear();
          router.replace(`/FirstTime`);
          break;
        case "PasswordScreen":
          router.replace(`/PasswordScreen`);
          break;
        case "FollowUs":
          router.replace(`/FollowUs`);
          break;
        case "Subscription":
          router.replace(`/Subscription`);
          break;
        case "PersonalInfo":
          router.replace(`/PersonalInfo`);
          break;
        case "Language":
          router.replace(`/Language`);
          break;
        case "Feedback":
          router.replace(`/RateUs`);
          break;
        case "Terms":
          router.replace(`/TermsAndConditions`);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log("Error navigating:", error);
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[
        styles.settingItem,
        { backgroundColor: isPressed ? "#E5F0FF" : "#fff8f1" },
      ]}
    >
      <View style={styles.iconLabelContainer}>
        <View style={[styles.iconWrapper]}>{icon}</View>
        <Text style={[styles.label]}>{label}</Text>
      </View>
      {isArrow && (
        <MaterialIcons name="keyboard-arrow-right" size={24} color="#bbb" />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 0,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  profileEmail: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  card: {
    borderRadius: 12,
    paddingVertical: 5,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fff8f1",
    marginBottom: 2,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 30,
    alignItems: "center",
  },
  label: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#ebeae8",
    marginBottom: 12,
  },
  infoIcon: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
  },
});
