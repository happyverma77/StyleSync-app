import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import * as FileSystem from "expo-file-system";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import { backendUrl } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppContext from "@/ContextProvider/AppProvider";
import { useLang } from "@/utils/LangContext";

interface Errors {
  name?: string;
  gender?: string;
  region?: string;
  date?: string;
  image?: string;
}
interface UploadImageProps {
  uri: string;
  name?: string;
  type?: string;
}

const PersonalInfo: React.FC = () => {
  const { userData, fetchUserDetails } = useAppContext();
  const [image, setImage] = useState<string | null>(
    "https://randomuser.me/api/portraits/women/44.jpg"
  );
  const [name, setName] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [region, setRegion] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const { t, lang, switchLanguage } = useLang();
  // Dropdown state
  const [open, setOpen] = useState(false);
  const [genderItems, setGenderItems] = useState([
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ]);

  const onChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      const image = result.assets[0];
      if (!image) return;
      const uri = image.uri;
      const fileName = uri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(fileName);
      const ext = match?.[1]?.toLowerCase() || "jpg";
      const mimeType = `image/${ext}`;

      const formData = new FormData();
      formData.append("image", {
        uri,
        name: fileName,
        type: mimeType,
      } as any); // React Native requires `as any` for file objects

      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      // const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });

      try {
        const response = await axios.put(
          `${backendUrl}/api/v1/user/image/profile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchUserDetails();
        Alert.alert("Success", "Profile updated successfully");
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to upload image.");
      }
    }
  };

  const validate = (): Errors => {
    const newErrors: Errors = {};
    if (!name.trim()) newErrors.name = t("PersonalInfo.error.name");
    if (!gender) newErrors.gender = t("PersonalInfo.error.gender");
    if (!region.trim()) newErrors.region = t("PersonalInfo.error.region");
    if (!date) newErrors.date = t("PersonalInfo.error.date");
    return newErrors;
  };

  const handleSaveData = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = {
      name,
      gender,
      region,
      birthday: date,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.put(
        `${backendUrl}/api/v1/user/update-user`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUserDetails();
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.log("Error updating user:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setGender(userData.gender);
      setRegion(userData.region);
      setDate(new Date(userData.birthday));
      if (userData.profilePicture && userData.profilePicture !== "N/A") {
        setImage(userData.profilePicture);
      }
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={{
              uri: image || "https://randomuser.me/api/portraits/women/44.jpg",
            }}
            style={styles.profileImage}
          />
        ) : (
          <View style={[styles.profileImage, { backgroundColor: "#ccc" }]} />
        )}
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <AntDesign name="edit" size={20} color="white" />
        </TouchableOpacity>
      </View>
      {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

      {/* Name */}
      <Text style={styles.label}>{t("PersonalInfo.Name")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("PersonalInfo.PlaceHolderName")}
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Gender Dropdown */}
      <Text style={styles.label}>{t("PersonalInfo.Gender")}</Text>
      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          open={open}
          value={gender}
          items={genderItems}
          setOpen={setOpen}
          setValue={setGender}
          setItems={setGenderItems}
          labelStyle={{
            paddingLeft: 10,
            fontSize: 15,
            color: "black",
          }}
          style={{
            backgroundColor: "#fff",
            borderColor: "#ddd",
            borderRadius: 25,
            height: 45,
          }}
          dropDownContainerStyle={{
            backgroundColor: "#fefefe",
            borderColor: "#ddd",
            borderRadius: 20,
          }}
          selectedItemContainerStyle={{ backgroundColor: "#c2c0c0" }}
          placeholder={t("PersonalInfo.PlaceHolderGender")}
        />
      </View>
      {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

      {/* Region */}
      <Text style={styles.label}>{t("PersonalInfo.Region")}</Text>
      <TextInput
        style={styles.input}
        placeholder={t("PersonalInfo.PlaceHolderRegion")}
        value={region}
        onChangeText={setRegion}
      />
      {errors.region && <Text style={styles.errorText}>{errors.region}</Text>}

      {/* Birthday */}
      <Text style={styles.label}>{t("PersonalInfo.Birthday")}</Text>
      <Pressable style={styles.dateInput} onPress={() => setShow(true)}>
        <Text style={{ color: "#888" }}>
          {date.toLocaleDateString() == "Invalid Date"
            ? "Select Date"
            : date.toLocaleDateString() || "Select Date"}
        </Text>
      </Pressable>
      {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}

      {/* Submit */}
      <TouchableOpacity onPress={handleSaveData} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>
          {t("PersonalInfo.Save_Changes")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7f0",
    alignItems: "center",
    paddingTop: 30,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#f78c1e",
    borderRadius: 20,
    padding: 4,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 40,
    marginBottom: 4,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "90%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    color: "black",
    paddingVertical: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  errorText: {
    width: "90%",
    marginBottom: 10,
    color: "red",
    fontSize: 13,
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  dropdownWrapper: {
    width: "90%",
    zIndex: 1000,
    marginBottom: 10,
  },
  dateInput: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#f78c1e",
    paddingVertical: 15,
    marginTop: 20,
    paddingHorizontal: 100,
    width: "90%",
    borderRadius: 25,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default PersonalInfo;
