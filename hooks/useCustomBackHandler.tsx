import { useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { useNavigation, EventArg } from "@react-navigation/native";
import { router } from "expo-router";

const useCustomBackHandler = (previousPath) => {
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack() && previousPath) {
        router.replace(previousPath);
        return true;
      } else {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, previousPath]);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      (e: EventArg<"beforeRemove", true>) => {
        if (!navigation.canGoBack() || !previousPath) {
          e.preventDefault(); // ✅ now works
          Alert.alert("Hold on!", "Are you sure you want to exit?", [
            { text: "Cancel", style: "cancel" },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ]);
        }
      }
    );

    return unsubscribe;
  }, [navigation, previousPath]);
};

export default useCustomBackHandler;
