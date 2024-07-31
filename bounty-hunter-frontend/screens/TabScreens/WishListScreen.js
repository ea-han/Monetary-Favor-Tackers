import { View, Text, StyleSheet, Image, Pressable, ScrollView} from 'react-native';
import { useState } from 'react';

import { GLOBAL_STYLES } from '../../constants/styles';
import { Feather, MaterialIcons } from '@expo/vector-icons'

import WishlistCard from '../../components/Wishlist/WishlistCard.js';
import WishlistDelete from '../../components/Wishlist/WishlistDelete.js';
import WishlistAdd from '../../components/Wishlist/WishlistAdd.js';


function WishlistScreen({ user }) {
    const [isEditing, setIsEditing] = useState(true);
    const [isAddVisible, setIsAddVisible] = useState(false);

    const DUMMY_WISHLIST = [
        {
            title: 'Lego Set',
            description: 'https://www.lego.com/en-us/product/wildflower-bouquet-10313',
            price: '55',
            imagePath: 'https://www.lego.com/cdn/cs/set/assets/bltc4a6c2103a34f22e/10313_alt2.png?format=webply&fit=bounds&quality=70&width=800&height=800&dpr=1.5'
        },
        {
            title: 'CSE Tutoring (2hr)',
            description: 'Halp',
            price: '40',
            imagePath: '',
        },
    ]

    function isEditingHandler() {
        setIsEditing((curr) => !curr);
    }

    function considerAdd() {
        console.log('consider adding item');
        setIsAddVisible(true);
    }

    function addItem() {
        console.log('item added');
        setIsAddVisible(false);
    }

    function cancelAdd() {
        console.log('add item canceled');
        setIsAddVisible(false);
    }

    return (

        <ScrollView style={styles.page} contentContainerStyle={{ flexGrow: 1 }}>
            <View>
                <Text style={styles.headerText}>My Wishlist</Text>
            </View>

            {/* Edit Button */}
            <View>
                { isEditing ? (
                    <Pressable onPress={(isEditingHandler)} style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit</Text>
                        <Feather name="edit-2" size={13} color={GLOBAL_STYLES.colors.orange700} />
                    </Pressable>
                ) : (
                    <Pressable onPress={(isEditingHandler)} style={styles.doneButton}>
                        <Text style={styles.doneButtonText}>Done</Text>
                    </Pressable>
                )}
                
            </View>
            
            {/* Wishlist Mapping */}
            <View>
                {DUMMY_WISHLIST.map((item) => 
                    <WishlistCard 
                        key={item.title}
                        title={item.title}
                        description={item.description}
                        price={item.price}
                        imagePath={item.imagePath} 
                        editStatus={isEditing} />
                )}
            </View> 

            {/* Add Button */}
            <View style={{position: 'absolute', left: '84%', top: '91%'}}>
                { isEditing ? (
                    <View></View>
                ):(
                    <Pressable onPress={(considerAdd)} style={styles.addButton}>
                        <MaterialIcons name="add" size={24} color={GLOBAL_STYLES.colors.orange700} />
                    </Pressable>
                )}
            </View>

            <WishlistAdd isVisible={isAddVisible} onYes={addItem} onNo={cancelAdd}/>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: GLOBAL_STYLES.colors.brown300,
        flex: 1,
        paddingTop: 100,
    },
    headerText: {
        fontFamily: 'BaiJamjuree-Bold',
        fontSize: 36,
        color: GLOBAL_STYLES.colors.blue300,
        textAlign: 'center',
        marginBottom: -15,
    },
    editButton: {
        backgroundColor: GLOBAL_STYLES.colors.yellow300,
        borderWidth: 3,
        borderColor: GLOBAL_STYLES.colors.orange300,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 'auto',
        flexDirection: 'row',
        marginRight: '5%',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        color: GLOBAL_STYLES.colors.orange700,
        fontSize: 13,
        fontFamily: 'BaiJamjuree-Regular',
        marginRight: 5,
    },
    doneButton: {
        backgroundColor: GLOBAL_STYLES.colors.brown700,
        borderWidth: 3,
        borderColor: GLOBAL_STYLES.colors.brown700,
        borderRadius: 20,
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 'auto',
        marginRight: '5%',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneButtonText: {
        color: GLOBAL_STYLES.colors.brown300,
        fontSize: 13,
        fontFamily: 'BaiJamjuree-Regular',
    },
    addButton: {
        backgroundColor: GLOBAL_STYLES.colors.brown300,
        borderWidth: 3,
        borderColor: GLOBAL_STYLES.colors.orange700,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        marginLeft: 'auto',
    }
})

export default WishlistScreen;