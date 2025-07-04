import { Text, TouchableOpacity, View } from "react-native";

interface Proptype {
  text: string;
  onPress: () => void;
}

export const Button = ({ text, onPress }: Proptype) => {
  return (
    <TouchableOpacity>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};
