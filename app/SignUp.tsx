import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";
import { backendUrl } from "@/utils/api";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";

const SignUp = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleEmailChange = (text) => setEmail(text);
  const handlePasswordChange = (text) => setPassword(text);
  const handleConfirmPasswordChange = (text) => setConfirmPassword(text);

  const showToast = (type = "success", message = "Success") => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const handleSignUp = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      showToast("error", "Please fill out all fields.");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      showToast("error", "Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/signup",
        {
          email: trimmedEmail,
          name: trimmedEmail.split("@")[0],
          password: trimmedPassword,
        }
      );

      if (response.data.metadata.success) {
        showToast("success", "Signed up successfully!");
        //  router.replace("/OtpInput");
        router.replace({
          pathname: "/OtpInput",
          params: { email: trimmedEmail }, // Passing the data
        });
      } else {
        showToast("error", "Signup failed. Please try again.");
      }
    } catch (error) {
      if (error.response.data.metadata.status == 403) {
        showToast("success", error.response.data.metadata.message);
        router.replace({
          pathname: "/OtpInput",
          params: { email: trimmedEmail }, // Passing the data
        });
        return;
      }

      showToast(
        "error",
        error.response?.data?.metadata?.message ||
          "An error occurred. Please try again."
      );
    }
  };

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="white">
      <View className="flex-1 bg-white px-6">
        <View className="pt-[100px] px-4 max-w-[768px] mx-auto w-full">
          <Text className="text-[30px] font-semibold text-center text-[#2E2E2E]">
            Create Account
          </Text>
          <Text className="text-center text-lg text-[#2E2E2E] mt-[10px]">
            Fill your information below or register{"\n"}with your social
            account
          </Text>

          <View className="mt-[30px] flex-col gap-[15px]">
            <View>
              <Text className="text-sm text-black mb-[6px]">Email</Text>
              <TextInput
                className="border border-[#D8DADC] text-[#2E2E2E] rounded-full px-4 text-base outline-none h-12 leading-normal"
                placeholder="example@gmail.com"
                keyboardType="email-address"
                style={{ textTransform: "lowercase" }}
                value={email}
                onChangeText={handleEmailChange}
              />
            </View>

            <View>
              <Text className="text-sm text-black mb-[6px]">
                Create a password
              </Text>
              <View className="flex-row items-center border border-[#D8DADC] rounded-full px-4">
                <TextInput
                  className="flex-1 text-base text-[#2E2E2E] outline-none h-12 leading-normal"
                  placeholder="must be 8 characters"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="gray"
                  />
                </Pressable>
              </View>
            </View>

            <View>
              <Text className="text-sm text-black mb-[6px]">
                Confirm password
              </Text>
              <View className="flex-row items-center border border-[#D8DADC] rounded-full px-4">
                <TextInput
                  className="flex-1 text-base text-[#2E2E2E] h-12 outline-0 leading-normal"
                  placeholder="Repeat password"
                  secureTextEntry={!confirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={handleConfirmPasswordChange}
                />
                <Pressable
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  <Ionicons
                    name={
                      confirmPasswordVisible ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="gray"
                  />
                </Pressable>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="bg-[#D67D2A] mt-[30px] rounded-full py-[13px] px-4 flex items-center justify-center"
            onPress={handleSignUp}
          >
            <Text className="text-white text-center font-semibold text-[22px]">
              Sign up
            </Text>
          </TouchableOpacity>

          <View className="w-full items-center mt-[36px]">
            <View className="flex-row">
              <Text className="text-[#2E2E2E] text-lg font-medium">
                Already have an account?{" "}
              </Text>
              <Pressable onPress={() => router.replace("/Login")}>
                <Text className="text-[#D67D2A] underline text-lg font-medium">
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaProviderCustom>
  );
};

export default SignUp;
