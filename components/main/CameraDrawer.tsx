import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CameraDrawerProps {
  onClose: () => void;
  onSubmit: (data: {
    barcode: string;
    productName: string;
    priece: string;
  }) => void;
  horizontal: boolean;
}

export default function CameraDrawer({
  onClose,
  onSubmit,
  horizontal,
}: CameraDrawerProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [active, setActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [productName, setProductName] = useState("");
  const [priece, setPriece] = useState("");

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const fetchProductName = async (barcode: string) => {
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();
      return {
        name: data.product?.product_name || "Unknown product",
        priece: data.product?.price || "Unknown price",
      };
    } catch (error) {
      console.error("Error fetching product:", error);
      return "Unknown product";
    }
  };

  const handleBarcodeScanned = async (
    scanningResult: BarcodeScanningResult
  ) => {
    const barcode = scanningResult.data;
    const productName = await fetchProductName(barcode);
    setBarcode(barcode);
    if (productName !== "Unknown product") {
      setProductName(productName.name);
      setPriece(productName.priece);
    }
    setScanned(true);
  };

  const handleScanPress = () => {
    setActive(true);
    setScanned(false);
  };

  const handleAcceptPress = () => {
    onSubmit({ barcode, productName, priece });
    handleClose();
  };

  const handleClose = () => {
    setActive(false);
    setScanned(false);
    onClose();
  };

  const handleCancelPress = () => {
    setScanned(false);
    setActive(false);
    setBarcode("");
    setProductName("");
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        active={active}
        onBarcodeScanned={active && !scanned ? handleBarcodeScanned : undefined}
      >
        <Animated.View style={[styles.drawer]}>
          <View
            style={[
              styles.buttonContainer,
              horizontal && styles.horizontalButtons,
            ]}
          >
            <View style={styles.emptyColumn} />
            {!scanned ? (
              <TouchableOpacity
                style={[styles.button]}
                onPress={handleScanPress}
              >
                <View style={styles.scanButton}>
                  <MaterialIcons
                    name="barcode-reader"
                    size={24}
                    color="white"
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={handleAcceptPress}
              >
                <View style={styles.acceptButton}>
                  <Ionicons name="checkmark" size={24} color="white" />
                </View>
              </TouchableOpacity>
            )}
            {!horizontal && (
              <TouchableOpacity
                style={styles.button}
                onPress={scanned ? handleCancelPress : handleClose}
              >
                <View
                  style={scanned ? styles.cancelButton : styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="white" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "rgb(255, 255, 255)",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  horizontalButtons: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  camera: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)",
  },
  emptyColumn: {
    flex: 1,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: "flex-end",
  },
  scanButton: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.82)",
  },
  acceptButton: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: "rgba(0, 128, 0, 0.82)",
  },
  closeButton: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: "rgba(231, 53, 53, 0.79)",
  },
  cancelButton: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: "rgba(255, 165, 0, 0.82)",
  },
});
