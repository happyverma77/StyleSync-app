import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAppContext from "@/ContextProvider/AppProvider";
import { usePathname } from "expo-router";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { backendUrl } from "@/utils/api";

interface Suit {
  _id: string;
  image: string;
}
const removeDuplicateRecords = (records) => {
  const seen = new Set();
  return records.filter((record) => {
    if (seen.has(record._id)) return false;
    seen.add(record._id);
    return true;
  });
};

const cleanApiResponse = (response) => {
  const mergedByDate = {};
  response.forEach((entry) => {
    const date = entry._id;
    if (!mergedByDate[date]) {
      mergedByDate[date] = [...entry.records];
      console.log(entry.records);
    } else {
      mergedByDate[date].push(...entry.records);
    }
  });

  return Object.entries(mergedByDate).map(([date, records]) => ({
    _id: date,
    records: removeDuplicateRecords(records),
  }));
};

const PutOnRecords = () => {
  const [cleanedData, setCleanedData] = useState([]);
  const { setIsLoading, topBarSelected, setputOnCount } = useAppContext();

  const fetchRecords = async () => {
    try {
      const token = await AsyncStorage.getItem("token"); // Ensure your key is correct

      if (!token) {
        console.warn("No token found in AsyncStorage");
        return;
      }
      setIsLoading(true);
      const res = await axios.get(
        "https://stylesyncchanging.app/api/v1/user/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const cleaned = cleanApiResponse(res.data);
      setCleanedData(cleaned);
      setputOnCount(
        res.data.reduce((total, item) => total + item.records.length, 0)
      );
      console.log(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setIsLoading(false);
    }
  };
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/PutOnRecords") {
      fetchRecords();
    }
  }, [pathname]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const path = usePathname();
  const handleImageSelect = (id: string, item: Suit) => {
    if (topBarSelected[path]) {
      setSelectedImageIds((prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((item) => item !== id)
          : [...prevSelected, id]
      );
    } else {
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

      const response = await axios.post(
        `https://stylesyncchanging.app/api/v1/user/history-delete`,
        { ids: selectedImageIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedImageIds([]);
      fetchRecords();
    } catch (error) {
      console.log(error);

      console.log(
        "Error deleting images:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <ScrollView className="h-full block bg-white pb-10">
      <View className="pt-5 px-4 max-w-[768px] mx-auto w-full">
        <View style={styles.actionBar}>
          {selectedImageIds.length > 0 && (
            <TouchableOpacity onPress={handleDeleteMultiple}>
              <MaterialCommunityIcons name="delete" size={25} color="black" />
            </TouchableOpacity>
          )}
        </View>
        {cleanedData.length === 0 && (
          <View className="flex-row flex-wrap items-center justify-center gap-[11px] my-5">
            {/* <View className="border border-[#dddddd] p-[6px] w-[48%] h-[187px] flex items-center justify-center overflow-hidden rounded-[5px]"> */}
            <Text className="text-center text-[#5B5B5B] text-[18px] font-semibold">
              No Records Found
            </Text>
            {/* </View> */}
          </View>
        )}
        {cleanedData.map((entry, index) => (
          <View key={index}>
            {/* Date Divider */}
            <View className="mt-5">
              <View className="w-full h-[1px] bg-[#E9E9E9]" />
              <View className="w-fit mx-auto mt-[-15px] bg-[#EAEAEA] rounded-full px-[10px] py-[5px]">
                <Text className="text-xs font-medium text-[#5B5B5B]">
                  {entry._id}
                </Text>
              </View>
            </View>

            {/* Record Images */}
            <View className="flex-row flex-wrap  gap-[11px] items-center my-5">
              {entry.records.map((record) => (
                <TouchableOpacity
                  key={record._id}
                  onPress={() => handleImageSelect(record._id, record)}
                  className="border border-[#dddddd] p-[6px] w-[48%] h-[187px] relative flex items-center justify-center overflow-hidden rounded-[5px]"
                >
                  {selectedImageIds.includes(record._id) && (
                    <View style={styles.selectedOverlay}>
                      <View style={styles.selectedTick}>
                        <AntDesign name="check" size={14} color="white" />
                      </View>
                    </View>
                  )}
                  <Image
                    source={{ uri: record.tryOnImageUrl }} // ✅ Assuming image URL from server
                    className="w-full h-full object-cover rounded-[5px]"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  selectedOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  actionBar: {
    marginTop: 15,
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingRight: 5,
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
  image: {
    width: "100%",
    height: "100%",
  },
});

export default PutOnRecords;
