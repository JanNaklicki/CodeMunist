import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ItemsService } from "@/services/items.service";
import { Tables } from "@/database.types";
import { useSession } from "@/contexts/SessionContext";
import { Redirect } from "expo-router";
import CameraDrawer from "@/components/main/CameraDrawer";
import ThemedCard from "@/components/main/ThemedCard";
import * as ScreenOrientation from "expo-screen-orientation";
import { Accelerometer } from "expo-sensors";

type Items = Tables<"Items">;

export default function HomeScreen() {
  const [isCameraDrawerOpen, setCameraDrawerOpen] = useState(false);
  const [items, setItems] = useState<Items[] | null>(null);
  const { session } = useSession();
  const itemsService = new ItemsService();
  const { width, height } = useWindowDimensions();
  const [orientation, setOrientation] = useState<number | null>(null);
  const [shakeDetected, setShakeDetected] = useState(false);

  useEffect(() => {
    const getOrientation = async () => {
      const currentOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(currentOrientation);
    };

    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => {
        setOrientation(event.orientationInfo.orientation);
      }
    );

    getOrientation();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const isHorizontal =
    width > height ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  useEffect(() => {
    const fetchItems = async () => {
      const data = await itemsService.GetAllItems();
      setItems(data);
    };
    fetchItems();
  }, []);

  const refetchItems = async () => {
    const data = await itemsService.GetAllItems();
    setItems(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (id: number) => {
    await itemsService.DeleteItem(id);
    await refetchItems();
  };

  const openCameraDrawer = () => setCameraDrawerOpen(true);
  const closeCameraDrawer = () => setCameraDrawerOpen(false);

  const handleSubmit = async (data: {
    barcode: string;
    productName: string;
    priece: string;
  }) => {
    if (!data.barcode) {
      alert("Invalid barcode");
      return;
    }
    if (!session?.user.id) {
      alert("User not found");
      return;
    }
    await itemsService.AddItem({
      id: 0,
      amount: data.priece,
      barcode: data.barcode,
      name: data.productName,
      user_id: session.user.id,
      created_at: new Date().toISOString().split("T")[0],
    });
    refetchItems();
    closeCameraDrawer();
  };

  if (!session) {
    return <Redirect href="/auth" />;
  }

  useEffect(() => {
    let lastShakeTime = Date.now();

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const acceleration = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (acceleration > 2.0 && now - lastShakeTime > 1000) {
        lastShakeTime = now;
        setShakeDetected((prev) => !prev);
      }
    });

    Accelerometer.setUpdateInterval(200);

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (items) {
      setItems([...items].reverse());
    }
  }, [shakeDetected]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {isHorizontal ? (
        <CameraDrawer
          onSubmit={handleSubmit}
          onClose={closeCameraDrawer}
          horizontal={isHorizontal}
        />
      ) : (
        <View style={{ flex: 1, paddingTop: 50 }}>
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <ThemedText type="title">Items</ThemedText>
              <ThemedText type="subtitle">Count: {items?.length}</ThemedText>
            </View>
            {items?.length === 0 && (
              <ThemedText type="default">No items found</ThemedText>
            )}
            {items?.map((item) => (
              <ThemedCard item={item} onDelete={handleDelete} key={item.id} />
            ))}
            {!isCameraDrawerOpen && (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={openCameraDrawer}
              >
                <MaterialIcons name="barcode-reader" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
          {isCameraDrawerOpen && (
            <CameraDrawer
              onSubmit={handleSubmit}
              onClose={closeCameraDrawer}
              horizontal={false}
            />
          )}
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 20,
    position: "relative",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 15,
  },
});
