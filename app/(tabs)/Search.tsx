import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import debounce from "lodash.debounce";
import { Image } from "expo-image";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSearchResults = async (query, pageNum = 1) => {
    if (!query.trim()) {
      setImages([]);
      setHasMore(false);
      return;
    }

    try {
      if (pageNum === 1) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await axios.get(
        `https://stylesyncchanging.app/search?q=${query}&page=${pageNum}`
      );
      const newImages = res.data.results || [];

      if (pageNum === 1) {
        setImages(newImages);
      } else {
        setImages((prev) => [...prev, ...newImages]);
      }

      setHasMore(newImages.length > 0);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      // console.error("Search fetch error:", error.message);
      Alert.alert("Error", "Failed to fetch search results.");
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      setPage(1);
      fetchSearchResults(query, 1);
    }, 1000),
    []
  );

  // Handle input change
  useEffect(() => {
    debouncedSearch(searchText);
    return () => debouncedSearch.cancel();
  }, [searchText, debouncedSearch]);

  // Load more items when reaching end of list
  const loadMore = () => {
    if (!loading && hasMore && searchText.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchResults(searchText, nextPage);
    }
  };

  // Render each image item
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.imageContainer,
        index % 2 === 0 ? { marginRight: 13 } : { marginLeft: 0 },
      ]}
    >
      <Image
        source={{ uri: item.link }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  // Footer component for loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#888" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  // Empty state component
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchText.trim() ? "No results found" : "Search for images"}
      </Text>
    </View>
  );

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#6b6b6b"
              />
              <Ionicons
                name="search-outline"
                size={15}
                color="#000"
                style={styles.searchIcon}
              />
            </View>
            {/* <View className="flex-row gap-[10px] items-center">
              <Pressable>
                <FontAwesome6 name="sliders" size={25} color="black" />
              </Pressable>
              <ScrollView
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
              >
                <View className="flex-row gap-[10px] items-center overflow-x-auto whitespace-nowarp w-full pe-5 mb-2">
                  <View className="flex-row gap-[5px] border border-[#DDDDDD] rounded-full p-[5px]">
                    <Image
                      source={require("../../assets/images/sp2.png")}
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 999,
                      }}
                    />
                    <Text className="text-lg font-medium text-black leading-[24px]">
                      Fashion
                    </Text>
                  </View>
                  <View className="flex-row gap-[5px] border border-[#DDDDDD] rounded-full p-[5px]">
                    <Image
                      source={require("../../assets/images/sp2.png")}
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 999,
                      }}
                    />
                    <Text className="text-lg font-medium text-black leading-[24px]">
                      Fur coat
                    </Text>
                  </View>
                  <View className="flex-row gap-[5px] border border-[#DDDDDD] rounded-full p-[5px]">
                    <Image
                      source={require("../../assets/images/sp2.png")}
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 999,
                      }}
                    />
                    <Text className="text-lg font-medium text-black leading-[24px]">
                      Dress
                    </Text>
                  </View>
                  <View className="flex-row gap-[5px] border border-[#DDDDDD] rounded-full p-[5px]">
                    <Image
                      source={require("../../assets/images/sp2.png")}
                      style={{
                        height: 26,
                        width: 26,
                        borderRadius: 999,
                      }}
                    />
                    <Text className="text-lg font-medium text-black leading-[24px]">
                      Fashion
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </View> */}

            {/* Results */}
            <FlatList
              data={images}
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              contentContainerStyle={styles.listContent}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={renderEmpty}
              refreshing={isRefreshing}
              // onRefresh={() => {
              //   setPage(1);
              //   fetchSearchResults(searchText, 1);
              // }}
              columnWrapperStyle={styles.columnWrapper}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </View>
    </SafeAreaProviderCustom>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  contentContainer: {
    maxWidth: 768,
    marginHorizontal: "auto",
    width: "100%",
    flex: 1,
  },
  searchContainer: {
    padding: 20,
    flex: 1,
  },
  searchInputContainer: {
    position: "relative",
    marginBottom: 17,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D8DADC",
    borderRadius: 100,
    paddingLeft: 44,
    paddingRight: 16,
    paddingVertical: 12.5,
    color: "#000",
  },
  searchIcon: {
    position: "absolute",
    top: 18,
    left: 17,
  },
  listContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    width: "48%",
    height: 187,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 13,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    width: "100%",
    marginTop: 10,
    alignItems: "center",
  },
  loadingText: {
    color: "#888",
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    color: "#6b6b6b",
    fontSize: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

export default Search;
