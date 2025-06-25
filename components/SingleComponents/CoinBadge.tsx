import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useAppContext from "@/ContextProvider/AppProvider";
import { Image } from "react-native";

const CoinBadge = () => {
  const { userData } = useAppContext();
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../../assets/images/coin.png")}
        />
      </View>
      <Text style={styles.text}>{userData.token || "0"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f7f7d5", // Yellow
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  iconContainer: {
    // backgroundColor: "white",
    padding: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default CoinBadge;
