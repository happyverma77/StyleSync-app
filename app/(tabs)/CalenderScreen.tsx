import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomCalendar from "@/components/CustomCalendar";
import AddTaskModal from "@/components/AddTaskModal";
import CameraComponent from "@/components/SingleComponents/CameraComponent";
import FileUpload from "@/components/SingleComponents/FileUpload";
import { backendUrl } from "@/utils/api";
import SafeAreaProviderCustom from "@/components/SafeAreaProviderCustom";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import useAppContext from "@/ContextProvider/AppProvider";

interface CalendarItem {
  date: string;
  human_image: string;
  cloth_image: string;
}

interface MarkedDates {
  [date: string]: {
    human_image: string;
    cloth_image: string;
  };
}

function convertArrayToMarkedDateArray(dataArray: CalendarItem[]): MarkedDates {
  const result: MarkedDates = {};

  dataArray.forEach((item) => {
    result[item.date] = {
      human_image: item.human_image,
      cloth_image: item.cloth_image,
    };
  });

  return result;
}

const CalenderScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(false);
  const [humanImageUrl, setHumanImageUrl] = useState<string | null>(null);
  const [clothingImageUrl, setClothingImageUrl] = useState<string | null>(null);
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [showFileUpload, setShowFileUpload] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<"human" | "clothing" | null>(
    null
  );
  const [date, setDate] = useState<string | null>(null);
  const [calenderData, setCalenderData] = useState<MarkedDates>({});
  const [mainCalenderData, setMainCalenderData] = useState([]);
  const { setIsLoading } = useAppContext();

  const returnValue = useLocalSearchParams();

  useEffect(() => {
    if (returnValue?.image) {
      if (uploadType == "human") {
        setHumanImageUrl({ uri: returnValue.image });
      } else {
        setClothingImageUrl({ uri: returnValue.image });
      }
    }
    router.replace("/CalenderScreen");
  }, [returnValue?.image]);

  const fetchCalenderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("Token not found");
        return;
      }
      setIsLoading(true);
      const response = await axios.get(
        "https://backend-clothing-ai-divr.vercel.app/api/v1/user/task/my-tasks",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setMainCalenderData(data.responseData);
      if (data?.metadata?.success && Array.isArray(data.responseData)) {
        // console.log(convertArrayToMarkedDateArray(data.responseData));
        setCalenderData(convertArrayToMarkedDateArray(data.responseData));
      } else {
        console.log(
          "Failed to fetch user data:",
          data?.metadata?.message || "Unknown error"
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error fetching user data:", error);
    }
  };
  const pathName = usePathname();
  useEffect(() => {
    if (pathName === "/CalenderScreen") {
      fetchCalenderDetails();
    }
  }, [pathName]);
  const filterDataByDate = (data, targetDate) => {
    return data?.filter((item) => item.date === targetDate);
  };

  return (
    <SafeAreaProviderCustom barStyle="dark-content" statusBarColor="#a2c2e2">
      <View style={styles.container}>
        <AddTaskModal
          setHumanImageUrl={setHumanImageUrl}
          humanImageUrl={humanImageUrl}
          fetchCalenderDetails={fetchCalenderDetails}
          isCameraVisible={isCameraVisible}
          selectedItems={filterDataByDate(mainCalenderData, date)}
          clothingImageUrl={clothingImageUrl}
          date={date}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          showFileUpload={showFileUpload}
          setShowFileUpload={setShowFileUpload}
          setClothingImageUrl={setClothingImageUrl}
          setUploadType={setUploadType}
          setIsCameraVisible={setIsCameraVisible}
        />

        {!isCameraVisible && (
          <CustomCalendar calenderData={calenderData} handleDate={setDate} />
        )}

        <CameraComponent
          setImageUri={
            uploadType === "human" ? setHumanImageUrl : setClothingImageUrl
          }
          visible={isCameraVisible}
          onClose={setIsCameraVisible}
        />

        <FileUpload
          hide={() => {
            setShowFileUpload(false);
            setIsVisible(false);
          }}
          show={showFileUpload}
          setImageUri={
            uploadType === "human" ? setHumanImageUrl : setClothingImageUrl
          }
        />
      </View>
    </SafeAreaProviderCustom>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // you can adjust this if you had tailwind colors
  },
});

export default CalenderScreen;
