import React, { useCallback, useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Dimensions, Modal, RefreshControl, SafeAreaView, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import { GlobalContext } from "../../../components/context";
// Components
import Container from "../../../components/headerAndContainer";
import Text from "../../../components/text";
import { AccountView, MethodView, PreferredMethodView, TransactionRecord } from "./components";
import StripeCheckoutScreen from "./stripe";
import { TouchableOpacity } from "react-native";
import { getPaymentInfo, removeMethod, setDefaultMethod } from "../../../controllers/PaymentController";
import { Alert } from "react-native";
import { StatusBar } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";

const height = Dimensions.get("window").height;

export default function PaymentScreen({ navigation }) {
  const { authState } = useContext(GlobalContext);
  const [refreshing, setRefreshing] = useState(false);
  const [addPaymentMethod, setAddPaymentMethod] = useState(false);

  const dispatch = useDispatch();
  const payments = useSelector((state) => state.payment);
  const actionSheet = useActionSheet();

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getPaymentInfo(authState, dispatch);
    } catch (e) {
      console.log(e);
      Alert.alert("Load Failed", "Failed to fetch payment details");
    } finally {
      setRefreshing(false);
    }
  }, [authState]);

  const onMethodClick = useCallback(async (item) => {
    actionSheet.showActionSheetWithOptions(
      {
        title: "Manage Payment Method",
        message: `${item.brand} ****${item.mask}`,
        options: ["Make Default", "Remove", "Cancel"],
        cancelButtonIndex: 2,
        destructiveButtonIndex: 1,
      },
      async (i) => {
        try {
          switch (i) {
            case 0:
              const confirmDefault = await new Promise((res) =>
                Alert.alert(
                  "Set Default Payment Method?",
                  "Your default method will be used for fulfilling bills charged on your account",
                  [
                    {
                      style: "default",
                      text: "Yes",
                      onPress: () => res(true),
                    },
                    {
                      text: "No",
                      style: "cancel",
                      onPress: () => res(false),
                    },
                  ]
                )
              );
              if (confirmDefault) {
                await setDefaultMethod(item, authState, dispatch);
              }
              break;
            case 1: {
              const confirmRemove = await new Promise((res) =>
                Alert.alert("Remove Payment Method?", "Selected method will no more be charged", [
                  {
                    style: "default",
                    text: "Yes",
                    onPress: () => res(true),
                  },
                  {
                    text: "No",
                    style: "cancel",
                    onPress: () => res(false),
                  },
                ])
              );
              if (confirmRemove) {
                await removeMethod(item, authState, dispatch);
              }
            }
          }
        } catch (e) {
          console.log(e);
          Alert.alert("Operation Failed", "Please try again");
        }
      },
      [payments, authState]
    );
  });

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Container
      flexible={false}
      navigation={navigation}
      color="white"
      title="Payment"
      titleWeight="300"
      headerBackground="#3869f3"
      nextProvider="Entypo"
      // nextIcon="dots-three-horizontal"
    >
      <ScrollView
        scrollEnabled
        style={{ height, paddingTop: 8 }}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} tintColor="#888" onRefresh={refresh} />}
      >
        {/* Payments Section */}
        {authState.userData.role === "contractor" && (
          <AccountView
            refreshing={refreshing}
            hasAccount={payments.hasAccount}
            hasActiveAccount={payments.hasActiveAccount}
            balance={payments.balance}
          />
        )}

        <PaymentSection>
          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                PAYMENT METHODS
              </Text>
            </View>
          </SectionTitle>

          {payments.methods && payments.methods.length > 0 ? (
            payments.methods.map((method) => <MethodView key={method.id} onPress={() => onMethodClick(method)} method={method} />)
          ) : (
            <View style={{ paddingVertical: 28 }}>
              <Text light small>
                NO PAYMENT METHOD ADDED YET
              </Text>
            </View>
          )}

          <PaymentItemRow>
            <PaymentItemRowLink onPress={() => setAddPaymentMethod(true)}>
              <Text small weight="700" color="#3869f3">
                ADD PAYMENT METHOD
              </Text>
            </PaymentItemRowLink>
          </PaymentItemRow>
        </PaymentSection>
        {addPaymentMethod && (
          <Modal
            animationType="fade"
            transparent
            visible
            onRequestClose={() => setAddPaymentMethod(false)}
            onDismiss={() => setAddPaymentMethod(false)}
            style={{ height: "100%", backgroundColor: "#0004", justifyContent: "center" }}
          >
            <ScrollView bounces={false} contentContainerStyle={{ justifyContent: "center", flexGrow: 1, backgroundColor: "#0004" }}>
              <SafeAreaView style={{ marginHorizontal: 8, marginVertical: 120, flexGrow: 1 }}>
                <KeyboardAvoidingView behavior="padding" style={{ justifyContent: "center", margin: 8, flex: 1 }}>
                  <StripeCheckoutScreen close={() => setAddPaymentMethod(false)}>
                    <TouchableOpacity onPress={() => setAddPaymentMethod(false)} style={{ position: "absolute", top: 4, left: 4 }}>
                      <MaterialCommunityIcons size={24} color="red" name="close-circle" />
                    </TouchableOpacity>
                  </StripeCheckoutScreen>
                </KeyboardAvoidingView>
              </SafeAreaView>
            </ScrollView>
          </Modal>
        )}
        {/* Preffered Section */}
        {payments.defaultMethod && <PreferredMethodView method={payments.defaultMethod} />}

        {/* Transaction History */}

        <PaymentSection>
          <SectionTitle>
            <View style={{ margin: 10 }}>
              <Text small bold color="#474747">
                TRANSACTION HISTORY
              </Text>
            </View>
          </SectionTitle>

          {payments.transactions && payments.transactions.length > 0 ? (
            payments.transactions.map((txn) => <TransactionRecord key={txn.id} onPress={() => onMethodClick(txn)} transaction={txn} />)
          ) : (
            <View style={{ paddingVertical: 28 }}>
              <Text light small>
                NO TRANSACTION YET
              </Text>
            </View>
          )}
        </PaymentSection>
      </ScrollView>
    </Container>
  );
}

// Payments Section
const SectionTitle = styled.View`
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
  padding: 4%;
  flex-direction: row;
  justify-content: center;
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
