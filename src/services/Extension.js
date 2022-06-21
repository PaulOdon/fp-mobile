import { Alert } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo"

export const checkInternetConnection = () => {
    const netInfo = useNetInfo();
    if (!netInfo.isConnected) {
        Alert.alert("Attention", "Verifier votre connexion internet")
    } else {
        console.log("Connecté à internet");
    }
}