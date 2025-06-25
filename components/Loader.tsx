import React, { FC } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

interface LoaderProps {
  isLoading: boolean;
}

const Loader: FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;
