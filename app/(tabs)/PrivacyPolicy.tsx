import { useLang } from "@/utils/LangContext";
import React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";

const PrivacyPolicy: React.FC = () => {
  const { t, lang, switchLanguage } = useLang();

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>
          {t("Privacy_Policy.title")}: December 10, 2024
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            1. {t("Privacy_Policy.firstHeadingTitle")}{" "}
          </Text>
          {t("Privacy_Policy.firstHeading")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            2. {t("Privacy_Policy.secondHeadingTitle")}
          </Text>{" "}
          {t("Privacy_Policy.secondHeading")}
        </Text>

        <Text style={[styles.bodyText, styles.listText]}>
          &#8901; {t("Privacy_Policy.secondHeading1")}
          {"\n"}
          &#8901; {t("Privacy_Policy.secondHeading2")}
          {"\n"}
          &#8901; {t("Privacy_Policy.secondHeading3")}
          {"\n"}
          &#8901; {t("Privacy_Policy.secondHeading4")}
          {"\n"}
          &#8901; {t("Privacy_Policy.secondHeading5")}
          {"\n"}
          &#8901; {t("Privacy_Policy.secondHeading6")}
        </Text>

        <Text style={styles.boldText}>
          3. {t("Privacy_Policy.thirdHeading")}
        </Text>
        <Text style={[styles.bodyText, styles.listText]}>
          &#8901; {t("Privacy_Policy.thirdHeading1")}
          {"\n"}
          &#8901; {t("Privacy_Policy.thirdHeading2")}
          {"\n"}
          &#8901; {t("Privacy_Policy.thirdHeading3")}
          {"\n"}
          &#8901; {t("Privacy_Policy.thirdHeading4")}
          {"\n"}
          &#8901; {t("Privacy_Policy.thirdHeading5")}
          {"\n"}
          &#8901; {t("Privacy_Policy.thirdHeading6")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            4. {t("Privacy_Policy.fourthHeading1")}
          </Text>{" "}
          {t("Privacy_Policy.fourthHeading2")}
        </Text>
        <Text style={[styles.bodyText, styles.listText]}>
          &#8901; {t("Privacy_Policy.fourthHeading3")}
          {"\n"}
          &#8901; {t("Privacy_Policy.fourthHeading4")}
          {"\n"}
          &#8901; {t("Privacy_Policy.fourthHeading5")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            5. {t("Privacy_Policy.fifthHeading")}
          </Text>
          {t("Privacy_Policy.fifthHeading1")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            6. {t("Privacy_Policy.sixthHeading")}
          </Text>{" "}
          {t("Privacy_Policy.sixthHeading1")}
        </Text>
        <Text style={[styles.bodyText, styles.listText]}>
          &#8901; {t("Privacy_Policy.sixthHeading2")}
          {"\n"}
          &#8901; {t("Privacy_Policy.sixthHeading3")}
          {"\n"}
          &#8901; {t("Privacy_Policy.sixthHeading4")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            7. {t("Privacy_Policy.seventhHeading")}
          </Text>{" "}
          {t("Privacy_Policy.seventhHeading1")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            8. {t("Privacy_Policy.eighthHeading")}
          </Text>{" "}
          {t("Privacy_Policy.eighthHeading1")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            9. {t("Privacy_Policy.ninthHeading")}
          </Text>{" "}
          {t("Privacy_Policy.ninthHeading1")}
        </Text>

        <Text style={styles.bodyText}>
          <Text style={styles.boldText}>
            10. {t("Privacy_Policy.tenthHeading")}
          </Text>
          {t("Privacy_Policy.tenthHeading1")} [Insert Contact Email].{"\n"}
          {t("Privacy_Policy.eleventhHeading")}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: 30,
  },
  contentContainer: {
    maxWidth: 768,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  titleText: {
    color: "black",
    fontSize: 15,
    marginBottom: 12,
  },
  bodyText: {
    color: "black",
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 25,
  },
  boldText: {
    fontWeight: "bold",
  },
  listText: {
    marginLeft: 10,
  },
});

export default PrivacyPolicy;
