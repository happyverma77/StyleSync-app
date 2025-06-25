import React from "react";
import { Calendar } from "react-native-calendars";
import { View, Text, Image, StyleSheet, Alert, Pressable } from "react-native";
import useAppContext from "@/ContextProvider/AppProvider";

const CustomCalendar = ({ handleDate, calenderData }) => {
  const { isAddTaskModalOpen, setIsAddTaskModalOpen } = useAppContext();
  const handleDayPress = (dateString) => {
    handleDate(dateString);
    setIsAddTaskModalOpen(true);
  };
  function getCustomCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are 0-based
    const day = currentDate.getDate() + 10; // You can add extra days as needed

    // Return the custom date in "YYYY-MM-DD" format
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  }

  return (
    <View style={styles.calendarWrapper}>
      <Calendar
        current={getCustomCurrentDate()}
        enableSwipeMonths={true}
        dayComponent={({ date, state }) => {
          const dayKey = date.dateString;
          const dayData = calenderData[dayKey];
          const isHighlighted = dayData?.highlight;

          return (
            <Pressable
              style={{ width: 50 }}
              onPress={() => {
                handleDayPress(date.dateString);
              }}
            >
              <View
                style={[
                  styles.dayContainer,
                  isHighlighted && styles.highlightedDay,
                ]}
              >
                <Text
                  style={{ color: state === "disabled" ? "#c5c5c5" : "#000" }}
                >
                  {date.day}
                </Text>
                <View style={styles.imageSlot}>
                  {dayData?.human_image && (
                    <Image
                      source={{ uri: dayData.human_image }}
                      style={styles.dayImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            </Pressable>
          );
        }}
        theme={{
          calendarBackground: "#fffaf3",
          textSectionTitleColor: "#000",
          textDayFontWeight: "500",
          textMonthFontSize: 16,
          monthTextColor: "#000",
          arrowColor: "#000",
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    // padding: 10,
    backgroundColor: "#fdf6ee",
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    height: 800,
  },

  dayContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    height: 60,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 6,
  },
  highlightedDay: {
    backgroundColor: "#f8b7b7",
    borderRadius: 12,
    paddingVertical: 6,
  },
  imageSlot: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  dayImage: {
    width: 30,
    height: 30,
  },
});

export default CustomCalendar;
