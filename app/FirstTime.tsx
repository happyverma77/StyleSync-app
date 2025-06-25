import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import SafeAreaProviderCustom from "../components/SafeAreaProviderCustom";
const FirstTime = () => {
  const router = useRouter();
  return (
    <SafeAreaProviderCustom bgcolor="white" statusBarColor="white">
      <ScrollView>
        <View
          className="flex-1 bg-white  h-screen px-4 items-center"
          style={{ paddingTop: Platform.OS !== "android" ? 60 : 0 }}
        >
          <Text className="text-[25px] font-bold mb-1">Stylesync</Text>

          <View className="flex-row gap-[13px] mb-[34px]">
            <Image
              source={require("../assets/images/sp1.png")}
              style={{
                height: 300,
                width: 150,
                borderRadius: 999,
                marginTop: 30,
              }}
            />
            <View>
              <Image
                source={require("../assets/images/sp2.png")}
                style={{
                  height: 160,
                  width: 120,
                  borderRadius: 999,
                  marginTop: 30,
                }}
              />
              <Image
                source={require("../assets/images/sp3.png")}
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 999,
                  marginTop: 30,
                }}
              />
            </View>
          </View>

          <Text className="text-[30px] font-semibold text-center">
            Welcome to Clothing Image Generation!
          </Text>
          <Text className="text-lg text-[#2E2E2E] text-center mt-[15px] mb-[25px]">
            Design. Customize. Wear the Future.
          </Text>

          {/* Full width button */}
          <TouchableOpacity
            onPress={() => router.replace("/SignUp")}
            className="bg-[#D67D2A] py-[23.5px] rounded-full mt-3 w-full flex items-center justify-center"
          >
            <Text className="text-white font-bold text-[22px]">
              Let’s Get Started
            </Text>
          </TouchableOpacity>

          <View className="w-full items-center mt-5">
            <View className="flex-row">
              <Text className="text-[#2E2E2E] text-lg font-medium">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.replace("/Login")}>
                <Text className="text-[#D67D2A] font-semibold underline text-lg">
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProviderCustom>
  );
};

export default FirstTime;
