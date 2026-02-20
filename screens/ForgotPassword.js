import {
  View,
  Text,
  Pressable,
  TextInput,
  Alert
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import Button from "../components/Button";
import { LogInAxios } from "../DataAccess/DataAccess";
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = ({ setIsLogued }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const OnSubmit = async () => {
    const model = {
      email: email,
      password: password,
    };
    const resp = await LogInAxios(JSON.stringify(model));
    if (!resp.status) {
      setIsVisible(true);
      setMessage(resp.info);
    } else {
      setIsLogued(true);
    }
  };
  useEffect(() => {
    if(isVisible){
          Alert.alert(
            'Mensaje',
            message,
            [
              { text: 'OK', onPress: () => setIsVisible(false) },
              { text: 'Cerrar', onPress: () => setIsVisible(false), style: 'cancel'},
            ],
            { cancelable: false } // Prevents dismissal by tapping outside on Android
          );
        }
  }, [isVisible]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 30 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginVertical: 30,
              color: COLORS.black,
              textAlign: "center",
            }}
          >
            Recuperar contraseña
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Correo electrónico
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              onChangeText={setEmail}
              placeholder="Ingresa tu correo electrónico"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
            />
          </View>
        </View>
        <Button
          onPress={OnSubmit}
          title="Recuperar"
          filled
          style={{
            marginBottom: 4,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
          <Text style={{ fontSize: 14 }}>
            recupera tu contraseña o regresa al inicio de sesion
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
          }}
        >
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 16,
                color: COLORS.primary,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Inicia sesion
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
