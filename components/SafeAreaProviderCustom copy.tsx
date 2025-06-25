// // import React, { ReactNode } from "react";
// // import { StatusBar, StyleSheet, ViewStyle } from "react-native";
// // import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// // interface SafeAreaProviderCustomProps {
// //   children: ReactNode;
// //   bgcolor?: string;
// //   barStyle?: "light-content" | "dark-content";
// //   statusBarColor?: string;
// // }

// // const SafeAreaProviderCustom: React.FC<SafeAreaProviderCustomProps> = ({
// //   children,
// //   bgcolor = "#a2c2e2",
// //   barStyle = "dark-content",
// //   statusBarColor = "#f5f5f5",
// // }) => {
// //   return (
// //     <SafeAreaProvider>
// //       <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
// //       <View style={[styles.safeArea]} edges={["top"]}>
// //         {children}
// //       </View>
// //     </SafeAreaProvider>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //   } as ViewStyle,
// // });

// // export default SafeAreaProviderCustom;
// import React, { ReactNode } from "react";
// import {
//   Platform,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
//   ViewStyle,
// } from "react-native";
// import {
//   SafeAreaProvider,
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";

// interface SafeAreaProviderCustomProps {
//   children: ReactNode;
//   bgcolor?: string;
//   barStyle?: "light-content" | "dark-content";
//   statusBarColor?: string;
// }

// const SafeAreaWrapper: React.FC<SafeAreaProviderCustomProps> = ({
//   children,
//   bgcolor = "#a2c2e2",
//   barStyle = "dark-content",
//   statusBarColor = "#f5f5f5",
// }) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <View style={[styles.safeArea]}>
//       {/* Simulate status bar background on iOS */}

//       {/* <Text>'fff</Text> */}
//       <StatusBar backgroundColor={statusBarColor} barStyle={barStyle} />
//       {children}
//     </View>
//   );
// };

// const SafeAreaProviderCustom: React.FC<SafeAreaProviderCustomProps> = (
//   props
// ) => {
//   return (
//     <SafeAreaProvider>
//       <SafeAreaWrapper {...props} />
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   } as ViewStyle,
// });

// export default SafeAreaProviderCustom;

// import React, { ReactNode } from "react";
// import { Platform, StatusBar, StyleSheet, ViewStyle, View } from "react-native";
// import {
//   Edge,
//   SafeAreaProvider,
//   SafeAreaView,
// } from "react-native-safe-area-context";

// interface SafeAreaProviderCustomProps {
//   children: ReactNode;
//   bgcolor?: string;
//   barStyle?: "light-content" | "dark-content";
//   statusBarColor?: string;
// }

// const SafeAreaWrapper: React.FC<SafeAreaProviderCustomProps> = ({
//   children,
//   bgcolor = "#a2c2e2",
//   barStyle = "dark-content",
//   statusBarColor = "#f5f5f5",
// }) => {
//   const edges: Edge[] = Platform.OS === "android" ? ["top", "bottom"] : ["top"];
//   return (
//     <View
//       style={[styles.safeArea, { backgroundColor: bgcolor }]}
//       edges={[...edges]}
//     >
//       <StatusBar
//         translucent={Platform.OS === "android"}
//         backgroundColor={
//           Platform.OS === "android" ? statusBarColor : "transparent"
//         }
//         barStyle={barStyle}
//       />
//       <View style={styles.content}>{children}</View>
//     </View>
//   );
// };

// const SafeAreaProviderCustom: React.FC<SafeAreaProviderCustomProps> = (
//   props
// ) => {
//   return (
//     <SafeAreaProvider>
//       <SafeAreaWrapper {...props} />
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//   } as ViewStyle,
//   content: {
//     flex: 1,
//   } as ViewStyle,
// });

// export default SafeAreaProviderCustom;

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
        <View
          style={{ height: insets.bottom || 48, backgroundColor: "#424242" }}
        />
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
