import { View, TextInput, Image } from "react-native";

import { icons } from "@/constants/icons";

interface Props {
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
    onPress?: () => void;
}

const SearchBar = ({ placeholder, value, onChangeText, onPress }: Props) => {
    return (
        <View className="flex-row items-center bg-surface border border-border rounded-full px-5 py-4 shadow-lg shadow-[#FF4F9A33]">
            <Image
                source={icons.search}
                className="w-5 h-5"
                resizeMode="contain"
                tintColor="#4A90F7"
            />
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                className="flex-1 ml-2 text-white font-semibold"
                placeholderTextColor="#B3B3B3"
            />
        </View>
    );
};

export default SearchBar;
