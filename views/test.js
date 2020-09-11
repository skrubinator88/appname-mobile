import React, { useState } from "react";
import { View, Button } from "react-native";

import Modal from "react-native-modal";

export default Test = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Open Modal" onPress={() => setShowModal(!showModal)} />

      <Modal isVisible={showModal}>
        <Button title="Close Modal" onPress={() => setShowModal(!showModal)} />
      </Modal>
    </View>
  );
};
