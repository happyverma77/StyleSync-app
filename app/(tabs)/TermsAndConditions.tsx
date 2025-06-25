import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";

const TermsAndConditions = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Terms of Service</Text>
      <Text style={styles.date}>Effective Date: December 10, 2024</Text>
      <Text style={styles.paragraph}>
        Welcome to StyleSync. By accessing or using our mobile application or
        any related services (collectively, the “App”), you agree to be bound by
        these Terms of Service (the “Terms”). If you do not agree, please
        discontinue use immediately.
      </Text>
      <Text style={styles.sectionTitle}>1. Overview of Services</Text>
      <Text style={styles.paragraph}>
        StyleSync is a fashion-focused mobile application that allows users to
        upload personal images and virtually try on clothing using AI-powered
        outfit generation. Users may also save styles, organize items into
        wardrobes, and share looks with others.
      </Text>

      <Text style={styles.sectionTitle}>2. Eligibility</Text>
      <Text style={styles.paragraph}>
        You must be at least 18 years old to use this App. By using StyleSync,
        you represent and warrant that you meet this age requirement and are
        fully able and competent to enter into these Terms.
      </Text>

      <Text style={styles.sectionTitle}>3. Account Registration</Text>
      <Text style={styles.paragraph}>
        To access the full features of StyleSync, you must create an account.
        You are responsible for keeping your login credentials secure and for
        all activity that occurs under your account. We reserve the right to
        suspend or delete accounts that violate these Terms.
      </Text>

      <Text style={styles.sectionTitle}>
        4. Subscription & In-App Purchases
      </Text>
      <Text style={styles.paragraph}>
        StyleSync offers optional paid features such as:
      </Text>
      <Text style={styles.listItem}>
        • Additional virtual wardrobe capacity
      </Text>
      <Text style={styles.listItem}>• Increased outfit try-on limits</Text>
      <Text style={styles.listItem}>
        • Ability to save multiple presets (avatars)
      </Text>
      <Text style={styles.listItem}>• Access to recent outfit history</Text>
      <Text style={styles.listItem}>• Enhanced sharing capabilities</Text>
      <Text style={styles.paragraph}>
        Subscriptions and payments are handled by the Apple App Store or Google
        Play, subject to their billing terms. Subscription fees are
        non-refundable unless stated otherwise.
      </Text>

      <Text style={styles.sectionTitle}>5. User Content</Text>
      <Text style={styles.paragraph}>
        You retain ownership of any photos or content you upload. However, by
        uploading, you grant StyleSync a limited, worldwide, non-exclusive,
        royalty-free license to use, display, process, and reproduce your
        content within the App for service functionality.
      </Text>
      <Text style={styles.paragraph}>You must not upload:</Text>
      <Text style={styles.listItem}>
        • Images of celebrities, public figures, or individuals other than
        yourself without their explicit consent
      </Text>
      <Text style={styles.listItem}>
        • Inappropriate, obscene, or infringing content
      </Text>
      <Text style={styles.paragraph}>
        We reserve the right to remove any content that violates these terms or
        is deemed unsuitable.
      </Text>

      <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
      <Text style={styles.paragraph}>
        All rights, title, and interest in and to the App (including but not
        limited to software, design, graphics, and branding) are owned by
        StyleSync or its licensors. You may not copy, modify, reverse engineer,
        distribute, or create derivative works without written consent.
      </Text>

      <Text style={styles.sectionTitle}>7. Restrictions on Use</Text>
      <Text style={styles.paragraph}>You agree not to:</Text>
      <Text style={styles.listItem}>• Use the App for unlawful purposes</Text>
      <Text style={styles.listItem}>
        • Attempt to gain unauthorized access to any part of the App
      </Text>
      <Text style={styles.listItem}>
        • Abuse or overload our AI or API services
      </Text>
      <Text style={styles.listItem}>
        • Bypass security features or exploit vulnerabilities
      </Text>
      <Text style={styles.paragraph}>
        Violation of these restrictions may result in immediate account
        termination.
      </Text>

      <Text style={styles.sectionTitle}>8. AI Output Disclaimer</Text>
      <Text style={styles.paragraph}>
        StyleSync uses third-party AI services to generate outfit
        visualizations. The results are simulations and may not reflect actual
        garment fit, material, or color accuracy. We are not responsible for
        user interpretation or use of generated content.
      </Text>

      <Text style={styles.sectionTitle}>9. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        Our App integrates with APIs and platforms such as Google Cloud, image
        generation APIs, and analytics tools. Use of these third-party services
        is subject to their respective terms and privacy policies.
      </Text>

      <Text style={styles.sectionTitle}>10. Termination</Text>
      <Text style={styles.paragraph}>
        We may suspend or terminate your account at any time if we believe you
        have violated these Terms, misused the App, or caused harm to other
        users or the platform.
      </Text>

      <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
      <Text style={styles.paragraph}>
        We reserve the right to update these Terms at any time. We will notify
        users of significant changes via the App or email. Continued use after
        changes implies acceptance.
      </Text>

      <Text style={styles.sectionTitle}>12. Governing Law</Text>
      <Text style={styles.paragraph}>
        These Terms are governed by the laws of Taiwan. Any disputes will be
        resolved by the Taipei District Court.
      </Text>

      <Text style={styles.sectionTitle}>13. Contact</Text>
      <Text style={styles.paragraph}>
        If you have any questions regarding these Terms, please contact us at:
        {"\n"}📧 [Insert contact email]
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    paddingBottom: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 6,
  },
});

export default TermsAndConditions;
