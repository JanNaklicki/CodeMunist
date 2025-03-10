import {
  Image,
  StyleSheet,
  Platform,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ThemedCard from "@/components/main/ThemedCard";
import CameraDrawer from "@/components/main/CameraDrawer";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ItemsService } from "@/services/items.service";
import { Tables } from "@/database.types";
import { parse } from "@babel/core";
import { useSession } from "@/contexts/SessionContext";
import { Redirect } from "expo-router";
import ProtectedRoute from "@/components/ProtectedRoute";
type Items = Tables<"Items">;

export default function HomeScreen() {
  const [isCameraDrawerOpen, setCameraDrawerOpen] = useState(false);
  const [items, setItems] = useState<Items[] | null>(null);
  const { session, role } = useSession();

  const itemsService = new ItemsService();

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

  const openCameraDrawer = () => {
    setCameraDrawerOpen(true);
  };

  const closeCameraDrawer = () => {
    setCameraDrawerOpen(false);
  };

  const handleSubmit = async (data: {
    barcode: string;
    productName: string;
  }) => {
    if (data.barcode === "") {
      alert("Invalid barcode");
      return;
    }

    if (session?.user.id === undefined) {
      alert("User not found");
      return;
    }

    await itemsService.AddItem({
      id: 0,
      amount: 0,
      barcode: data.barcode,
      name: data.productName,
      user_id: session?.user.id,
      created_at: new Date().toISOString().split("T")[0],
    });
    const items = await itemsService.GetAllItems();
    setItems(Array.isArray(items) ? items : null);
    closeCameraDrawer();
  };

  if (!session) {
    return <Redirect href="/auth" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
      </View>
      {isCameraDrawerOpen && (
        <CameraDrawer onSubmit={handleSubmit} onClose={closeCameraDrawer} />
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
