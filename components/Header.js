import { Image, StyleSheet, View, Text } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require("../assets/icon-bus.png")} style={styles.logo} />
      <Text style={styles.TextHeader}>TrBus</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#365b77",
  },
  logo: {
    width: 30,
    height: 30,
  },
  TextHeader: {
    marginLeft: 10,
    fontSize: 25,
    color: "#F2F2F2",
  },
});

export default Header;