// ImageViewerModal.js
import React from "react";
import ImageViewing from "react-native-image-viewing";

const ImageViewerModal = ({ visible, imageUrl, onRequestClose }) => {
  return (
    <ImageViewing
      images={[{ uri: imageUrl }]}
      imageIndex={0}
      visible={visible}
      onRequestClose={onRequestClose}
    />
  );
};

export default ImageViewerModal;
