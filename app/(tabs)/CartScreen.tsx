import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ActionButton from "@/components/ActionButton";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import FileUpload from "@/components/SingleComponents/FileUpload";
import CameraComponent from "@/components/SingleComponents/CameraComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppContext from "@/ContextProvider/AppProvider";
import { Link, router, usePathname } from "expo-router";

interface CartItem {
  _id: string;
  title?: string;
  image: string | { uri: string };
  price?: string;
  rating?: number;
}
interface UploadImageProps {
  uri: string;
  name?: string;
  type?: string;
}
const CartScreen: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isFileUpload, setIsFileUpload] = useState<boolean>(false);
  const { setIsLoading, topBarSelected, setcartItemsCount } = useAppContext();
  const path = usePathname();

  const handleActionButton = (type: string) => {
    if (type === "Camera") {
      setVisible(true);
    } else {
      setIsFileUpload(true);
    }
  };

  const fetchCartData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found in storage");
        return;
      }

      const res = await axios.get(
        "https://stylesyncchanging.app/api/v1/shoppingcart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.metadata?.success) {
        setCartItems(res.data.responseData);
        setcartItemsCount(res.data.responseData.length);
      } else {
        console.log(
          "Failed to fetch saved suits:",
          res.data?.metadata?.message
        );
      }
    } catch (err: any) {
      console.log("Axios error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const pathName = usePathname();
  useEffect(() => {
    if (pathName === "/CartScreen") {
      fetchCartData();
    }
  }, [pathName]);

  const handleImageUploadCamera = async (image: UploadImageProps) => {
    const uri = image.uri;
    const fileName = uri.split("/").pop() || "image.jpg";
    const match = /\.(\w+)$/.exec(fileName);
    const ext = match?.[1]?.toLowerCase() || "jpg";
    const mimeType = `image/${ext}`;

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: mimeType,
    } as any); // React Native requires `as any` for file objects

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      // const base64 = await FileSystem.readAsStringAsync(image, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      // setIsLoading(true);
      await axios.put(
        "https://stylesyncchanging.app/api/v1/user/image/shopingcart",
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      fetchCartData();
    } catch (error: any) {
      console.log("Upload Failed:", error.response?.data || error.message);
      Alert.alert("Upload Failed", error.message);
    }
  };

  const handleImageUploadFile = async (images: { uri: string }[]) => {
    if (!images || images.length === 0) return;
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");
      setIsLoading(true);

      for (const [index, image] of images.entries()) {
        const uri = image.uri;
        const fileName = uri.split("/").pop() || `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(fileName);
        const ext = match?.[1]?.toLowerCase() || "jpg";
        const mimeType = `image/${ext}`;

        const formData = new FormData();
        formData.append("file", {
          uri,
          name: fileName,
          type: mimeType,
        } as any);

        await axios.put(
          "https://stylesyncchanging.app/api/v1/user/image/shopingcart",
          formData,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // fetchWardrobes();
      // fetchUserDetails();
      // setIsLoading(fa);
      fetchCartData();
    } catch (error: any) {
      console.log("Upload Failed:", error);
      Alert.alert("Upload Failed", error?.message || "Something went wrong");
    }
  };

  const handleImageSelect = (id: string, item: CartItem) => {
    if (topBarSelected[path]) {
      setSelectedImageIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((itemId) => itemId !== id)
          : [...prevSelected, id]
      );
    } else {
      router.replace({ pathname: "/ShopingCartDetails", params: { id } });
      // Navigate to details or show image modal
    }
  };

  const handleDeleteMultiple = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }

      await axios.post(
        "https://stylesyncchanging.app/api/v1/shoppingcart/delete-multiple",
        { ids: selectedImageIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedImageIds([]);
      fetchCartData();
    } catch (error: any) {
      console.log(
        "Error deleting images:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <FileUpload
        hide={setIsFileUpload}
        show={isFileUpload}
        isMultiple={true}
        setImageUri={handleImageUploadFile}
      />
      <CameraComponent
        visible={visible}
        setImageUri={handleImageUploadCamera}
        onClose={() => setVisible(false)}
      />
      <View style={styles.deleteRow}>
        {selectedImageIds.length > 0 && (
          <TouchableOpacity onPress={handleDeleteMultiple}>
            <MaterialCommunityIcons name="delete" size={25} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {cartItems.length === 0 && (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyText}>No items in cart</Text>
          </View>
        )}

        <View style={styles.itemsWrap}>
          {cartItems.map((item) => (
            <Pressable
              key={item._id}
              onPress={() => handleImageSelect(item._id, item)}
              style={styles.card}
            >
              {selectedImageIds.includes(item._id) && (
                <View style={styles.selectedOverlay}>
                  <View style={styles.selectedTick}>
                    <AntDesign name="check" size={14} color="white" />
                  </View>
                </View>
              )}
              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.nameRow}>
                <Text style={styles.itemName}>{item.title || "N/A"}</Text>
              </View>
              <View style={styles.ratingRow}>
                <FontAwesome name="star" size={14} color="#FFAC33" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              <View>
                <Text style={styles.priceText}>{item.price || "N/A"}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <ActionButton handleFun={handleActionButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  deleteRow: {
    marginVertical: 15,
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 12,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
    width: "48%",
    position: "relative",
  },
  image: {
    height: 144,
    width: "100%",
    borderRadius: 5,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 4,
    color: "black",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "black",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  selectedOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  selectedTick: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF8C00",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CartScreen;
