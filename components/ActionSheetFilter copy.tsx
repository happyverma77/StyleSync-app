import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useLang } from "@/utils/LangContext";

const { height } = Dimensions.get("window");

const ActionSheetFilter = ({
  editmode = false,
  actionSheetRef,
  seletedTags,
  setSelectedTags,
}) => {
  const [isEditing, setIsEditing] = useState(editmode);
  const [newTags, setNewTags] = useState({
    colors: "",
    occasions: "",
    season: "",
    others: "",
  });
  useEffect(() => {
    setIsEditing(editmode);
  }, [editmode]);

  const [tags, setTags] = useState({
    Colors: [
      "White",
      "Gray",
      "Black",
      "Camel",
      "Orange",
      "Brown",
      "Green",
      "Red",
      "Purple",
      "Pink",
      "Blue",
      "Yellow",
    ],
    Occasions: ["Party", "Date", "Daily", "Travel", "Sports", "Home", "Work"],
    Season: ["Spring", "Summer", "Fall", "Winter"],
    Others: ["First cloth bought in Japan"],
  });

  const { t } = useLang();

  const handleAddTag = (category) => {
    const value = newTags[category].trim();
    if (!value) return;

    setTags((prev) => ({
      ...prev,
      [category]: [...prev[category], value],
    }));

    setNewTags((prev) => ({ ...prev, [category]: "" }));
  };

  const handleRemoveTag = (category, idx) => {
    setTags((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== idx),
    }));
  };

  const handleClearAll = () => {
    setTags({
      Colors: [],
      Occasions: [],
      Season: [],
      Others: [],
    });
  };

  const [isAddClassificationVisible, setIsAddClassificationVisible] =
    useState(false);

  const handleApply = () => {
    console.log("Applied filters:", tags);
    actionSheetRef.current?.hide();
  };
  const [newCategory, setNewCategory] = useState("");
  function deleteKeyFromObject(obj, keyToDelete) {
    const { [keyToDelete]: _, ...newObj } = obj;
    return newObj;
  }
  console.log(seletedTags);

  const [accordian, setAccordian] = useState([]);
  const renderSection = (label, category, ind) => (
    <View key={ind} className="pb-3 flex-col gap-[15px] mt-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold">{t(`Filters.${label}`)}</Text>
        {isEditing ? (
          <TouchableOpacity
            onPress={() => setTags((pre) => deleteKeyFromObject(pre, category))}
          >
            <AntDesign name="close" size={12} color="black" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              transform: [
                {
                  rotate: accordian.includes(`${category + ind}`)
                    ? "180deg"
                    : "0deg",
                },
              ],
            }}
            onPress={() => {
              if (accordian.includes(`${category + ind}`)) {
                setAccordian((prev) =>
                  prev.filter((item) => item !== category + ind)
                );
              } else {
                setAccordian((prev) => [...prev, category + ind]);
              }
            }}
          >
            <EvilIcons name="chevron-down" size={30} color="black" />
          </TouchableOpacity>
        )}
      </View>
      {!accordian.includes(`${category + ind}`) && (
        <View className="flex-row flex-wrap gap-[10px] items-center">
          {tags[category].map((tag, idx) => (
            <TouchableOpacity
              onPress={() => {
                if (!isEditing) {
                  if (seletedTags.includes(tag)) {
                    setSelectedTags((prev) => [
                      ...prev.filter((item) => item !== tag),
                    ]);
                  } else {
                    setSelectedTags((prev) => [...prev, tag]);
                  }
                }
              }}
              key={idx}
              style={{
                backgroundColor: seletedTags.includes(tag)
                  ? "#D67D2A"
                  : "#EEEEEE",
              }}
              className="px-4 py-2 rounded-full flex-row items-center gap-1"
            >
              <Text className="text-xs font-medium">{tag}</Text>
              {isEditing && (
                <Pressable onPress={() => handleRemoveTag(category, idx)}>
                  <AntDesign name="close" size={12} color="black" />
                </Pressable>
              )}
            </TouchableOpacity>
          ))}

          {isEditing && (
            <View className="flex-row items-center gap-2">
              <TextInput
                value={newTags[category]}
                onChangeText={(text) =>
                  setNewTags((prev) => ({ ...prev, [category]: text }))
                }
                placeholder={t("Filters.NewTag")}
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#D67D2A",
                  borderWidth: 1,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  minWidth: 100,
                }}
              />
              <Pressable
                className="bg-[#D67D2A] px-4 py-2 rounded-full"
                onPress={() => handleAddTag(category)}
              >
                <Text className="text-xs font-medium text-white">
                  {t("Filters.Add")}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </View>
  );
  const scrollViewRef = useRef(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView ref={scrollViewRef}>
        <View style={styles.container}>
          <ActionSheet
            ref={actionSheetRef}
            containerStyle={styles.actionSheetContainer}
            animated={true}
            gestureEnabled={true}
          >
            <View style={[styles.content, { height: height * 0.9 - 60 }]}>
              <View className="flex-row items-center justify-between">
                <Text style={{ fontSize: 22 }} className="font-semibold">
                  {t("Filters.filters")}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setIsEditing((prev) => !prev)}
                  >
                    <Text className="text-lg font-semibold">Edit</Text>
                  </TouchableOpacity>
                  <Pressable onPress={() => actionSheetRef.current?.hide()}>
                    <AntDesign name="close" size={14} color="black" />
                  </Pressable>
                </View>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                {Object.keys(tags).map((category, ind) =>
                  renderSection(category, category, ind)
                )}

                {isAddClassificationVisible ? (
                  <View className="mt-6 flex-col mt-5 gap-[15px]">
                    <View className="flex-row items-center justify-between gap-1">
                      <TextInput
                        value={newCategory}
                        onChangeText={setNewCategory}
                        onFocus={() => {
                          setTimeout(() => {
                            scrollViewRef.current?.scrollToEnd({
                              animated: true,
                            });
                          }, 100); // slight delay ensures keyboard is fully visible
                        }}
                        placeholder={t("Filters.NewClassification")}
                        className="border border-[#D67D2A] rounded-full px-4 py-2 flex-1"
                      />
                      <Pressable
                        onPress={() => {
                          if (newCategory.trim() !== "") {
                            setTags((prev) => ({
                              ...prev,
                              [newCategory.trim()]: [],
                            }));
                          }
                          setNewCategory("");
                          setIsAddClassificationVisible(false);
                        }}
                        className="bg-[#D67D2A] px-4 py-2 rounded-full ml-2"
                      >
                        <Text className="text-xs font-medium text-white">
                          {t("Filters.Add")}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View className="pb-3 mt-3 flex-col gap-[15px]">
                    <View className="flex-row items-center justify-between gap-1">
                      <Pressable
                        className=" px-4 py-2  rounded-full flex-row items-center gap-[10px]"
                        // disabled
                        onPress={() => setIsAddClassificationVisible(true)}
                      >
                        <AntDesign name="plus" size={20} color="black" />
                        <Text className="text-lg font-semibold leading-[18px]">
                          {t("Filters.Add_Classifications")}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                <View className="flex-row flex-wrap gap-[10px] items-center py-3">
                  <Pressable
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: "#D67D2A",
                      borderWidth: 2,
                    }}
                    className="rounded-full flex-1 items-center"
                    onPress={handleClearAll}
                  >
                    <Text className="text-[22px] font-semibold text-[#D67D2A]">
                      {t("Filters.Clear")}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderColor: "#D67D2A",
                      borderWidth: 2,
                    }}
                    className="bg-[#D67D2A] rounded-full flex-1 items-center"
                    onPress={handleApply}
                  >
                    <Text className="text-[22px] font-semibold text-white">
                      {t("Filters.Apply")}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
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
  },
  actionSheetContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 2,
    borderColor: "#D67D2A",
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
});

export default ActionSheetFilter;
