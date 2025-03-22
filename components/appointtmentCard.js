import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Text, Card, Title, Paragraph, Button,  } from 'react-native-paper'


const AppointmentCard = () => {
    return (
        
            <Card style={styles.cardContainer}>
                <LinearGradient
                    colors={['#FF5733', '#FFC300']}
                    style={styles.gradient}
                >
                    <Card.Content>
                        <Text variant={"labelMedium"} style={[styles.lightText, styles.light]}>Up to</Text>
                        <Text variant={"headlineMedium"} style={[styles.figure, styles.light]}>25% OFF</Text>
                        <Text style={[styles.lightText, styles.light]}>Appointment made here</Text>
                        <Button style={[styles.btn]}>Claim</Button>
                    </Card.Content>
                
                <View>
            
                </View>
                </LinearGradient>
            </Card>
         
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: 300,
        marginRight: 16,
        backgroundColor: "orange",
        color: "white",
        overflow: "hidden"
    },

    card: {

    },

    light: {
        color: 'white',
    },

    figure: {
        fontWeight: "bold",
    },
    lightText: {
        fontWeight: "thin",
        fontSize: 12
    },
    btn: {
        backgroundColor: "white",
        color: "gray",
        width: 40,
        borderRadius: 4,
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginTop: 10 
    },
    gradient:{
        padding: 16,
    }

})
export default AppointmentCard;