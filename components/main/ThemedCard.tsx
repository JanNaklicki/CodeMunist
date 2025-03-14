import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  PanResponder,
  Animated,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Tables } from "@/database.types";
import { UsersService } from "@/services/users.service";
type Items = Tables<"Items">;

interface ThemedCardProps {
  item: Items;
  onDelete: (id: number) => void;
}

const ThemedCard: React.FC<ThemedCardProps> = ({ item, onDelete }) => {
  const [ownerName, setOwnerName] = useState<string | null>(null);
  const userService = new UsersService();
  const pan = React.useRef(new Animated.ValueXY()).current;

  // const panResponder = React.useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderMove: Animated.event([null, { dx: pan.x }], {
  //       useNativeDriver: false,
  //     }),
  //     onPanResponderRelease: (e, gestureState) => {
  //       if (gestureState.dx > 50) {
  //         onDecrease(item.id, item.amount);
  //       } else if (gestureState.dx < -50) {
  //         onIncrease(item.id, item.amount);
  //       }
  //       Animated.spring(pan, {
  //         toValue: { x: 0, y: 0 },
  //         useNativeDriver: false,
  //       }).start();
  //     },
  //   })
  // ).current;

  useEffect(() => {
    const fetchOwnerName = async () => {
      const owner = await userService.GetProfile(item.user_id);
      console.log(owner);
      setOwnerName(owner?.username ?? "Unknown");
    };
    fetchOwnerName();
  }, [item.user_id]);

  return (
    <Animated.View
      // {...panResponder.panHandlers}
      style={[styles.card, { transform: [{ translateX: pan.x }] }]}
    >
      <View style={styles.infoContainer}>
        <ThemedText type="title">{item.name}</ThemedText>
        <ThemedText>
          {new Date(item.created_at).toLocaleDateString()}
        </ThemedText>
        <ThemedText type="default">Owner: {ownerName}</ThemedText>
        {/* <ThemedText type="default">Ammount: {item.amount}</ThemedText> */}
      </View>
      <View style={styles.actionContainer}>
        <ThemedText type="default">Priece: {item.amount + " zł"}</ThemedText>
        <Ionicons
          name="archive"
          size={24}
          color="#ff5c5c"
          onPress={() => {
            onDelete(item.id);
          }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoContainer: {
    flex: 2,
  },
  actionContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

export default ThemedCard;
