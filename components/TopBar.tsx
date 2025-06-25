import React, { useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { router, usePathname, useRouter } from "expo-router";
import useAppContext from "@/ContextProvider/AppProvider";
import CoinBadge from "./SingleComponents/CoinBadge";

const TopBar = ({ heading, showBackButton = true }) => {
  const pathname = usePathname();
  const { setIsAddTaskModalOpen } = useAppContext();
  const [isRight, setIsRight] = React.useState(true);

  useEffect(() => {
    if (
      pathname === "/PersonalInfo" ||
      pathname === "/PasswordScreen" ||
      pathname === "/RateUs" ||
      pathname === "/Subscription" ||
      pathname === "/Settings" ||
      pathname === "/Language"
    ) {
      setIsRight(false);
    } else {
      setIsRight(true);
    }
  }, [pathname]);

  return (
    <Pressable
      style={styles.container}
      onPress={() => setIsAddTaskModalOpen(false)}
    >
      {/* Blue Section (60%) */}
      <View style={styles.blueSection}>
        <View style={styles.content}>
          {showBackButton && <GetLeftButton path={pathname} />}
          <Text style={styles.title}>{heading}</Text>
        </View>
      </View>

      {/* White Section (40%) with custom polygon clip */}
      {isRight && (
        <View style={styles.whiteSection}>
          <Svg
            height="100%"
            width="100%"
            style={styles.polygonMask}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <Path
              d="M16,0 H100 a5,5 0 0 1 5,5 V100 a5,5 0 0 1 -5,5 H0 V100 Z"
              fill="#fff"
            />
          </Svg>

          <View style={styles.rightContent}>
            <GetRightButton path={pathname} />
          </View>
        </View>
      )}
    </Pressable>
  );
};

// GetLeftButton using switch case based on pathname
const GetLeftButton = ({ path }) => {
  const navigateFun = () => {
    switch (path) {
      case "/ProductDetails":
        router.replace("/Closet");
        break;
      case "/PersonalInfo":
      case "/PasswordScreen":
      case "/Language":
      case "/RateUs":
      case "/Subscription":
      case "/PrivacyPolicy":
      case "/FollowUs":
        router.replace("/Settings");
        break;
      case "/PutOnRecords":
      case "/CalenderScreen":
      case "/FittingRoomTryOn":
      case "/CartScreen":
      case "/SavedSuits":
        router.replace("/FittingRoom");
        break;
      case "/ShopingCartDetails":
        router.replace("/CartScreen");

      default:
        break;
    }
  };

  if (path === "/Landing") return null;

  const isMainRoute = [
    "/Closet",
    "/Search",
    "/FittingRoom",
    "/Settings",
    "/Shop",
  ].includes(path);

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => {
        if (isMainRoute) {
          router.replace("/Landing");
        } else {
          navigateFun();
        }
      }}
    >
      {isMainRoute ? (
        <Feather name="home" size={20} color="#FF7A00" />
      ) : (
        <AntDesign name="arrowleft" size={20} color="#FF7A00" />
      )}
    </TouchableOpacity>
  );
};

const GetRightButton = ({ path }) => {
  const { topBarSelected, setTopBarSelected } = useAppContext();
  const handleClick = () => {
    setTopBarSelected((prev) => ({ [path]: !prev[path] }));
  };
  switch (path) {
    case "/PutOnRecords":
    case "/CartScreen":
      return (
        <Pressable
          onPress={handleClick}
          style={[
            styles.btn,
            { backgroundColor: topBarSelected[path] ? "#FF7A00" : "grey" },
          ]}
        >
          <AntDesign name="check" size={20} color="#fff" />
          <Text style={styles.text}>Select</Text>
        </Pressable>
      );
    case "/Closet":
    case "/Shop":
    case "/SavedSuits":
      return (
        <>
          <Pressable
            onPress={handleClick}
            style={[
              styles.btn,
              { backgroundColor: topBarSelected[path] ? "#FF7A00" : "grey" },
            ]}
          >
            <AntDesign name="check" size={20} color="#fff" />
            <Text style={styles.text}>Select</Text>
          </Pressable>

          <TouchableOpacity
            style={styles.bellWrapper}
            onPress={() => router.replace("/CartScreen")}
          >
            <MaterialCommunityIcons
              name="cart-variant"
              size={20}
              color="black"
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>7</Text>
            </View>
          </TouchableOpacity>
        </>
      );
    case "/Closet":
      return (
        <TouchableOpacity
          style={styles.bellWrapper}
          onPress={() => router.replace("/CartScreen")}
        >
          <MaterialCommunityIcons name="cart-variant" size={20} color="black" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>4</Text>
          </View>
        </TouchableOpacity>
      );
    case "/FittingRoom":
      return (
        <TouchableOpacity
          style={styles.bellWrapper}
          onPress={() => router.replace("/CartScreen")}
        >
          <MaterialCommunityIcons name="cart-variant" size={20} color="black" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>4</Text>
          </View>
        </TouchableOpacity>
      );
    case "/FittingRoomTryOn":
      return <CoinBadge />;

    default:
      return (
        <>
          <View style={styles.bellWrapper}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={22}
              color="#000"
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>4</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.replace("/PersonalInfo")}>
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/75.jpg",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    backgroundColor: "#a2c2e2",
    overflow: "hidden",
  },
  blueSection: {
    width: "60%",
    backgroundColor: "#a2c2e2",
    justifyContent: "center",
  },
  whiteSection: {
    width: "40%",
    height: "100%",
    position: "relative",
    flex: 1,
    // marginTop: 5,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  polygonMask: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginRight: 16,
  },
  bellWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF7A00",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8, // px-3
    paddingVertical: 4, // py-1
    borderRadius: 5,
    gap: 3, // equivalent to space-x-2 (React Native 0.71+)
  },
  text: {
    color: "#fff",
  },
});

export default TopBar;
