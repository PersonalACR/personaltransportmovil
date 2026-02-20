import { Badge } from "react-native-elements";
export const getTime = (fechaString) => {
  const fecha = new Date(fechaString);
  const hora = fecha.getHours();
  const minutos = fecha.getMinutes();
  const amPm = hora >= 12 ? "PM" : "AM";
  const horaFormateada = hora === 0 ? 12 : hora > 12 ? hora - 12 : hora;
  const minutosFormateados = minutos.toString().padStart(2, "0");
  return `${horaFormateada}:${minutosFormateados} ${amPm}`;
};

export const IsNullOrEmpty = (value) => {
  if (value === "" || value === undefined || value === null) {
    return true;
  } else {
    return false;
  }
};

export const GetStatus = (status) => {
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
const formatCellNumber = (text) => {
  var cleaned = ("" + text).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "",
      number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
        ""
      );
    return number;
  }
  return text;
};
export const handleOnChangeCellNumber = (text, cellPhone, setPhone) => {
  if (text.length <= 14) {
    if (text.length > cellPhone.length) {
      setPhone(formatCellNumber(text));
    } else {
      setPhone(text);
    }
  }
};
