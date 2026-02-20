import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://back-j10z.onrender.com/api/";

export const LogInAxios = async (model) => {
  const headers = {
    "Content-Type": "application/json",
    accept: "text/plain",
  };
  let url = `${baseURL}Account/Login`;
  const user = await axios
    .post(url, model, { headers })
    .then(async (resp) => {
      if (resp.status === 200) {
        const rep = await setStoreUserData(resp.data);
        if (rep) {
          return { status: true, info: resp.data };
        }
      } else {
        return {
          status: false,
          info: "Usuario o contraseña incorrectos, verifique su informacion.",
        };
      }
    })
    .catch((e) => {
      return {
        status: false,
        info: "Usuario o contraseña incorrectos, verifique su informacion.",
      };
    });

  return user;
};

export const GetTravelsApi = async () => {
  const user = await getUserData();
  const config = {
    headers: { Authorization: `Bearer ${JSON.parse(user).token}` },
  };
  let url = `${baseURL}Travel/GetTravelsByDriver`;
  const travels = await axios
    .get(url, config)
    .then((resp) => {
      return resp.data;
    })
    .catch((e) => {
      if (e.response.status === 401) {
        LogOutApi();
      }
      return e.response.data.errors.error;
    });

  return travels;
};

export const ChangeStatusTravel = async (travelId, newStatus) => {
  const user = await getUserData();
  let response = null;

  const fullUrl = `${baseURL}Travel/ChangeStatusTravel/${travelId}/${newStatus}`;
  
  response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "text/plain",
      Authorization: `Bearer ${JSON.parse(user).token}`,
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      try {
        return data;
      } catch (e) {
        return e;
      }
    })
    .catch((error) => {
      return false;
    });
  return response;
};

export const RegisterPasengerBoarding = async (model) => {
  const user = await getUserData();
   
  const headers = {
    "Content-Type": "application/json",
    accept: "text/plain",
    Authorization: `Bearer ${JSON.parse(user).token}`,
  };

  let url = `${baseURL}Travel/RegisterPassengerBoarding`;

  const response = await axios
    .post(url, model, { headers,validateStatus: function (status) {
    
    return status => 500; 
  } })
    .then(async (resp) => {
      if (resp.status === 200) {
          return { status: true, info: resp.data };
      } 
      else if (resp.status === 401) {
        LogOutApi();
      }
      else {
        return {
          status: false,
          info: resp.data,
        };
      }
    })
    .catch(() => {
      return {
        status: false,
        info: "Ocurrio algo, intentelo de nuevo.",
      };
    });

    return response;
};

export const getProfile = async () => {
  const user = await getUserData();
  let resp = fetch(`${baseURL}Account/GetProfile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(user).token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return { status: false, message: error };
    });
  return resp;
};

export const UpdateProfile = async (model) => {
  const user = await getUserData();
  let response = null;
  response = await fetch(`${baseURL}Account/UpdateProfile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "text/plain",
      Authorization: `Bearer ${JSON.parse(user).token}`,
    },
    body: JSON.stringify(model),
  })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      return data;
    })
    .catch((e) => {
      return false;
    });
  return response;
};

export const LogOutApi = () => {
  removeUserData("user");
};

const removeUserData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

export const getUserData = async () => {
  let respUser = await AsyncStorage.getItem("user")
    .then((value) => {
      if (value) {
        return value;
      }
    })
    .catch((error) => {
      return error;
    });
  return respUser;
};

const setStoreUserData = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};