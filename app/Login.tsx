import React, { useState } from "react";
import { View, Text, TextInput, Pressable, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { backendUrl } from "@/utils/api";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";

const Login = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showToast = (type = "success", message = "Success") => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const HandleLogin = async () => {
    try {
      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/signin",
        {
          email,
          password,
        }
      );

      const { metadata, responseData } = response.data;

      if (metadata?.success) {
        await AsyncStorage.setItem("token", responseData.token);
        await AsyncStorage.setItem(
          "userDetails",
          JSON.stringify(responseData.userDetails)
        );

        showToast("success", metadata.message || "Login successful!");
        router.replace("/Landing");
      } else {
        showToast("error", metadata.message || "Login failed.");
      }
    } catch (error) {
      console.log(error.response?.data);

      const message =
        error.response?.data?.metadata?.message ||
        "Something went wrong during login.";
      showToast("error", message);
    }
  };

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="white">
      <View className="flex-1 bg-white">
        <View className="pt-[100px] px-4 max-w-[768px] mx-auto w-full">
          <Text className="text-[30px] font-semibold text-center text-[#2E2E2E]  ">
            Login
          </Text>
          <Text className="text-center text-lg text-[#2E2E2E] mt-[10px]">
            HI! Welcome back, you have been missed
          </Text>

          <View className="mt-[30px] flex-col gap-[15px]">
            <View>
              <Text className="text-sm text-black mb-[6px]">Username</Text>
              <TextInput
                className="border border-[#D8DADC] text-[#2E2E2E] rounded-full h-12 px-4 py-2 text-base outline-none leading-normal"
                placeholder="example@gmail.com"
                keyboardType="email-address"
                style={{ textTransform: "lowercase" }}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-sm text-black mb-[6px]">Password</Text>
              <View className="flex-row items-center border border-[#D8DADC] rounded-full px-4 ">
                <TextInput
                  className="flex-1 text-base text-[#2E2E2E] outline-none h-12 px-0 leading-normal"
                  placeholder="Enter password"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
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
            <Pressable onPress={() => router.replace("/ForgotPassword")}>
              <Text className="text-[#D67D2A] text-lg text-right font-medium underline">
                Forgot Password?
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={HandleLogin}
            className="bg-[#D67D2A] mt-[30px] rounded-full py-[13px] px-4 flex items-center justify-center"
          >
            <Text className="text-white text-center font-semibold text-[22px]">
              Login
            </Text>
          </Pressable>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-[#D8DADC]" />
            <Text className="mx-4 text-sm text-[#4d4d4d]">Or Login with</Text>
            <View className="flex-1 h-px bg-[#D8DADC]" />
          </View>

          <View className="flex-row gap-2 justify-between space-x-[15px]">
            <Pressable className="flex-1 border border-[#D8DADC] rounded-[10px] items-center justify-center py-3">
              <FontAwesome name="facebook" size={20} color="#3b5998" />
            </Pressable>

            <Pressable className="flex-1 border border-[#D8DADC] rounded-[10px] items-center justify-center py-3">
              <Ionicons name="logo-google" size={20} color="#DB4437" />
            </Pressable>

            <Pressable className="flex-1 border border-[#D8DADC] rounded-[10px] items-center justify-center py-3">
              <Ionicons name="logo-apple" size={20} color="#000" />
            </Pressable>
          </View>

          <View className="w-full items-center mt-[31px]">
            <View className="flex-row">
              <Text className="text-[#2E2E2E] text-lg font-medium text-center">
                Don’t have an account?{" "}
              </Text>
              <Pressable onPress={() => router.replace("/SignUp")}>
                <Text className="text-[#D67D2A] underline text-lg font-medium">
                  Signup
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaProviderCustom>
  );
};

export default Login;
