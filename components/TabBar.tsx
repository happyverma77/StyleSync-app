import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import CurvedTabBarShape from "./CurvedTabBarShape";
import {
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLang } from "@/utils/LangContext";

const TabBar = () => {
  const [activeTab, setActiveTab] = useState(2);
  const router = useRouter();

  const { t, lang, switchLanguage } = useLang();
  const tabs = [
    {
      name: t("TabBar.Closet"),
      onPress: () => {
        setActiveTab(0);
        router.replace("/Closet");
      },
      icon: <MaterialIcons name="checkroom" />,
    },
    {
      name: t("TabBar.Search"),
      onPress: () => {
        setActiveTab(1);
        router.replace("/Search");
      },
      icon: <Ionicons name="search-outline" />,
    },
    {
      isCenter: true,
      name: t("TabBar.FittingRoom"),
      onPress: () => {
        setActiveTab(2);
        router.replace("/FittingRoom");
      },
      icon: <MaterialIcons name="meeting-room" />,
    },
    {
      name: t("TabBar.Shop"),
      onPress: () => {
        setActiveTab(3);
        router.replace("/Shop");
      },
      icon: <Ionicons name="storefront-outline" />,
    },
    {
      name: t("TabBar.Settings"),
      onPress: () => {
        setActiveTab(4);
        router.replace("/Settings");
      },
      icon: <MaterialCommunityIcons name="cog-outline" />,
    },
  ];

  return (
    <>
      <CurvedTabBarShape
        height={120}
        tabs={tabs}
        activeTabIndex={activeTab}
        color="#D67D2A"
        activeColor="#FFFFFF"
        inactiveColor="#fcd3a7"
        curveDepth={0.28}
      />
    </>
  );
};

export default TabBar;
