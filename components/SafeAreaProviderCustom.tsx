import React, { ReactNode } from "react";
import { Platform, StatusBar, StyleSheet, View, ViewStyle } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface SafeAreaProviderCustomProps {
  children: ReactNode;
  bgcolor?: string;
  barStyle?: "light-content" | "dark-content";
  statusBarColor?: string;
}

const SafeAreaWrapper: React.FC<SafeAreaProviderCustomProps> = ({
  children,
  bgcolor = "#a2c2e2",
  barStyle = "dark-content",
  statusBarColor = "#f5f5f5",
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: "white" }]}>
      {/* Top safe area */}

      {Platform.OS === "android" && (
        <View style={{ height: insets.top, backgroundColor: bgcolor }} />
      )}
      {/* Status bar */}
      <StatusBar
        backgroundColor={
          Platform.OS === "android" ? statusBarColor : "transparent"
        }
        barStyle={barStyle}
        translucent={Platform.OS === "android"}
      />

      {/* Main content */}
      <View style={styles.safeAreaContent}>{children}</View>

      {/* Bottom safe area */}
      {Platform.OS === "android" && (
        <View style={{ height: insets.bottom, backgroundColor: "#424242" }} />
      )}
    </View>
  );
};

const SafeAreaProviderCustom: React.FC<SafeAreaProviderCustomProps> = (
  props
) => {
  return (
    <SafeAreaProvider>
      <SafeAreaWrapper {...props} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  safeAreaContent: {
    flex: 1,
  } as ViewStyle,
});

export default SafeAreaProviderCustom;
