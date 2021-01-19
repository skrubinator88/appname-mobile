import { FontAwesome, Ionicons } from "@expo/vector-icons";
import "intl";
import 'intl/locale-data/jsonp/en';
import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import Text from "../../../components/text";




export const CARD_ICON = {
    amex: (props) => <FontAwesome name='cc-amex' {...props} />,
    diners: (props) => <FontAwesome name='cc-diners-club' {...props} />,
    discover: (props) => <FontAwesome name='cc-discover' {...props} />,
    jcb: (props) => <FontAwesome name='cc-jcb' {...props} />,
    mastercard: (props) => <FontAwesome name='cc-mastercard' {...props} />,
    unionpay: (props) => <FontAwesome name='credit-card-alt' {...props} />,
    visa: (props) => <FontAwesome name='cc-visa' {...props} />,
    unknown: (props) => <FontAwesome name='credit-card' {...props} />
}
export const CurrencyFormatter = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const NumberFormatter = Intl.NumberFormat()

export function MethodView({ method }) {
    <PaymentItemRow key={method._id}>
        <PaymentItemRowLink>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {CARD_ICON[method.brand]}
                <Text small weight="700" textTransform='uppercase' color="#4a4a4a">{method.brand} ****{method.mask}</Text>
            </View>

            <Text small weight="700" color="#4a4a4a">EXP: {`${method.month}/${method.year}`}</Text>
        </PaymentItemRowLink>
    </PaymentItemRow>

}

export function PreferredMethodView({ method }) {

    return (
        <PaymentSection>
            <SectionTitle>
                <View style={{ margin: 10 }}>
                    <Text small bold color="#474747">PREFERRED METHODS</Text>
                </View>
            </SectionTitle>

            <PrefferedPaymentItemRow>
                <Column creditCardIcon>
                    {CARD_ICON[method.brand]({ color: '#3869f3', size: 70 })}
                </Column>
                <Column creditCardIconDescription>
                    <Text textTransform='uppercase' medium bold color="#474747">{method.brand} ****{method.mask}</Text>
                    <Text medium color="#474747">{`${method.month}/${method.year}`}</Text>
                </Column>
            </PrefferedPaymentItemRow>
        </PaymentSection>
    )
}

export function AccountView({ refreshing, balance = 0, hasActiveAccount }) {

    return (
        <AccountSection>
            {refreshing ?
                <View style={{ padding: 12 }} >
                    <ActivityIndicator color='#3869f3' size='small' />
                </View>
                :
                <View style={{ margin: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name="ios-wallet" size={60} />
                    <Text small light>ACCOUNT</Text>
                    <Text title bold color="#474747">{CurrencyFormatter.format(balance / 100)}</Text>
                </View>
            }

            <TouchableOpacity style={{ backgroundColor: '#3869f3', marginBottom: 12, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                <Text small bold color='#fff' >{hasActiveAccount ? "PAYOUT" : "SETUP PAYOUT"}</Text>
            </TouchableOpacity>
        </AccountSection>
    )
}


const SectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const AccountSectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PaymentSection = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const AccountSection = styled.View`
  justify-content: center;
  align-items: center;
  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: #3869f3;
  margin: 20px;
  border-radius: 8px;
  padding: 4px;
  background-color: white;
`;

const PaymentItemRow = styled.View`
  background: white;
  padding: 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const PaymentItemRowLink = styled.TouchableOpacity`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Preferred Section

const PrefferedPaymentItemRow = styled.View`
  background: white;
  padding: 0 5%;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #f5f5f5;
`;

const Column = styled.View`
  padding: 10px;
  ${({ creditCardIcon, creditCardIconDescription }) => {
        if (creditCardIcon) return "flex: 1";
        if (creditCardIconDescription) return "flex: 3";
    }}
`;
