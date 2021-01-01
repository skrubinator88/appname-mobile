import { Platform, ActionSheetIOS, Alert } from 'react-native'

export default function Confirm({ title, options, onPress, destructiveButtonIndex, cancelButtonIndex, message = '', onCancel = null }) {
    if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions({
            options,
            destructiveButtonIndex,
            cancelButtonIndex,
            message,
            title,
        }, (number) => {
            switch (number) {
                case cancelButtonIndex:
                    if (cancelButtonIndex && typeof cancelButtonIndex === 'number' && onCancel) {
                        onCancel()
                        break
                    }
                default:
                    onPress(number)
            }
        })
    } else {
        Alert.alert(title, message, [
            {
                text: 'cancel',
                onPress: onCancel
            }, ...options.map((option, index) => {
                if (index === cancelButtonIndex) {
                    return
                }

                return {
                    text: option,
                    onPress: () => onPress(index),
                    style: index === destructiveButtonIndex ? 'destructive' : 'default'
                }
            })
        ])
    }
}