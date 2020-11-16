import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, SafeAreaView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

// components
import Header from "../../../components/header";

// Controllers
import JobsController from "../../../controllers/JobsControllers";

export default function Scanner({ navigation, project_manager_id, contractor_id }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    JobsController.validateQrCode(project_manager, contractor, data);
    // navigation.goBack();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <Header navigation={navigation} />
      <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ flex: 1 }} />
    </>
  );
}
