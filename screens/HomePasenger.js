import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { getProfile } from "../DataAccess/DataAccess";

const HomePasenger = () => {
  const [refreshing, setRefreshing] = useState(false);

  const [profile, setProfile] = useState({});
  const getProfileLocal = async () => {
    setRefreshing(true);
    const profileInformation = await getProfile();
    if (profileInformation) {
      setRefreshing(false);
    }
    setProfile(profileInformation);
  };
  useEffect(() => {
    getProfileLocal();
  }, []);
  useEffect(() => {}, [profile]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getProfileLocal} />
        }
      >
        <View style={{ flex: 1, marginHorizontal: 0 }}>
          <View style={styles.card}>
            <View style={styles.header}></View>
            <Text
              style={styles.name}
            >{`${profile.name?.toUpperCase()} ${profile.lastName?.toUpperCase()}`}</Text>
            <View style={styles.barcodeContainer}>
              <QRCode
                value={profile?.user?.toString()} // The data to be encoded in the QR code
                size={300} // The size of the QR code in pixels
                color="#000" // The color of the QR code
                backgroundColor="#fff" // The background color of the QR code
                errorCorrectionLevel="H" // The error correction level
                quietZone={4} // The quiet zone size
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    margin: 30,
  },
  phoneNumber: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  barcodeContainer: {
    alignItems: "center",
  },
  barcode: {
    width: 200,
    height: 400,
  },
  header: {
    width: "100%",
    backgroundColor: COLORS.primary,
    height: 100,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default HomePasenger;
