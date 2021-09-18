import { default as React } from "react";
import { StyleSheet } from "react-native";
import { Composer, InputToolbar as GiftedInputToolbar } from 'react-native-gifted-chat';
import { getStatusBarHeight } from "react-native-status-bar-height";


const statusBarHeight = getStatusBarHeight();



export function RenderComposer(props) {
    return (
        <Composer
            {...props}
            textInputStyle={{
                color: '#222B45',
                backgroundColor: 'white',
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginTop: 0,
                marginBottom: 0,
                marginHorizontal: 0,
                alignSelf: 'stretch',
                lineHeight: 20,
                fontSize: 16,
                overflow: 'hidden',
                textAlign: 'left',
                textAlignVertical: 'center'
            }}
            textInputProps={{
                keyboardType: 'default',
                returnKeyType: 'done',
                returnKeyLabel: 'done',
            }}
            composerHeight={44}
            multiline={false}
        />
    )
}


export function InputToolbar(props) {
    return (
        <GiftedInputToolbar
            {...props}
            primaryStyle={{ backgroundColor: 'transparent', flex: 1 }}
            containerStyle={styles.inputContainerStyle}
        />
    )
}


const styles = StyleSheet.create({
    inputContainerStyle: {
        borderTopWidth: StyleSheet.hairlineWidth / 2,
        // borderTopColor: '#888',
        position: 'relative',
        height: 44,
    },
    messagesContainerStyle: {
        backgroundColor: 'black',
        padding: 0,
        margin: 0,
        flexGrow: 1,
    },
    contentStyle: {
        flexGrow: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'stretch'
    }
})