import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ScanButtonProps extends TouchableOpacityProps {
    label?: string;
    variant?: "primary" | "secondary" | "outline";
    className?: string;
}

const ScanButton = ({ label, variant = "primary", className = "", ...props }: ScanButtonProps) => {
    const baseStyles = "h-12 rounded-full items-center justify-center";
    const variants = {
        primary: "bg-accent",
        secondary: "bg-dark-200",
        outline: "bg-black/35 border border-white/60",
    } as const;

    const textColor = variant === "primary" ? "text-black" : "text-white";

    return (
        <TouchableOpacity
            {...props}
            className={`${baseStyles} ${variants[variant]} ${className}`.trim()}
            activeOpacity={0.85}
        >
            {label && <Text className={`font-bold ${textColor}`}>{label}</Text>}
        </TouchableOpacity>
    );
};

export default ScanButton;
