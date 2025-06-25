import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendUrl } from "@/utils/api";
import { useLang } from "@/utils/LangContext";

type Errors = {
  name?: string;
  email?: string;
  feedbackType?: string;
  message?: string;
};

export default function FeedbackForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  const feedbackOptions: string[] = ["Bug Report", "Feature Request", "Other"];
  const { t, lang, switchLanguage } = useLang();

  const validate = (): boolean => {
    const newErrors: Errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) newErrors.name = t("Feedback.error.name");
    if (!email.trim()) newErrors.email = t("Feedback.error.email");
    else if (!emailRegex.test(email))
      newErrors.email = t("Feedback.error.emailValid");
    if (!feedbackType)
      newErrors.feedbackType = t("Feedback.error.feedbackType");
    if (!message.trim()) newErrors.message = t("Feedback.error.message");
    else if (message.trim().length < 10)
      newErrors.message = t("Feedback.error.messageLength");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validate()) {
      console.log("Form submitted with:", {
        name,
        email,
        feedbackType,
        message,
      });
      // Implement actual submit logic here

      const token = await AsyncStorage.getItem("token"); // or the correct key where token is stored

      try {
        const response = await axios.post(
          `${backendUrl}/api/v1/user/feedback`,
          {
            name,
            email,
            feedbackType,
            message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setName("");
        setEmail("");
        setFeedbackType("");
        setMessage("");
        Alert.alert("Success", "Feedback sent successfully");
      } catch (error) {
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
      <View style={styles.formWrapper}>
        <View style={styles.stars}>
          {[...Array(5)].map((_, index) => (
            <Entypo
              key={index}
              name="star-outlined"
              size={20}
              color="#f7941d"
              style={{ marginHorizontal: 2 }}
            />
          ))}
        </View>

        <Text style={styles.title}>{t("Feedback.title")}</Text>
        <Text style={styles.description}>{t("Feedback.description")}</Text>

        {/* Name */}
        <Text style={styles.label}>{t("Feedback.Name")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("Feedback.Enter_name")}
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        {/* Email */}
        <Text style={styles.label}>{t("Feedback.Email")}</Text>
        <TextInput
          style={styles.input}
          placeholder={t("Feedback.Enter_email")}
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        {/* Feedback Type */}
        <Text style={styles.label}>{t("Feedback.FeedbackType")}</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: feedbackType ? "#333" : "#999" }}>
            {feedbackType || t("Feedback.Choose")}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#aaa"
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
        {errors.feedbackType && (
          <Text style={styles.error}>{errors.feedbackType}</Text>
        )}

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {feedbackOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    setFeedbackType(option);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalText}>{option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalOption, { backgroundColor: "#eee" }]}
              >
                <Text style={{ fontWeight: "bold" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Message */}
        <Text style={styles.label}>{t("Feedback.Your_Feedback")}</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder={t("Feedback.Message")}
          placeholderTextColor="#999"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />
        {errors.message && <Text style={styles.error}>{errors.message}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{t("Feedback.Send")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7f0",
    padding: 10,
  },
  formWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 88,
  },
  stars: {
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 14,
    color: "#333",
    justifyContent: "center",
  },
  dropdownIcon: {
    position: "absolute",
    right: 15,
    top: 12,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
    borderRadius: 10,
    paddingTop: 10,
  },
  button: {
    backgroundColor: "#f7941d",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalOption: {
    paddingVertical: 15,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
});
