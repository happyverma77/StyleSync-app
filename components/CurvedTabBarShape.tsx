import useAppContext from "@/ContextProvider/AppProvider";
import { usePathname } from "expo-router";
import React from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";

interface TabItem {
  name: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

interface CurvedTabBarProps {
  height?: number;
  tabs: TabItem[];
  activeTabIndex?: number;
  color?: string;
  activeColor?: string;
  inactiveColor?: string;
  curveDepth?: number;
  bottomPadding?: number;
}

const CurvedTabBarShape: React.FC<CurvedTabBarProps> = ({
  height = 132, // Default height as requested
  tabs = [],
  activeTabIndex = 0,
  color = "#D67D2A",
  activeColor = "#ffffff",
  inactiveColor = "#fcd3a7",
  curveDepth = 0.5,
  bottomPadding = Platform.select({ ios: 0, android: 0 }), // Fixed Platform usage
}) => {
  const { isFullScreen, cameraOpen } = useAppContext();
  const { width: screenWidth } = Dimensions.get("window");
  const validatedCurveDepth = Math.max(0, Math.min(1, curveDepth));
  const tabWidth = screenWidth / Math.max(tabs.length, 1); // Prevent division by zero

  const pathData = `
    M 0,${height}
    L 0,0
    Q ${screenWidth / 2},${height * validatedCurveDepth} ${screenWidth},0
    L ${screenWidth},${height}
    Z
  `;
  const pathname = usePathname();

  return (
    <View
      style={[
        styles.safeAreaContainer,
        {
          height: height + (bottomPadding || 0),
          paddingBottom: bottomPadding,
          backgroundColor: cameraOpen
            ? "transparent"
            : pathname == "/Landing"
            ? "rgba(255, 255, 255, 1)"
            : isFullScreen
            ? "transparent"
            : "rgba(255, 255, 255, 1)",
        },
      ]}
    >
      <View style={[styles.svgContainer, { height }]}>
        <Svg
          width={screenWidth}
          height={height}
          viewBox={`0 0 ${screenWidth} ${height}`}
          preserveAspectRatio="none"
        >
          <Path d={pathData} fill={color} />
        </Svg>
      </View>

      <View style={[styles.contentOverlay, { height }]}>
        {tabs.map((tab, index) => (
          <View
            key={`${tab.name}_${index}`}
            style={[
              styles.tabButton,
              {
                width: tabWidth,
              },
            ]}
          >
            {tab?.isCenter && <View style={styles.fittingRoomBackground} />}
            <Pressable
              onPress={tab.onPress}
              style={[
                styles.tabButton,
                {
                  width: tabWidth,
                  opacity: index === activeTabIndex ? 1 : 0.7,
                },
              ]}
            >
              {tab.icon && (
                <View style={styles.iconContainer}>
                  {React.cloneElement(tab.icon as React.ReactElement, {
                    color: index === activeTabIndex ? "#000" : "#000",
                    size: 24,
                  })}
                </View>
              )}
              <Text
                style={[
                  styles.tabText,
                  {
                    color: index === activeTabIndex ? "#FFF" : "#fff",
                    marginTop: tab.icon ? 6 : 0,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {tab.name}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: "rgba(255, 255, 255, 1)", // Transparent white
    // backgroundColor: "transparent",
  },

  svgContainer: {
    position: "absolute",
    width: "100%",
    top: 0,
  },
  contentOverlay: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "space-around",
    paddingHorizontal: 2,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    paddingTop: 12,
    paddingBottom: 5,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: "95%",
  },
  iconContainer: {
    marginBottom: 4,
    backgroundColor: "#EEEEEE",
    borderRadius: 50,
    width: 39,
    height: 39,
    display: "flex",
    alignItems: "center",
    zIndex: 2,
    justifyContent: "center",
  },
  fittingRoomBackground: {
    ...StyleSheet.absoluteFillObject,
    left: -10,
    right: -10,
    top: -10,
    bottom: -30,
    backgroundColor: "#E09045",
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    zIndex: 1,
  },
});

export default React.memo(CurvedTabBarShape);
