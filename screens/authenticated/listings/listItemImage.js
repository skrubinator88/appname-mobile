// Dependencies React
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Lightbox from "react-native-lightbox";
// Miscellaneous

export default function PhotoItem({ item, onRemove = () => { } }) {
    const [lightbox, setLightbox] = useState(false);
    return (
        <View style={[{ marginHorizontal: 4, borderRadius: 6 }, lightbox ? { width: '100%', aspectRatio: 1, borderRadius: 0 } : null]}>
            <Lightbox
                didOpen={() => setLightbox(true)}
                willClose={() => setLightbox(false)}
                backgroundColor='#000000f4' underlayColor='transparent'>
                <Image style={[{ alignSelf: "center", height: 150, width: 150, borderRadius: 6 }, lightbox ? { borderRadius: 0, height: 'auto', width: '100%', aspectRatio: 1 } : null]} source={{ uri: item.uri }} />
            </Lightbox>
            {onRemove &&
                <TouchableOpacity onPress={onRemove} activeOpacity={0.2} style={{ alignSelf: "center", backgroundColor: '#fff', opacity: 0.8, padding: 4, borderRadius: 100, position: 'absolute', top: 2, right: 2 }}>
                    <MaterialIcons name='close' style={{ color: 'red', fontSize: 18 }} />
                </TouchableOpacity>
            }
        </View>
    );
}

















