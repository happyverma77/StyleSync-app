import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLang } from "@/utils/LangContext";

const { width } = Dimensions.get("window");

type Language = {
  label: string;
  code: string;
};

const LANGUAGES: Language[] = [
  { label: "USA (us)", code: "en" },
  { label: "English (uk)", code: "en" },
  { label: "French", code: "fr" },
  { label: "German", code: "de" },
  { label: "Japanese", code: "ja" },
  { label: "Korean", code: "ko" },
  { label: "Spanish", code: "es" },
  { label: "Italian", code: "it" },
  { label: "Portuguese", code: "pt" },
  { label: "Russian", code: "ru" },
  { label: "Chinese (Traditional)", code: "zh-Hant" },
  { label: "Chinese (Simplified)", code: "zh" },
  { label: "Hindi", code: "hi" },
  { label: "Greek", code: "el" },
  { label: "Hebrew", code: "he" },
  { label: "Swedish", code: "sv" },
];

export default function App() {
  const [search, setSearch] = useState<string>("");
  const { t, lang, switchLanguage } = useLang();

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.label.toLowerCase().includes(search.toLowerCase())
  );

  const changeLanguage = async (code: string) => {
    try {
      console.log("Changing language...");

      await switchLanguage(code);
      await AsyncStorage.setItem("APP_LANGUAGE", code); // Save to storage
    } catch (err) {
      console.log("Language change error:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color="#aaa"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          // placeholder={t("select_language")} // Translated placeholder
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Map over filteredLanguages */}
      <View style={styles.grid}>
        {filteredLanguages.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.button}
            onPress={() => changeLanguage(item.code)}
          >
            <Text style={styles.buttonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const BUTTON_WIDTH = (width - 60) / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff6f0",
    paddingTop: 20,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    margin: 10,
    height: 45,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  button: {
    width: BUTTON_WIDTH,
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
});
