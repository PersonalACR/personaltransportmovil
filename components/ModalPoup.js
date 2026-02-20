import { useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";

const ModalPoup = ({ isVisible, setIsVisible, message, imageMessage }) => {
  useEffect(() => {}, [isVisible]);
  return (
    <Modal transparent visible={isVisible}>
      <View style={styles.modalBackGround}>
        <Animated.View style={[styles.modalContainer]}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Image
                  source={require("../assets/x.png")}
                  style={{ height: 30, width: 30 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Image
              source={imageMessage}
              style={{ height: 150, width: 150, marginVertical: 10 }}
            />
          </View>

          <Text
            style={{ marginVertical: 30, fontSize: 20, textAlign: "center" }}
          >
            {message}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalPoup;

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
