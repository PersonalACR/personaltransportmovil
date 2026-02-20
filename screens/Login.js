import {
  View,
  Text,
  Pressable,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Button from "../components/Button";
import { LogInAxios } from "../DataAccess/DataAccess";
import { useNavigation } from "@react-navigation/native";

const Login = ({ setIsLogued }) => {
  const navigation = useNavigation();
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const OnSubmit = async () => {
    const model = {
      email: email,
      password: password,
    };

    setIsLoading(true);
    const resp = await LogInAxios(JSON.stringify(model));
    setIsLoading(false);

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
          { text: 'Cerrar', onPress: () => setIsVisible(false)},
        ],
        { cancelable: false }
      );
    }
  }, [isVisible]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {isLoading && <View style={{ position: "absolute", height: '100%', width: '100%', zIndex: 10}}>
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color="#000" /></View></View>}
      <View style={{ flex: 1, marginHorizontal: 22, justifyContent: "center" }}>
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              marginVertical: 10,
              color: COLORS.black,
              textAlign: "center",
            }}
          >
            Hola Bienvenido ! 👋
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
              disabled={isLoading}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Contraseña
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
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={COLORS.black}
              secureTextEntry={isPasswordShown}
              disabled={isLoading}
              style={{
                width: "100%",
              }}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={COLORS.black} />
              ) : (
                <Ionicons name="eye" size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
          }}
        >
          <Pressable disabled={isLoading} onPress={() => navigation.navigate("ForgotPassword")}>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.primary,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Recuperar contraseña
            </Text>
          </Pressable>
        </View>

        <Button
          onPress={OnSubmit}
          title="Entrar"
          disabled={isLoading}
          filled
          style={{
            marginTop: 25,
            marginBottom: 15,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Login;
