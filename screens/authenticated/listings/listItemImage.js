// Dependencies React
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useRef, useState } from "react";
import { Image, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Lightbox from "react-native-lightbox";
// Miscellaneous

export default function PhotoItem({ item, onRemove = null }) {
    const [lightbox, setLightbox] = useState(false);
    const [loading, setLoading] = useState(false)

    const mutable = useMemo(() => ({ loaded: false }),[])
    const borderRadius = onRemove ? 6 : 0

    return (
        <View style={[{ marginHorizontal: 4, borderRadius }, lightbox ? { width: '100%', aspectRatio: 1, borderRadius: 0 } : null]}>
            <Lightbox
                didOpen={() => setLightbox(true)}
                willClose={() => setLightbox(false)}
                backgroundColor='#000000f4' underlayColor='transparent'>
                <>
                    <Image onLoadEnd={() => {
                        if (!mutable.loaded) {
                            mutable.loaded = true;
                            setLoading(false)
                        }
                    }} onLoadStart={() => {
                        if (!mutable.loaded) {
                            setLoading(true)
                        }
                    }} style={[{ backgroundColor: '#cacaca', alignSelf: "center", height: 150, width: 150, borderRadius }, loading && !mutable.loaded ? { display: 'none' } : null, lightbox ? { borderRadius: 0, height: 'auto', width: '100%', aspectRatio: 1 } : null]} source={{ uri: item.uri, }} />
                    {!loading || mutable.loaded ? null :
                        <View style={[{ alignSelf: "center", justifyContent: 'center', backgroundColor: '#cacaca', height: 150, width: 150, borderRadius }, lightbox ? { borderRadius: 0, height: 'auto', width: '100%', aspectRatio: 1 } : null]}>
                            <ActivityIndicator size='small' color='#444' />
                        </View>
                    }
                </>
            </Lightbox>
            {onRemove &&
                <TouchableOpacity onPress={onRemove} activeOpacity={0.2} style={{ alignSelf: "center", backgroundColor: '#fff', opacity: 0.8, padding: 4, borderRadius: 100, position: 'absolute', top: 2, right: 2 }}>
                    <MaterialIcons name='close' style={{ color: 'red', fontSize: 18 }} />
                </TouchableOpacity>
            }
        </View>
    );
}

















