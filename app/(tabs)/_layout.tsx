import { View, StyleSheet, Text, Platform } from "react-native";
import { Tabs, usePathname } from "expo-router";
import TabBar from "@/components/TabBar";
import Loader from "@/components/Loader";
import useAppContext from "@/ContextProvider/AppProvider";
import TopBar from "@/components/TopBar";
import { JSX, useEffect } from "react";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
import * as NavigationBar from "expo-navigation-bar";

import { useLang } from "@/utils/LangContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Define a mapping function type for route names

export default function TabLayout(): JSX.Element {
  const pathname = usePathname();
  const { t, lang, switchLanguage } = useLang();

  const {
    isLoading,
    cameraOpen,
    iskeyboardOpen,
    isFullScreen,
    setIsFullScreen,
    isAddTaskModalOpen,
    closetItemCount,
    setClosetItemCount,
    savedSuitCount,
    setsavedSuitCount,
    cartItemsCount,
    setcartItemsCount,
    putOnCount,
    setputOnCount,
    setIsAddTaskModalOpen,
  } = useAppContext();

  // useEffect(() => {
  //   NavigationBar.setBackgroundColorAsync("green").catch(console.log);
  //   NavigationBar.setButtonStyleAsync("light").catch(console.log);
  // }, []);
  const insets = useSafeAreaInsets();
  const getPageName = (path: string, t: (key: string) => string): string => {
    switch (path) {
      case "/RateUs":
        return t("topBar.Feedback_Requests");
      case "/Language":
        return t("topBar.Languages");
      case "/PasswordScreen":
        return t("topBar.Password");
      case "/Subscription":
        return t("topBar.Subscribe_StyleSync");
      case "/PutOnRecords":
        return t("topBar.Put_record") + " " + `(${putOnCount})`;
      case "/CalenderScreen":
        return t("topBar.Calendar");
      case "/SavedSuits":
        return t("topBar.Saved_Suits") + " " + `(${savedSuitCount})`;
      case "/FittingRoom":
        return t("topBar.Fitting_Room");
      case "/FittingRoomTryOn":
        return t("topBar.Fitting_Room");
      case "/Landing":
        return "Stylesync";
      case "/Shop":
        return t("topBar.Shop");
      case "/CartScreen":
        return t("topBar.Shopping_Cart") + " " + `(${cartItemsCount})`;
      case "/Settings":
        return t("topBar.Settings");
      case "/Search":
        return t("topBar.Search");
      case "/Closet":
        return t("topBar.Closet") + " " + `(${closetItemCount})`;
      case "/PersonalInfo":
        return t("topBar.Personal information");
      default:
        return "Stylesync";
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom:
            iskeyboardOpen ||
            pathname === "/CalenderScreen" ||
            pathname == "/FittingRoomTryOn"
              ? 0
              : isFullScreen
              ? cameraOpen
                ? 88
                : pathname === "/Landing"
                ? 120
                : 88
              : 120,
        },
      ]}
    >
      {Platform.OS === "ios" && (
        <View style={{ height: insets.top, backgroundColor: "#a2c2e2" }} />
      )}
      <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
        <TopBar heading={getPageName(pathname ?? "", t)} />
        <Tabs
          screenOptions={{
            headerShown: false,
            animation: "shift",
            tabBarStyle: { display: "none" },
          }}
        >
          <Tabs.Screen name="Landing" />
          <Tabs.Screen name="CalenderScreen" />
          <Tabs.Screen name="Closet" />
          <Tabs.Screen name="FittingRoom" />
          <Tabs.Screen name="FittingRoomTryOn" />
          <Tabs.Screen name="FollowUs" />
          <Tabs.Screen name="Language" />
          <Tabs.Screen name="PasswordScreen" />
          <Tabs.Screen name="PersonalInfo" />
          <Tabs.Screen name="PrivacyPolicy" />
          <Tabs.Screen name="ProductDetails" />
          <Tabs.Screen name="PutOnRecords" />
          <Tabs.Screen name="RateUs" />
          <Tabs.Screen name="SavedSuits" />
          <Tabs.Screen name="Search" />
          <Tabs.Screen name="Settings" />
          <Tabs.Screen name="Shop" />
          <Tabs.Screen name="Subscription" />
        </Tabs>
        {/* <Tabs screenOptions={{ headerShown: false }} /> */}
      </SafeAreaProviderCustom>
      {!(
        iskeyboardOpen ||
        (isAddTaskModalOpen && pathname == "/CalenderScreen")
      ) &&
        pathname !== "/FittingRoomTryOn" && <TabBar />}
      {/* {!(iskeyboardOpen || isAddTaskModalOpen) &&
        pathname !== "/FittingRoomTryOn" && <TabBar />} */}

      {isLoading && <Loader isLoading={isLoading} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
});
