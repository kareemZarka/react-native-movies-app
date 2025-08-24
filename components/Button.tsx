import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  className?: string;
  textClassName?: string;
}

const Button = ({ label, className = "", textClassName = "", ...props }: ButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      {...props}
      className={`justify-center items-center rounded-full ${className}`.trim()}
    >
      <Text className={`font-bold ${textClassName}`.trim()}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
