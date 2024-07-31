import { View, Text, StyleSheet } from "react-native";

import IconButton from "../IconButton";
import { GLOBAL_STYLES } from "../../../constants/styles";

function PaymentMethod({icon, paymentName, paymentUsername, onPress}) {
    return (
        <View style={styles.container}>
            <IconButton icon={icon} 
            color={GLOBAL_STYLES.colors.brown700}
            onPress={onPress}
            iconSize={18}/>
            <Text style={styles.title}>{paymentName.toUpperCase()}: {paymentUsername}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 8
    },
    title: {
        fontSize: 18,
        color: GLOBAL_STYLES.colors.brown700,
        textAlign: 'center'
    }
})

export default PaymentMethod;