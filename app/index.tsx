import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
  }, []);

  if (isLoggedIn === null) return null; // Wait for auth check

  return <Redirect href={isLoggedIn ? "/Landing" : "/FirstTime"} />;
}

// import { useEffect } from "react";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Check if a token exists in AsyncStorage
// const checkAuthStatus = async (): Promise<boolean> => {
//   const token = await AsyncStorage.getItem("token");
//   return !!token; // true if token exists, false otherwise
// };

// export default function Index() {
//   const router = useRouter();

//   useEffect(() => {
//     const checkLogin = async () => {
//       const isLoggedIn = await checkAuthStatus();
//        router.replace(isLoggedIn ? "/Landing" : "/FirstTime");
//       //  router.replace(isLoggedIn ? "/Home" : "/FirstTime");
//     };

//     checkLogin();
//   }, []);

//   return null; // No UI needed here
// }
