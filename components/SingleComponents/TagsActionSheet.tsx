import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Pressable, SafeAreaView, Image, TextInput } from "react-native";
import { useState } from "react";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import TextInputWithSubmit from "./TextInputWithSubmit";

const { height } = Dimensions.get("window");

const TagsActionSheet = ({
  tags,
  actionSheetRef,
  handleCancel,
  handleSubmit,
}) => {
  const [AllTags, setAllTags] = useState(tags);
  useEffect(() => {
    setAllTags(tags);
  }, [tags]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          {/* <TouchableOpacity onPress={openActionSheet} style={styles.button}>
          <Text>Open Action Sheet</Text>
        </TouchableOpacity> */}

          <ActionSheet
            ref={actionSheetRef}
            containerStyle={styles.actionSheetContainer}
            gestureEnabled={true}
          >
            <View style={[styles.content, { height: height * 0.9 - 1000 }]}>
              {/* <View className="px-5 pt-5 border-2 border-b-0 border-[#D67D2A] fixed bottom-0 ] rounded-t-[30px]"> */}

              <View className=" py-3  flex-col gap-[15px]">
                <View className="flex-row items-center justify-between gap-1">
                  <Text className="text-lg font-semibold leading-[18px]">
                    Add Tags
                  </Text>
                  <Pressable className=" flex-col justify-center items-center p-0">
                    <EvilIcons name="chevron-down" size={24} color="black" />
                  </Pressable>
                </View>
                <View className="flex-row flex-wrap gap-[10px] items-center">
                  {AllTags.map((tag) => (
                    <View
                      key={tag}
                      className="flex-row items-center justify-center gap-1 px-4 py-2 rounded-full bg-[#EEEEEE]"
                    >
                      <Text className="text-xs font-medium text-black">
                        {tag}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          setAllTags(AllTags.filter((item) => item !== tag))
                        }
                      >
                        <Entypo
                          name="circle-with-cross"
                          size={15}
                          style={{ marginLeft: 5 }}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
              <TextInputWithSubmit
                onChangeText={(text) => {}}
                onSubmit={(text) => {
                  const trimmed = text.trim();
                  if (trimmed !== "") {
                    setAllTags([...AllTags, trimmed]);
                  }
                }}
              />
              <View className="flex-row  flex-wrap gap-[10px] items-center py-3">
                <Pressable
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderColor: "#D67D2A",
                    borderWidth: 2,
                  }}
                  onPress={handleCancel}
                  className="bg-transparent mt-3 border-2 border-[#D67D2A] text-white p-4 rounded-full flex-row items-center justify-center gap-1 flex-1"
                >
                  <Text className="text-[22px] font-semibold text-[#D67D2A] ">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderColor: "#D67D2A",
                    borderWidth: 2,
                  }}
                  onPress={() => handleSubmit(AllTags)}
                  className="bg-[#D67D2A] text-white border-2 border-[#D67D2A]  rounded-full flex-row items-center justify-center gap-1 flex-1"
                >
                  <Text className="text-[22px] font-semibold text-white ">
                    Confirm
                  </Text>
                </Pressable>
              </View>
            </View>
          </ActionSheet>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  actionSheetContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 0,
    borderWidth: 2,
    borderColor: "#D67D2A", // Golden border
    overflow: "hidden", // This ensures the border radius is applied
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "bold",
    color: "#D4AF37", // Golden text
  },
});

export default TagsActionSheet;
