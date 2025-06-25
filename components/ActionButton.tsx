import React, { useState } from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function ActionButton({ handleFun }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop: only shown when open */}
      {open && (
        <Pressable onPress={() => setOpen(false)} style={styles.backdrop} />
      )}

      <View style={styles.fabContainer} pointerEvents="box-none">
        {open && (
          <View style={styles.menuContainer}>
            <Pressable
              style={styles.menuButton}
              onPress={() => {
                handleFun("Gallery");
                setOpen(false);
              }}
            >
              <Ionicons name="image" size={24} color="white" />
            </Pressable>

            <Pressable
              style={styles.menuButton}
              onPress={() => {
                handleFun("Camera");
                setOpen(false);
              }}
            >
              <Ionicons name="camera" size={24} color="white" />
            </Pressable>
          </View>
        )}

        <Pressable style={styles.mainButton} onPress={() => setOpen(!open)}>
          <Ionicons name={open ? "close" : "add"} size={28} color="white" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "transparent", // Or add semi-transparency if needed
    zIndex: 1,
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 50,
    alignItems: "center",
    zIndex: 2,
  },
  menuContainer: {
    backgroundColor: "#e67917",
    borderRadius: 30,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    padding: 12,
  },
  mainButton: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#e67917",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
