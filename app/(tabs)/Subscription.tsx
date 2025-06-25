import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLang } from "@/utils/LangContext";

const FeatureItem = ({ text }) => (
  <View className="flex-row items-start mb-[10px]">
    <Ionicons
      name="checkmark-circle-outline"
      size={20}
      color="#000"
      style={{ marginRight: 10 }}
    />
    <Text className="text-base text-black flex-1">{text}</Text>
  </View>
);

const PricingCard = ({ title, price, billingCycle, features }) => (
  <View className="bg-white rounded-xl px-5 py-6 w-full shadow mb-5">
    <Text className="text-center text-[30px] font-semibold">{title}</Text>
    <Text className="text-center text-[#D67D2A] text-[30px] font-bold mt-2">
      ${price}
      <Text className="text-[20px] font-medium"> /{billingCycle}</Text>
    </Text>
    <View className="h-px bg-[#DEDEDE] my-5" />
    {features.map((item, idx) => (
      <FeatureItem key={idx} text={item} />
    ))}
    <TouchableOpacity className="bg-[#D67D2A] mt-4 py-[14px] rounded-full items-center">
      <Text className="text-white font-semibold text-[22px]">Buy Now</Text>
    </TouchableOpacity>
  </View>
);

const Index = () => {
  const { t } = useLang();
  const [isMonthly, setIsMonthly] = useState(true);

  const proFeaturesMonthly = [
    `200 ${t("Subscribe.tokens")}/month (=50 ${t("Subscribe.changingTimes")})`,
    `∞ ${t("Subscribe.createYourOwnTag")}`,
    `${t("Subscribe.unlockCalendar")}`,
    `100 ${t("Subscribe.putOnRecord")}`,
  ];

  const proFeaturesYearly = [
    `2400 ${t("Subscribe.tokens")}/year (=600 ${t("Subscribe.changingTimes")})`,
    `∞ ${t("Subscribe.createYourOwnTag")}`,
    `${t("Subscribe.unlockCalendar")}`,
    `1200 ${t("Subscribe.putOnRecord")}`,
  ];

  const basicFeaturesMonthly = [
    `125 ${t("Subscribe.tokens")}/month (=25 ${t("Subscribe.changingTimes")})`,
    `15 ${t("Subscribe.createYourOwnTag")}`,
    `${t("Subscribe.unlockCalendar")}`,
    `20 ${t("Subscribe.putOnRecord")}`,
  ];

  const basicFeaturesYearly = [
    `1500 ${t("Subscribe.tokens")}/year (=300 ${t("Subscribe.changingTimes")})`,
    `180 ${t("Subscribe.createYourOwnTag")}`,
    `${t("Subscribe.unlockCalendar")}`,
    `240 ${t("Subscribe.putOnRecord")}`,
  ];

  return (
    <View className="h-full block bg-[#fff7f0]">
      <View className="max-w-[768px] mx-auto w-full pt-5 px-5">
        {/* Toggle Tabs */}
        <View className="flex-row mb-8 bg-[#d67d2a26] rounded-[10px]">
          <TouchableOpacity
            onPress={() => setIsMonthly(true)}
            className={`px-6 py-3 flex-1 rounded-[10px] ${
              isMonthly ? "bg-[#D67D2A]" : ""
            }`}
          >
            <Text
              className={`text-lg font-bold text-center ${
                isMonthly ? "text-white" : "text-black"
              }`}
            >
              {t("Subscribe.Monthly")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsMonthly(false)}
            className={`px-6 py-3 flex-1 rounded-[10px] ${
              !isMonthly ? "bg-[#D67D2A]" : ""
            }`}
          >
            <Text
              className={`text-lg font-bold text-center ${
                !isMonthly ? "text-white" : "text-black"
              }`}
            >
              {t("Subscribe.Yearly")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pricing Cards */}
        <ScrollView
          style={{ marginBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <PricingCard
            title={t("Subscribe.Pro")}
            price={isMonthly ? "20" : "200"}
            billingCycle={
              isMonthly ? t("Subscribe.month") : t("Subscribe.year")
            }
            features={isMonthly ? proFeaturesMonthly : proFeaturesYearly}
          />
          <PricingCard
            title={t("Subscribe.Basic")}
            price={isMonthly ? "8" : "80"}
            billingCycle={
              isMonthly ? t("Subscribe.month") : t("Subscribe.year")
            }
            features={isMonthly ? basicFeaturesMonthly : basicFeaturesYearly}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Index;
