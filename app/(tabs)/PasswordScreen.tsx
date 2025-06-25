import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLang } from "@/utils/LangContext";

interface Errors {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordScreen = () => {
  const { t, lang, switchLanguage } = useLang();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [errors, setErrors] = useState<Errors>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validate = (): boolean => {
    let valid = true;
    let tempErrors: Errors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!oldPassword.trim()) {
      tempErrors.oldPassword = t("Password.error.oldPassword");
      valid = false;
    }

    if (!newPassword.trim()) {
      tempErrors.newPassword = t("Password.error.newPassword");
      valid = false;
    } else if (newPassword.length < 8) {
      tempErrors.newPassword = t("Password.error.passwordLength");
      valid = false;
    } else if (newPassword === oldPassword) {
      tempErrors.newPassword = t("Password.error.passwordSame");
      valid = false;
    }

    if (!confirmPassword.trim()) {
      tempErrors.confirmPassword = t("Password.error.confirmPassword");
      valid = false;
    } else if (confirmPassword !== newPassword) {
      tempErrors.confirmPassword = t("Password.error.passwordMatch");
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      console.log("Password updated successfully.");

      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      try {
        const response = await axios.put(
          `https://stylesyncchanging.app/api/v1/user/change-password`,
          {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Alert.alert("Success", "Password updated successfully");
      } catch (error: any) {
        Alert.alert(
          "Error",
          error?.response?.data?.metadata?.message ||
            "Something went wrong. Please try again."
        );
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.title}>{t("Password.title")}</Text>
      </View>
      <View style={[styles.center, { marginBottom: 40 }]}>
        <Text style={styles.subtitle}>{t("Password.description1")}</Text>
        <Text style={styles.subtitle}>{t("Password.description2")}</Text>
      </View>

      {/* Old Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("Password.OldPassword")}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showOldPassword}
            placeholder="••••••••"
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity
            onPress={() => setShowOldPassword(!showOldPassword)}
          >
            <Ionicons
              name={showOldPassword ? "eye-off" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.oldPassword ? (
          <Text style={styles.errorText}>{errors.oldPassword}</Text>
        ) : null}
      </View>

      {/* New Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("Password.NewPassword")}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showNewPassword}
            placeholder="@test12345!"
            placeholderTextColor="#888"
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? "eye-off" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.newPassword ? (
          <Text style={styles.errorText}>{errors.newPassword}</Text>
        ) : null}
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("Password.ConfirmPassword")}</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showConfirmPassword}
            placeholder="@test123#45!"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{t("Password.Save")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5EE",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 20,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#FF8C00",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
});

export default PasswordScreen;
