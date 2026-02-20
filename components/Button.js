import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const Button = ({ color, filled, disabled, style, title, icon, onPress }) => {
  const filledBgColor = color || COLORS.primary;
  const outlinedColor = COLORS.white;
  const bgColor = filled ? filledBgColor : outlinedColor;
  const textColor = filled ? COLORS.white : COLORS.primary;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={
        icon !== null && icon !== undefined
          ? {
              ...styles.buttonIcon,
              ...{ backgroundColor: bgColor },
              ...style,
            }
          : {
              ...styles.button,
              ...{ backgroundColor: bgColor },
              ...style,
            }
      }
      onPress={onPress}
    >
      {icon !== null && icon !== undefined ? <AntDesign name={icon} size={20} color="white" /> : ""}
      <Text style={{ fontSize: 18, ...{ color: textColor } }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    flex: 1,
    paddingVertical: 10,
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
export default Button;
