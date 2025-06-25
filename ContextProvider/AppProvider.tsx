import { backendUrl } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Keyboard } from "react-native";

// Define types for the state
interface AppContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  fittingRoomImage: any;
  wardrobes: any[];
  setFittingRoomImage: React.Dispatch<React.SetStateAction<any>>;
  fetchWardrobes: () => void;
  isLoading: boolean;
  fittingRoomCameraImage: any;
  setFittingRoomCameraImage: React.Dispatch<React.SetStateAction<any>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isFullScreen: boolean;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  cameraOpen: boolean;
  setCameraOpen: React.Dispatch<React.SetStateAction<boolean>>;
  iskeyboardOpen: boolean;
  setKeyboardOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUserDetails: () => void;
  singlewardrobe: any;
  setSingleWardrobe: React.Dispatch<React.SetStateAction<any>>;
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: any;
  topBarSelected: any;
  setTopBarSelected: React.Dispatch<React.SetStateAction<any>>;
}

// Create the context with the type
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create the provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<string>("light");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iskeyboardOpen, setKeyboardOpen] = useState<boolean>(false);
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState<boolean>(false);
  const [fittingRoomImage, setFittingRoomImage] = useState<any>(
    require("../assets/images/modal.jpg")
  );
  const [fittingRoomCameraImage, setFittingRoomCameraImage] =
    useState<any>(null);
  const [topBarSelected, setTopBarSelected] = useState<any>({});
  const [userData, setUserData] = useState<any>({});
  const [wardrobes, setWardrobes] = useState<any[]>([]);
  const [singlewardrobe, setSingleWardrobe] = useState<any>({});
  const [itemCount, setItemCount] = useState(0);
  const [closetItemCount, setClosetItemCount] = useState(0);
  const [savedSuitCount, setsavedSuitCount] = useState(0);
  const [cartItemsCount, setcartItemsCount] = useState(0);
  const [putOnCount, setputOnCount] = useState(0);

  function getAdjacentData(id, type) {
    // console.log("fefwe");

    const index = wardrobes.findIndex((item) => item._id === id);

    if (index === -1) return { error: "ID not found" };

    const previous = wardrobes[index - 1] || null;
    const current = wardrobes[index];
    const next = wardrobes[index + 1] || null;
    if (type == "next") {
      setSingleWardrobe({ _id: next._id });
    } else {
      setSingleWardrobe({ _id: previous._id });
    }
    // setselectedImg([{ url: next.uri || "" }]);

    return { previous, current, next };
  }

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await axios.get(
        "https://stylesyncchanging.app/api/v1/user/details",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      if (data?.metadata?.success) {
        setUserData(data.responseData);
        console.log(data.responseData);
      } else {
        console.log("Failed to fetch user data:", data.metadata.message);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
    setIsLoading(false);
  };
  const fetchWardrobes = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        // console.log("No token found in storage");
        return;
      }
      const res = await axios.get(
        "https://stylesyncchanging.app/api/v1/wardrobe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data?.metadata?.success) {
        setWardrobes(res?.data?.responseData);
        setClosetItemCount(res?.data?.responseData?.length);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        // console.log("Failed to fetch wardrobes:", res.data?.metadata?.message);
      }
    } catch (err) {
      setIsLoading(false);
      // console.log("Axios error:", err.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchWardrobes();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardOpen(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme,
        setTheme,
        fittingRoomImage,
        getAdjacentData,
        wardrobes,
        itemCount,
        setItemCount,
        setFittingRoomImage,
        fetchWardrobes,
        isLoading,
        fittingRoomCameraImage,
        setFittingRoomCameraImage,
        setIsLoading,
        isFullScreen,
        setIsFullScreen,
        cameraOpen,
        setCameraOpen,
        iskeyboardOpen,
        closetItemCount,
        setClosetItemCount,
        savedSuitCount,
        setsavedSuitCount,
        cartItemsCount,
        setcartItemsCount,
        putOnCount,
        setputOnCount,
        setKeyboardOpen,
        fetchUserDetails,
        singlewardrobe,
        setSingleWardrobe,
        isAddTaskModalOpen,
        setIsAddTaskModalOpen,
        userData,
        topBarSelected,
        setTopBarSelected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Corrected export statement
const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default useAppContext;
