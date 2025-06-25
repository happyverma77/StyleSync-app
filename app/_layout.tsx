import { router, Stack } from "expo-router";
import "../global.css";
import { AppProvider } from "../ContextProvider/AppProvider";
import Toast from "react-native-toast-message";
import usePreviousPathname from "@/hooks/usePreviousPathname";
import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { useNavigation } from "@react-navigation/native";
import useCustomBackHandler from "@/hooks/useCustomBackHandler";
import { LangProvider } from "@/utils/LangContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
export default function RootLayout() {
  // const previousPath = usePreviousPathname();
  // useCustomBackHandler(previousPath);

  return (
    <>
      <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
        <AppProvider>
          <LangProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </LangProvider>
        </AppProvider>
        <Toast topOffset={50} />
      </SafeAreaProviderCustom>
    </>
  );
}
