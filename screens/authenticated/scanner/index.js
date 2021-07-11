import { AntDesign } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, Button, Text, TouchableOpacity } from "react-native";
// Controllers
import JobsController from "../../../controllers/JobsControllers";


export default function Scanner({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    try {
      setScanned(true);
      await JobsController.validateQrCode(route.params?.deployee, data);
      navigation.goBack();
    } catch (e) {
      Alert.alert("QR Code Scan Failed", e.message)
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={{ flex: 1 }} >

      <SafeAreaView
        style={{ flex: 1, justifyContent: "space-between", alignItems: "stretch", margin: 12, backgroundColor: "transparent" }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            backgroundColor: "#fffa",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 28,
            height: 56,
            width: 56,
          }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={28} color={"#000a"} />
        </TouchableOpacity>

        {scanned && <Button title="RESCAN" color='#fff' onPress={() => setScanned(false)} />}
      </SafeAreaView>
    </BarCodeScanner>
  );
}
