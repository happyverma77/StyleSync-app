import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const TextInputWithSubmit = ({
  onChangeText,
  onSubmit,
  value = "",
  placeholder = "Enter something...",
}) => {
  const [text, setText] = useState("");

  const handleTextChange = (value) => {
    setText(value);
    onChangeText?.(value);
  };

  const handleSubmit = () => {
    // if (text.trim() === "") return;
    onSubmit?.(text);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={text}
        defaultValue={value}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        blurOnSubmit={false}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.icon}>
        <AntDesign name="check" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  icon: {
    padding: 5,
  },
});

export default TextInputWithSubmit;
