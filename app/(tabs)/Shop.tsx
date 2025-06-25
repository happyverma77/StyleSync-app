import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import React from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";

const Shop = () => {
  // Dummy data to simulate product list
  const products = [
    {
      id: 1,
      name: "Women top wear",
      brand: "Puma",
      price: "$400",
      rating: 4.0,
    },
    {
      id: 2,
      name: "Women top wear",
      brand: "Puma",
      price: "$400",
      rating: 4.0,
    },
    {
      id: 3,
      name: "Women top wear",
      brand: "Puma",
      price: "$400",
      rating: 4.0,
    },
    {
      id: 4,
      name: "Women top wear",
      brand: "Puma",
      price: "$400",
      rating: 4.0,
    },
  ];

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <View className="flex-1 bg-white">
        <View style={styles.topTabs} className="pt-[15px]">
          <View style={styles.tabsLeft}>
            <View style={styles.searchInputContainer}>
              <Feather
                name="search"
                size={18}
                color="#888"
                style={styles.searchInputIcon}
              />
              <TextInput
                style={styles.searchInputField}
                placeholder="Search..."
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Icons Side */}
          <View style={styles.iconButtons}>
            <Pressable>
              <Ionicons name="grid" size={25} color="black" />
            </Pressable>
            <Pressable style={[{ marginLeft: 10 }]}>
              <FontAwesome6 name="sliders" size={25} color="black" />
            </Pressable>
          </View>
        </View>

        <View className="pt-[15px] px-4 max-w-[768px] mx-auto w-full">
          {/* Top filters */}
          <View className="flex-row gap-[15px] items-center justify-center mb-4">
            {["Top rated", "Top rated", "Top rated"].map((label, index) => (
              <Pressable
                key={index}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                }}
                className="bg-white border border-[#DDDDDD] rounded-full flex-row gap-1 items-center justify-center"
              >
                <Feather name="star" size={18} color="#FFAC33" />
                <Text className="text-center text-base">{label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Product Grid 2xN */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between ">
              {products.map((item) => (
                <View
                  key={item.id}
                  className="border border-[#dddddd] rounded-[5px] p-4 mb-4"
                  style={{ width: "48%" }}
                >
                  <Image
                    source={require("../../assets/images/sp1.png")}
                    style={{
                      height: 144,
                      width: "100%",
                      borderRadius: 5,
                    }}
                    resizeMode="cover"
                  />
                  <View className="flex-row items-center justify-between mt-[15px] mb-1">
                    <Text className="text-sm font-medium">{item.name}</Text>
                    <AntDesign name="hearto" size={17} color="black" />
                  </View>
                  <View className="flex-row items-center gap-1 mb-[10px]">
                    <Text className="text-xs">{item.rating}</Text>
                    <View className="flex-row items-center gap-[2px]">
                      {[1, 2, 3, 4].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name="star"
                          size={14}
                          color="#FFAC33"
                        />
                      ))}
                      <Feather name="star" size={14} color="#FFAC33" />
                    </View>
                  </View>
                  <View className="pb-[10px] border-b border-[#dddddd]">
                    <Text className="text-xs font-regular text-[#525252]">
                      {item.brand}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-[15px] mb-1">
                    <Text className="text-base font-medium">{item.price}</Text>
                    <Pressable className="bg-[#A2C2E2] w-[22px] h-[22px] rounded-full flex items-center justify-center">
                      <AntDesign name="arrowright" size={13} color="black" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaProviderCustom>
  );
};
const styles = StyleSheet.create({
  topTabs: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  tabsLeft: {
    flexDirection: "row",
    flex: 1,
  },
  tabButton: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeTabButton: {
    backgroundColor: "#FF8C00",
    borderColor: "#FF8C00",
  },
  tabText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  iconButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    width: "80%",
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: "#fff",
  },
  searchInputIcon: {
    marginRight: 6,
  },
  searchInputField: {
    flex: 1,
    fontSize: 14,
    width: "100%",
    color: "#000",
  },
});
export default Shop;
