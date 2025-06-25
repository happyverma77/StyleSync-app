import React, { useRef, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import useAppContext from "@/ContextProvider/AppProvider";

const { width } = Dimensions.get("window");

interface ImageCarouselProps {
  images: (string | { uri: string })[];
  data: any;
  isSecondaryImage: any;
  setIsSecondaryImage: any;
  secondaryImage: any;
}

export default function ImageCarousel({
  data = {},
  images = [],
  isSecondaryImage = false,
  setIsSecondaryImage,
  secondaryImage,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance>(null);
  const { getAdjacentData } = useAppContext();
  const handleNext = () => {
    if (index < images.length - 1) {
      carouselRef.current?.next();
    }
    getAdjacentData(data._id, "next");
  };

  const handlePrev = () => {
    if (index > 0) {
      carouselRef.current?.prev();
    }
    getAdjacentData(data._id, "pre");
  };

  return (
    <View style={styles.container}>
      {/* <Carousel
        ref={carouselRef}
        loop
        width={width}
        height={400}
        data={images}
        scrollAnimationDuration={500}
        onSnapToItem={(index) => setIndex(index)}
        renderItem={({ item }) => (
          <Image
            source={typeof item === "string" ? { uri: item } : item}
            style={styles.image}
            contentFit="cover"
          />
        )}
      /> */}
      <Image
        source={
          isSecondaryImage
            ? { uri: secondaryImage }
            : typeof images?.[0] === "string"
            ? { uri: images?.[0] }
            : images?.[0]
        }
        style={styles.image}
        contentFit="cover"
      />
      {/* Arrows */}
      <TouchableOpacity style={styles.leftArrow} onPress={handlePrev}>
        <AntDesign name="left" size={24} color="#D67D2A" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.rightArrow} onPress={handleNext}>
        <AntDesign name="right" size={24} color="#D67D2A" />
      </TouchableOpacity>

      {/* Indicators */}
      <View style={styles.indicators}>
        {images.map((_, i) => (
          <Pressable onPress={() => setIsSecondaryImage(!isSecondaryImage)}>
            <View
              key={i}
              style={[styles.dot, i === index ? styles.activeDot : null]}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 400 },
  leftArrow: {
    position: "absolute",
    left: 10,
    top: "50%",
    padding: 10,
    borderRadius: 20,
  },
  rightArrow: {
    position: "absolute",
    right: 10,
    top: "50%",
    padding: 10,
    borderRadius: 20,
  },
  indicators: {
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 5,
  },
  activeDot: {
    backgroundColor: "#333",
    width: 10,
    height: 10,
  },
});
