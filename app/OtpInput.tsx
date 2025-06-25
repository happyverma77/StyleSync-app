import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  TextInput as RNTextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import axios from "axios";
import { backendUrl } from "@/utils/api";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";

const OtpInput: React.FC = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const inputRefs = useRef<Array<RNTextInput | null>>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string>("");

  const handleChange = (text: string, index: number) => {
    if (/^\d$/.test(text) || text === "") {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      setError(""); // Clear error when user types

      if (text && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const showToast = (type = "success", message = "Success") => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const handleVerifyOtp = async (otp, email) => {
    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp) {
      showToast("error", "Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/verify-otp",
        {
          email: email,
          otp: trimmedOtp,
        }
      );

      if (response.data?.metadata?.success) {
        showToast("success", "OTP verified successfully!");
        router.replace("/Login"); // or any screen you want to redirect to
      } else {
        showToast(
          "error",
          response.data?.metadata?.message || "Verification failed."
        );
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.metadata?.message || "An error occurred.";
      showToast("error", errMsg);
    }
  };
  const handleVerify = () => {
    const finalOtp = otp.join("");
    Keyboard.dismiss();

    if (otp.includes("")) {
      setError("Please enter all 4 digits.");
      return;
    }

    setError("");
    // Submit OTP logic here
    handleVerifyOtp(finalOtp, email);
  };

  const resendOtp = async () => {
    try {
      const response = await axios.post(
        "https://stylesyncchanging.app/api/v1/user/resend-otp",
        {
          email,
        }
      );

      if (response.data?.metadata?.success) {
        showToast("success", "OTP resent successfully!");
        // No redirect, unless needed
      } else {
        showToast(
          "error",
          response.data?.metadata?.message || "Failed to resend OTP."
        );
      }
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.metadata?.message ||
          "Something went wrong while resending OTP."
      );
    }
  };

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="white">
      <View
        className="flex-1 bg-white "
        style={{ paddingTop: Platform.OS !== "android" ? 60 : 0 }}
      >
        <Pressable
          onPress={() => router.back()}
          className=" border border-[#D8DADC] m-5 rounded-full flex items-center justify-center w-[47px] h-[47px] mb-[36px]"
        >
          <Ionicons name="arrow-back" size={24} color="#C0C0C0" />
        </Pressable>
        <View className="pt-[40px] px-6 flex-1 justify-start items-center">
          <Text className="text-[22px] font-bold text-black mb-2">
            Verify code
          </Text>

          <Text className="text-base text-center text-[#2E2E2E]">
            Please enter the code we have just sent on{" "}
            <Text className="text-[#D67D2A]">{email}</Text>
          </Text>

          <View className="flex-row justify-between w-full max-w-[240px] mt-10 mb-2">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="numeric"
                maxLength={1}
                className="border border-[#D8DADC] text-[#2E2E2E] text-[20px] text-center w-[50px] h-[50px] rounded-[10px]"
              />
            ))}
          </View>

          {/* Error Message */}
          {error !== "" && (
            <Text className="text-red-500 text-sm mb-3">{error}</Text>
          )}

          <Text className="text-[#2E2E2E] text-base mb-1">
            Don’t receive OTP?
          </Text>
          <Pressable onPress={resendOtp}>
            <Text className="text-[#D67D2A] text-base font-medium underline mb-6">
              Resend Code
            </Text>
          </Pressable>

          <Pressable
            onPress={handleVerify}
            className="bg-[#D67D2A] rounded-full w-full max-w-[240px] py-[14px] flex items-center"
          >
            <Text className="text-white font-semibold text-lg">Verify</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaProviderCustom>
  );
};

export default OtpInput;
