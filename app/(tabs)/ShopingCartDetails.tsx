import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
import ImageCarousel from "@/components/ImageCarousel";
import useAppContext from "@/ContextProvider/AppProvider";
import TextInputWithSubmit from "@/components/SingleComponents/TextInputWithSubmit";
import TagsActionSheet from "@/components/SingleComponents/TagsActionSheet";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useLang } from "@/utils/LangContext";

interface SingleWardrobe {
  _id: string;
  image: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
}

const ShoppingCartDetails = () => {
  const { id } = useLocalSearchParams();
  const { setIsLoading } = useAppContext();
  const actionSheetRef = useRef<any>(null);
  const { t } = useLang();

  const [singleCartData, setSingleCartData] = useState<SingleWardrobe | null>(
    null
  );
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  const fetchsinglewardrobe = async (wardrobeId: string) => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `https://stylesyncchanging.app/api/v1/shoppingcart/${wardrobeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSingleCartData(response.data.responseData);
      setDescriptionDraft(response?.data?.responseData?.price);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchsinglewardrobe(id);
    }
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (
        descriptionDraft &&
        descriptionDraft !== singleCartData?.description
      ) {
        handleUpdate({ price: descriptionDraft });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [descriptionDraft]);

  const handleTagActionSheetCancel = () => actionSheetRef.current?.hide();

  const handleTagActionSheetSubmit = async (tags: string[]) => {
    actionSheetRef.current?.hide();
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `https://stylesyncchanging.app/api/v1/shoppingcart/${id}`,
        { tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSingleCartData(response.data.responseData);
      Alert.alert("Success", "Tags updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleUpdate = async (payload: { title?: string; price?: string }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `https://stylesyncchanging.app/api/v1/shoppingcart/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSingleCartData(response.data.responseData);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(
        `https://stylesyncchanging.app/api/v1/shoppingcart/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.replace("/CartScreen");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (!singleCartData) return null;

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <ScrollView style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.carousel}>
            <ImageCarousel images={[singleCartData.image]} />
          </View>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <View style={styles.rating}>
                {Array.from({ length: 5 }).map((_, index) =>
                  index < singleCartData.stars ? (
                    <FontAwesome
                      key={index}
                      name="star"
                      size={14}
                      color="#FFAC33"
                    />
                  ) : (
                    <Feather
                      key={index}
                      name="star"
                      size={14}
                      color="#FFAC33"
                    />
                  )
                )}
              </View>
              <Text style={styles.ratingText}>{singleCartData.stars}</Text>
            </View>

            {!isTextEditing ? (
              <Text style={styles.title}>
                {singleCartData.title || "Click to edit"}
                <TouchableOpacity onPress={() => setIsTextEditing(true)}>
                  <FontAwesome
                    name="pencil"
                    style={styles.editIcon}
                    size={16}
                    color="blue"
                  />
                </TouchableOpacity>
              </Text>
            ) : (
              <TextInputWithSubmit
                value={singleCartData.title}
                onChangeText={() => {}}
                onSubmit={(txt) => {
                  handleUpdate({ title: txt });
                  setIsTextEditing(false);
                }}
              />
            )}

            {/* {!isDescriptionEditing ? (
              <Text style={styles.description}>
                {singleCartData.description || "Click to edit"}
                <TouchableOpacity onPress={() => setIsDescriptionEditing(true)}>
                  <FontAwesome
                    name="pencil"
                    style={styles.editIcon}
                    size={16}
                    color="blue"
                  />
                </TouchableOpacity>
              </Text>
            ) : (
              <TextInputWithSubmit
                value={singleCartData.description}
                onChangeText={() => {}}
                onSubmit={(txt) => {
                  handleUpdate({ description: txt });
                  setIsDescriptionEditing(false);
                }}
              />
            )} */}

            <View style={styles.noteSection}>
              <Text style={styles.sectionTitle}>Add Price</Text>
              <TextInput
                value={descriptionDraft}
                keyboardType="numeric"
                onChangeText={(txt) => setDescriptionDraft(txt)}
                style={styles.textInput}
              />
            </View>

            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton}>
                <MaterialIcons name="meeting-room" size={18} color="white" />
                <Text style={styles.actionButtonText}>
                  {t("Product.Add_to_Calender")}
                </Text>
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={18} color="white" />
                <Text style={styles.actionButtonText}>
                  {t("Product.Share")}
                </Text>
              </Pressable>
              <Pressable onPress={handleDelete} style={styles.deleteButton}>
                <AntDesign name="delete" size={18} color="white" />
                <Text style={styles.deleteButtonText}>
                  {t("Product.Delete")}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <TagsActionSheet
        tags={singleCartData.tags || []}
        handleCancel={handleTagActionSheetCancel}
        handleSubmit={handleTagActionSheetSubmit}
        actionSheetRef={actionSheetRef}
      />
    </SafeAreaProviderCustom>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingBottom: 5,
    marginBottom: 5,
  },
  wrapper: {
    maxWidth: 768,
    marginLeft: "auto",
    paddingBottom: 45,
    marginRight: "auto",
    width: "100%",
  },
  carousel: {
    width: "100%",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    flexDirection: "row",
    gap: 2,
  },
  ratingText: {
    fontSize: 16,
    color: "#FFAC33",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 18,
  },
  description: {
    fontSize: 12,
    fontWeight: "500",
    color: "#525252",
    lineHeight: 18,
  },
  editIcon: {
    marginLeft: 8,
  },
  noteSection: {
    marginTop: 20,
    gap: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D8DADC",
    borderRadius: 10,
    // height: 160,
    textAlignVertical: "top",
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 25,
  },
  actionButton: {
    backgroundColor: "#D67D2A",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#F00909",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    // marginBottom: 10,
  },
});

export default ShoppingCartDetails;
