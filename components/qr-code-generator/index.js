import React from "react";
import { View, Dimensions, Platform } from "react-native";
import { WebView } from "react-native-webview";

const square = 1000;

export default function QRCode({ value }) {
  return (
    <View style={{ width: Platform.OS == "android" ? 250 : square * 0.25, height: Platform.OS == "android" ? 260 : square * 0.25 }}>
      <WebView
        scalesPageToFit={false}
        containerStyle={{ padding: 0, margin: 0 }}
        focusable={false}
        bounces={false}
        cacheEnabled={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        allowsBackForwardNavigationGestures={false}
        source={{
          html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <title>QR Code Styling</title>
              <script type="text/javascript" src="https://unpkg.com/qr-code-styling/lib/qr-code-styling.js"></script>
              <style>
              * {
                  padding: 0;
                  margin: 0;
              }
              </style>
          </head>
          <body>
              <div id="canvas"></div>
              <script type="text/javascript">

                  const qrCode = new QRCodeStyling({
                      width: ${Platform.OS == "android" ? 250 : square},
                      height: ${Platform.OS == "android" ? 250 : square},
                      data: "${value}",
                      // image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
                      dotsOptions: {
                          color: "#4267b2",
                          type: "rounded"
                      }
                  });

              qrCode.append(document.getElementById("canvas"));
              </script>
          </body>
          </html>`,
        }}
      />
    </View>
  );
}
