import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import COLORS from "../constants/colors";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";
import { getProfile, LogOutApi, UpdateProfile } from "../DataAccess/DataAccess";
import { handleOnChangeCellNumber, IsNullOrEmpty } from "../Tools/Tools";
import ModalPoup from "../components/ModalPoup";

const Profile = ({ setIsLogued }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [cellPhone, setCellPhone] = useState(null);
  const [imageMessage, setImageMessage] = useState();
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  /*Change Password*/
  const [isPasswordShown, setIsPasswordShown] = useState(true);
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(true);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  const [profile, setProfile] = useState({});
  const getProfileLocal = async () => {
    setRefreshing(true);
    const profileInformation = await getProfile();
    if (profileInformation) {
      setRefreshing(false);
    }
    setProfile(profileInformation);
  };
  const handleUpdateProfile = async () => {
    const infoUserUpdate = {
      name: name,
      lastName: lastName,
      email: email,
      phoneNumber: cellPhone,
      oldPassword: oldPassword,
      newPassword: newPassword,
    };
    if (
      !IsNullOrEmpty(name) &&
      !IsNullOrEmpty(lastName) &&
      !IsNullOrEmpty(email) &&
      !IsNullOrEmpty(cellPhone)
    ) {
      if (!IsNullOrEmpty(oldPassword) || !IsNullOrEmpty(newPassword)) {
        if (!IsNullOrEmpty(oldPassword) && !IsNullOrEmpty(newPassword)) {
          console.log("Entro2");
          setIsVisible(false);
          setRefreshing(true);
          const resp = await UpdateProfile(infoUserUpdate);
          setProfile(resp);
          setRefreshing(false);
          setImageMessage(require("../assets/success.png"));
          setMessage("Informacion Actualizada.");
          setIsVisible(true);
        } else {
          setImageMessage(require("../assets/error.png"));
          setMessage("Revise su contraseña.");
          setIsVisible(true);
        }
      } else {
        console.log("Entro1");
        setIsVisible(false);
        setRefreshing(true);
        const resp = await UpdateProfile(infoUserUpdate);
        setProfile(resp);
        setRefreshing(false);
        setImageMessage(require("../assets/success.png"));
        setMessage("Informacion Actualizada.");
        setIsVisible(true);
      }
    } else {
      // mensaje de que no debe haber campos vacios
      setImageMessage(require("../assets/error.png"));
      setMessage("Verifique su informacion.");
      setIsVisible(true);
    }
  };
  useEffect(() => {
    getProfileLocal();
  }, []);
  useEffect(() => {
    setName(profile?.name);
    setLastName(profile?.lastName);
    setEmail(profile?.email);
    setCellPhone(profile?.phoneNumber);
    setOldPassword("");
    setNewPassword("");
  }, [profile, refreshing]);
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getProfileLocal} />
      }
    >
      <ModalPoup
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        message={message}
        imageMessage={imageMessage}
      />
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require("../assets/icon-user.png")} 
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text
            style={styles.profileName}
          >{`${profile?.name} ${profile?.lastName}`}</Text>
          <Text style={styles.profileStatus}></Text>
        </View>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.aboutTitle}>Actualiza tu informacion</Text>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Nombre
          </Text>

          <View style={styles.inputText}>
            <TextInput
              onChangeText={setName}
              placeholder="Ingresa tu nombre"
              placeholderTextColor={COLORS.black}
              keyboardType="text"
              style={{
                width: "100%",
              }}
              value={name !== null ? name : profile?.name}
            />
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Apellido
          </Text>

          <View style={styles.inputText}>
            <TextInput
              onChangeText={setLastName}
              placeholder="Ingresa tu appellido"
              placeholderTextColor={COLORS.black}
              keyboardType="text"
              style={{
                width: "100%",
              }}
              value={lastName !== null ? lastName : profile?.lastName}
            />
          </View>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 400,
              marginVertical: 8,
            }}
          >
            Correo electrónico
          </Text>

          <View style={styles.inputText}>
            <TextInput
              onChangeText={setEmail}
              placeholder="Ingresa tu correo electrónico"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
              value={email !== null ? email : profile?.email}
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
            Celular
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 22,
            }}
          >
            <TextInput
              value={cellPhone !== null ? cellPhone : profile?.phoneNumber}
              onChangeText={(text) => {
                handleOnChangeCellNumber(text, cellPhone, setCellPhone);
              }}
              keyboardType="number-pad"
              placeholder="Ingresa tu número de celular"
              placeholderTextColor={COLORS.black}
              style={{
                width: "80%",
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Cambiar contraseña</Text>
        <View style={styles.infoSection}>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 400,
                marginVertical: 8,
              }}
            >
              Constraseña anterior
            </Text>
            <View style={styles.inputText}>
              <TextInput
                defaultValue={oldPassword}
                onChangeText={setOldPassword}
                keyboardType="default"
                secureTextEntry={isPasswordShown}
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
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 400,
                marginVertical: 8,
              }}
            >
              Nueva constraseña
            </Text>
            <View style={styles.inputText}>
              <TextInput
                defaultValue={oldPassword}
                onChangeText={setNewPassword}
                keyboardType="default"
                secureTextEntry={isNewPasswordShown}
                style={{
                  width: "100%",
                }}
              />
              <TouchableOpacity
                onPress={() => setIsNewPasswordShown(!isNewPasswordShown)}
                style={{
                  position: "absolute",
                  right: 12,
                }}
              >
                {isNewPasswordShown == true ? (
                  <Ionicons name="eye-off" size={24} color={COLORS.black} />
                ) : (
                  <Ionicons name="eye" size={24} color={COLORS.black} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.buttons}>
              <Button
                onPress={() => {
                  handleUpdateProfile();
                }}
                title="Actualizar"
                filled
                icon="edit"
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                }}
              />
              <Button
                icon="logout"
                onPress={() => {
                  LogOutApi();
                  setIsLogued(false);
                }}
                title="Salir"
                filled
                style={{
                  flex: 1,
                  marginHorizontal: 10,
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#e0e0e0",
  },
  profileBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#5cb85c",
    padding: 5,
    borderRadius: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileStatus: {
    fontSize: 16,
    color: "#999",
  },
  infoSection: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    width: 80,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
  },
  inputText: {
    width: "100%",
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22,
  },
});


export default Profile;