import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { backendUrl } from "@/utils/api";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errors, setErrors] = useState<{
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);

  const router = useRouter();

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) newErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

    if (!newPassword) newErrors.newPassword = "New password is required.";
    else if (newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password.";
    else if (newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/forgot-password",
        {
          email,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );

      Alert.alert("Success", "Password updated successfully.");
      router.replace("/Login");
    } catch (error: any) {
      console.log(error);
      const msg = error.response?.data?.message || "Something went wrong.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="white">
      <View
        className="flex-1 bg-white text-black"
        style={{
          paddingTop: Platform.OS !== "android" ? 50 : 0,
        }}
      >
        <View className="p-5 max-w-[768px] mx-auto w-full">
          <Pressable
            onPress={() => router.replace("/Login")}
            className="border border-[#D8DADC] rounded-full flex items-center justify-center w-[47px] h-[47px] mb-[36px]"
          >
            <Ionicons name="arrow-back" size={24} color="#C0C0C0" />
          </Pressable>

          <Text className="text-[30px] text-black font-semibold text-center">
            New Password
          </Text>
          <Text className="text-center text-lg text-[#2E2E2E] mt-[10px]">
            Your new password must be different from previously used passwords.
          </Text>

          <View className="mt-[30px] flex-col gap-[15px]">
            {/* Email Field */}
            <View>
              <Text className="text-sm text-black mb-[6px]">Email</Text>
              <View className="flex-row items-center border border-[#D8DADC] rounded-full px-4">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  className="flex-1 text-base px-0 text-[#2E2E2E] h-12 leading-normal"
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* New Password Field */}
            <View>
              <Text className="text-sm text-black mb-[6px]">New Password</Text>
              <View className="flex-row items-center border border-[#D8DADC] rounded-full px-4">
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  className="flex-1 text-base px-0 text-[#2E2E2E] h-12 leading-normal"
                  placeholder="New password"
                  secureTextEntry={!newPasswordVisible}
                />
                <Pressable
                  onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                >
                  <Ionicons
                    name={
                      newPasswordVisible ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="gray"
                  />
                </Pressable>
              </View>
              {errors.newPassword && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </Text>
              )}
            </View>

            {/* Confirm Password Field */}
            <View>
              <Text className="text-sm text-black mb-[6px]">
                Confirm Password
              </Text>
              <View className="flex-row items-center border border-[#D8DADC] rounded-full px-4">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="flex-1 text-base text-[#2E2E2E] px-0 h-12 leading-normal"
                  placeholder="Confirm password"
                  secureTextEntry={!confirmPasswordVisible}
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
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            className="bg-[#D67D2A] mt-[30px] rounded-full py-[13px] px-4 flex items-center justify-center"
          >
            <Text className="text-white text-center font-semibold text-[22px]">
              {loading ? "Submitting..." : "Submit"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaProviderCustom>
  );
};

export default ForgotPassword;
