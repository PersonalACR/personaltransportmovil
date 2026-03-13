import { useState, useEffect } from "react";
import { Badge } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  FlatList,
  ImageBackground,
  Alert 
} from "react-native";
import { CameraView } from "expo-camera";
import { useCameraPermissions } from 'expo-camera';
import { HubConnectionBuilder, LogLevel, HubConnectionState, HttpTransportType } from '@microsoft/signalr';
import Button from "../components/Button";
import ModalPoup from "../components/ModalPoup";
import { GetTravelsApi, ChangeStatusTravel, RegisterPasengerBoarding, getUserData } from "../DataAccess/DataAccess";
import StatusTravel from "../constants/StatusTravel";
import { getTime } from "../Tools/Tools";

const hubUrl = "https://apipersonaltransport.argossolution.com/travelRT";

export default function HomeDriverPrivate() {
  const [listTravels, setTravels] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [imageMessage, setImageMessage] = useState();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTraveling, setIsTraveling] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [passengersScanned, setPassengersScanned,] = useState([]);
  const [connection, SetConnection] = useState(null);
  const [userData, setUserData] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    const travels = await GetTravelsApi();
    if (Array.isArray(travels)) {
      if (travels.some((it) => it.status === 1)) {
        setIsTraveling(true);
      } else {
        setIsTraveling(false);
      }
      setTravels(travels);
    } else {
      setTravels([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timerId);
  }, [isVisible]); 

  const handleBarCodeScanned = async (passengerId, travelId) => {
   
    if(!Number.isInteger(Number(passengerId))) {
        setMessage("QR no valido.");
        setImageMessage(require("../assets/error.png"));
        setIsVisible(true);
        return;
    }

    if(!isVisible && !isLoading){
      if(passengersScanned.find(x => x == passengerId) == undefined){
        setIsLoading(true);
        let resp = await RegisterPasengerBoarding(
          JSON.stringify({
            PassengerId: passengerId,
            TravelId: travelId
          })
        );

        setIsLoading(false);
        if (resp.status) {
          setPassengersScanned(resp.info.passengersOnBoard)
          setMessage(`Pasajero ${resp.info.passengerName} ha abordado exitosamente.`);
          setImageMessage(require("../assets/success.png"));
        } else {
          setMessage(resp.info);
          setImageMessage(require("../assets/error.png"));
        }
        
      }
      else {
        setMessage("Este pasajero ya ha sido escaneado.");
        setImageMessage(require("../assets/error.png"));
      }
      setIsVisible(true);
    }
    
  };

  const renderCamera = (travelId) => {
      return (
        <View style={styles.cameraContainer}>
          <CameraView
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: 'qr'
            }}
            onBarcodeScanned={
                    ({ data }) => {
                       
                        handleBarCodeScanned(data, travelId)
                    }
                }
            style={styles.camera}
          />
        </View>
      );
  };

  const renderSeatCount = (capacity, used, status) => {
      return (
        <View style={styles.seatCountContainer}>
          <Text style={styles.seatCountTitle}>Asientos</Text>
          <View style={styles.seatCount}>
            <Text style={styles.textLetterTitle}>{status == 1 ? "Disponible" : "Desocupados"}: <Text style={styles.seatsAvailable}>{capacity-used}</Text></Text>
            <Text style={styles.textLetterTitle}>{status == 1 ? "Ocupados" : "Utilizados"}: <Text style={styles.occupiedSeats}>{used}</Text></Text>
          </View>
        </View>
      );
  };

  useEffect(() => {
    (async () => {
      await getData();
      requestPermission();
      const data = await getUserData();
      setUserData(JSON.parse(data));

      const newConnection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          withCredentials: true,
          transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect() 
        .configureLogging(LogLevel.Information)
        .build();
        
      SetConnection(newConnection);

      return () => {
          if (newConnection) {
            newConnection.stop();
          }
      }
    })();
  }, []);

  const UpdateInfo = (newItem) => {
    const index = listTravels.findIndex((o) => o.travelID === newItem.travelID);
    if (index !== -1) {
      const updateTravels = [...listTravels];
      updateTravels[index] = newItem;
      setTravels(updateTravels);
    }
  };

  const confirmationAlert = async (travel, status) => {
    const action = status == 1 ? 'inicio' : status == 2 ? 'cancelación' : 'finalización';

    Alert.alert(
      `Confirmar ${action} del viaje`,
      `¿Estás seguro de que deseas ${action} este viaje?`, 
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Aceptar", 
          onPress: () => handleOptionPress(travel, status), 
          style: "destructive" 
        }
      ],
    );
  };

  const handleOptionPress = async (travel, status) => {
    setIsLoading(true);

    let resp = await ChangeStatusTravel(travel.travelID, status);

    if (resp.status === 1) {
      setIsTraveling(true);
    } else {
      setIsTraveling(false);
      travel.passengersOnBoard = passengersScanned;
      setPassengersScanned([]);
    }

    travel.status = resp.status;
    UpdateInfo(travel);
    setIsLoading(false);
    
  };

  const GetStatus = (status) => {
    switch (status) {
      case 0:
        return <Badge status="primary" value="Programado" />;
      case 1:
        return <Badge status="success" value="Iniciado" />;
      case 2:
        return <Badge status="warning" value="Cancelado" />;
      case 3:
        return <Badge status="secondary" value="Finalizado" />;
    }
  };

  const renderItem = ({ item }) => (
    <ImageBackground style={!isTraveling ? styles.card : isTraveling && item.status == 1 ? styles.card : styles.HiddenCard} key={item.travelID}>
      <View style={styles.cardContent}>
        <Text style={styles.textLetterTitle}>
          Folio: <Text style={styles.textLetter}>{item.folio}</Text>
        </Text>
        <Text style={styles.textLetterTitle}>
          Ruta: <Text style={styles.textLetter}>{item.routeName}</Text>
        </Text>
        <Text style={styles.textLetterTitle}>
          Cliente: <Text style={styles.textLetter}>{item.clientName}</Text>
        </Text>
        <Text style={styles.textLetterTitle}>
          Unidad: <Text style={styles.textLetter}>{item.unitName}</Text>
        </Text>
        <Text style={styles.textLetterTitle}>
          Hora de inicio:{" "}
          <Text style={styles.textLetter}>{getTime(item.programedDate)}</Text>
        </Text>
        <Text style={styles.textLetterTitle}>
          Status: {GetStatus(item.status)}
        </Text>
        {item.status == 1 ? <Text style={styles.textBordingTitle}>¡ Comienza a escanear !</Text> : ''}
        {item.status == 1 ? renderCamera(item.travelID) : ''}
        {item.status == 1 || item.status == 3 ? renderSeatCount(item.unitCapacity,passengersScanned.length == 0 && item.passengersOnBoard.length > 0 ? item.passengersOnBoard.length :passengersScanned.length,item.status) : <View></View>}
        <View style={styles.buttonContent}>
          {item.status === 0 ? (
            <Button
              icon={null}
              style={isTraveling ? styles.btnDisabled : styles.buttonSuccess}
              title="Iniciar"
              filled
              disabled={isTraveling}
              onPress={() =>
                confirmationAlert(item, StatusTravel.Started)
              }
            />
          ) : item.status === 1 ? (
            <>
              <Button
                icon={null}
                style={styles.buttonWarning}
                title="Cancelar"
                filled
                onPress={() =>
                  confirmationAlert(item, StatusTravel.Canceled)
                }
              />
              <Button
                icon={null}
                style={styles.buttonPrimary}
                title="Finalizar"
                filled
                onPress={() =>
                  confirmationAlert(item, StatusTravel.Finished)
                }
              />
            </>
          ) : (
            ""
          )}
        </View>
      </View>
    </ImageBackground>
  );

  useEffect(() => {
      if (connection !== null && connection.state === HubConnectionState.Disconnected) {
        connection.onreconnected(async () => {
            await connection.invoke("JoinGroup", userData.companyGroup);
        });

        connection.on("TravelsSignalR", (travelInfo) => {
          setTravels((prevItems) =>
                prevItems.map((item) => { 
                  if (item.travelID === travelInfo.travelId) {
                    if (travelInfo.status !== item.status) {
                      if(travelInfo.status !== 1){
                        setIsTraveling(false);
                        setPassengersScanned([]);
                        setMessage(`El viaje con el folio ${item.folio} sea finalizado.`);
                        setImageMessage(require("../assets/success.png"));
                        setIsVisible(true);
                        return {
                          ...item,
                          status: travelInfo.status,
                          passengersOnBoard: passengersScanned
                        };
                      } else {
                        return {
                          ...item,
                          status: travelInfo.status,
                        };
                      }
      
                    }
                  }
                  return item;
                })
          );
        });

        connection.start()
          .then(async () => {
            await connection.invoke("JoinGroup", userData.companyGroup);
          }).catch((err) => console.error("Error in SignalR:", err));
      }
  }, [connection]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={getData} />
      }
    >
      <View style={styles.container}>
        <ModalPoup
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          message={message}
          imageMessage={imageMessage}
        />
        <View style={styles.container}>
          {listTravels?.length > 0 ? (
            <FlatList
              data={listTravels}
              renderItem={renderItem}
              keyExtractor={(item) => item.folio}
            />
          ) : (
            <ImageBackground style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.textLetterDefault}>
                  No hay informacion para mostrar
                </Text>
              </View>
            </ImageBackground>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  seatCountTitle:{
    fontSize: 16,
    fontWeight: "bold",
    color: "#112236",
    width: "100%",
    textAlign: "center",
    marginBottom:10
  },
  seatsAvailable:{
    color: '#0f991d'
  },
  occupiedSeats:{
    color: '#e02510'
  },
  seatCount:{
    display: 'flex',
    flexDirection:'row',
    width:'100%',
    height:'auto',
    justifyContent: 'space-around'
  },
  seatCountContainer:{
    display: 'flex',
    flexDirection: 'column',
    width:'100%',
    height:'auto',
    marginBottom:15
  },
  cameraContainer: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  camera: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  HiddenCard:{
    display: 'none'
  },
  card: {
    width: "100%",
    height: "auto",
    marginBottom: 20,
    flex: 1,
  },
  cardContent: {
    borderRadius: 12,
    backgroundColor: "#dbe4ed",
    padding: 15,
    flex: 1,
    flexDirection: "column",
  },
  textLetterTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#112236",
  },
  textBordingTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#112236",
    width: "100%",
    textAlign: "center",
    marginTop: 15
  },
  buttonSuccess: {
    width: "30%",
    textAlign: "center",
    paddingBottom: 5,
    paddingVertical: 5,
    justifyContent: "flex-end",
    backgroundColor: "#5cb85c",
    borderColor: "#5cb85c",
    margin: 5,
  },
  btnDisabled: {
    width: "30%",
    textAlign: "center",
    paddingBottom: 5,
    paddingVertical: 5,
    justifyContent: "flex-end",
    backgroundColor: "#cccccc",
    color: "#999999",
    borderColor: "#cccccc",
    margin: 5,
  },
  buttonWarning: {
    width: "30%",
    textAlign: "center",
    paddingBottom: 5,
    paddingVertical: 5,
    justifyContent: "flex-end",
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    margin: 5,
  },
  buttonPrimary: {
    width: "30%",
    textAlign: "center",
    paddingBottom: 5,
    paddingVertical: 5,
    justifyContent: "flex-end",
    backgroundColor: "#365b77",
    borderColor: "#365b77",
    margin: 5,
  },
  buttonContent: {
    fle: 1,
    flexDirection: "row",
    alignContent: "flex-end",
    justifyContent: "center",
    margin: "auto",
  },
  textLetter: {
    fontSize: 12,
    color: "#436280",
  },
  textLetterDefault: {
    fontSize: 18,
    color: "#436280",
    textAlign: "center",
  },
});