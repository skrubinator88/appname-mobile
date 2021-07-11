import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Animated, StyleSheet, TextInput, View } from "react-native";
import { colors } from "react-native-elements";
import Modal from 'react-native-modal';
import styled from "styled-components/native";
import { GlobalContext } from "../../../../components/context";
import Text from "../../../../components/text";
import { reportJob } from "../../../../controllers/JobsControllers";
import { topics } from "../../../../models/report.json";

// BODY
export default function ReportJob({ job_data, onCancel: onCancelProp, isVisible, onReportSuccess }) {
  const { authState } = useContext(GlobalContext);
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const isOtherReport = useMemo(() => topic?.id === 3, [topic])

  const onCancel = () => {
    onCancelProp()
    if (success) {
      onReportSuccess()
    }
  }
  const animValue = useRef(new Animated.Value(0)).current

  const onSubmit = useCallback(async (topic, details) => {
    setLoading(true)
    try {
      if (!details || details.trim().split(/\W/).length < 5) {
        throw new Error('Your report details must have at least 5 words')
      }

      await reportJob(job_data._id, authState.userID === job_data.posted_by ? job_data.executed_by : job_data.posted_by, topic.text, details, authState)
      setSuccess(true)
    } catch (e) {
      Alert.alert('Report Failed', e.message || 'There was an error while sending your report')
    } finally {
      setLoading(false)
    }
  }, [topic])

  useEffect(() => {
    if (animValue && success && isVisible) {
      Animated.timing(animValue, {
        duration: 1600,
        toValue: 1,
        useNativeDriver: false
      }).start()
    }
  }, [success, isVisible, animValue])

  useEffect(() => {
    return () => {
      setTopic(null)
      setSuccess(false)
      if (animValue) {
        animValue.setValue(0)
      }
    }
  }, [isVisible])

  return (
    <Modal
      avoidKeyboard
      statusBarTranslucent
      isVisible={isVisible}
      swipeDirection={'down'}
      onBackdropPress={success ? onCancel : null}
      onSwipeComplete={(loading || topic) && !success ? null : onCancel}
      onBackButtonPress={loading && !success ? null : onCancel}
      style={{ margin: 0, justifyContent: 'center' }}>
      {success === true ?
        <Card>
          <Animated.View style={{
            opacity: animValue,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 28,
          }}>
            <Ionicons name='ios-checkmark-circle' color={colors.success} size={120} />
            <Text small light textTransform='uppercase' >Report Posted Successfully</Text>

          </Animated.View>
        </Card>
        :
        <>
          {!topic && <ReportJobMain onCancel={onCancel} onSelect={(topic) => setTopic(topic)} />}
          {!!topic && <ReportJobDetails isOtherReport={isOtherReport} topic={topic} onSubmit={onSubmit} loading={loading} onCancel={() => setTopic(null)} />}
        </>
      }
    </Modal>
  );
}

function ReportJobMain({ onCancel, onSelect }) {

  return (
    <Card>
      <View>
        <Row first>
          <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text align='center' title bold marginBottom="5px">How can we help?</Text>
            <Text small light marginBottom="5px">What issue are you experiencing?</Text>
          </Column>
        </Row>

        {topics.map(topic => (
          <CardOptionItem activeOpacity={0.4} key={topic.id} onPress={() => { onSelect(topic) }}>
            <Text small>{topic.text}</Text>
            <Ionicons name="ios-chevron-forward" size={24} />
          </CardOptionItem>
        ))}

        <CardOptionCancel activeOpacity={0.6} onPress={onCancel}>
          <Text medium style={{ color: colors.error }}>Cancel</Text>
        </CardOptionCancel>
      </View>
    </Card>
  )
}

function ReportJobDetails({ onCancel, topic, loading, isOtherReport, onSubmit }) {
  const [details, setDetails] = useState('')

  const { id, text } = topic

  return (
    <Card>
      <View>
        {!isOtherReport &&
          <Row first style={{ borderBottomWidth: 0 }}>
            <Column style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <>
                <Text align='center' small light marginBottom="5px" textTransform='uppercase'>Send report to Gigchasers</Text>
                <Text align='center' medium>"{text}"</Text>
              </>
            </Column>
          </Row>
        }

        <Row style={[{ borderBottomWidth: 0, borderTopWidth: 0 }, isOtherReport && { marginTop: 12 }]}>
          <TextInput
            onChangeText={text => setDetails(text)}
            value={details}
            editable={!loading}
            multiline
            underlineColorAndroid='transparent'
            autoFocus
            style={{
              fontSize: 16,
              flex: 1, maxHeight: 120, marginVertical: 12,
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: '#eaeaea', borderRadius: 8, padding: 12,
              minHeight: 60, textAlignVertical: 'top'
            }}
            placeholder='Kindly share details of your report'
          />
        </Row>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 12, alignItems: 'center' }}>
          <CardOptionButton disabled={loading} isCancel activeOpacity={0.6} onPress={onCancel}>
            <Ionicons name='ios-chevron-back' size={20} color='white' />
            <Text medium style={{ marginLeft: 4, color: 'white' }}>Back</Text>
          </CardOptionButton>

          <CardOptionButton disabled={loading} isSuccess activeOpacity={0.6} onPress={() => onSubmit(topic, details)}>
            {loading && <ActivityIndicator size='small' color='white' />}
            <Text medium style={{ marginLeft: 4, color: 'white' }}>Done</Text>
          </CardOptionButton>
        </View>

      </View>
    </Card >
  )
}
// STYLES

const Card = styled.SafeAreaView`
  position: absolute;
  left: 0;
  bottom: 0;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: -10px 0px 20px #999;
  background: white;
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: ${({ first, last }) => {
    switch (true) {
      case first:
        return "space-between";
      case last:
        return "space-around";
      default:
        return "flex-start";
    }
  }};
  ${({ first }) => {
    switch (true) {
      case first:
        return `
        margin: 4% 0 0 0;
        `;
    }
  }}
  padding: 3% 30px;
  border-bottom-color: #eaeaea;
  border-bottom-width: ${(props) => (props.last ? "0px" : "1px")};
`;

const Column = styled.View`
  flex-direction: column;

  ${({ location }) => {
    switch (true) {
      case location:
        return `
        width: 50%;
        `;
    }
  }};
`;

const CardOptionItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  width: 100%;
  border-bottom-color: #eaeaea;
  border-bottom-width: 1px;
`;

const CardOptionCancel = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  color: white;
  background: transparent;
  padding: 16px 40px;
  margin: 5px 0px;
  width: 100%;
`;

const CardOptionButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: center;
  color: white;
  padding: 12px 16px;
  margin: 8px 0px;
  border-radius: 28px;
  ${({ isCancel, isSuccess }) => {
    switch (true) {
      case isCancel:
        return `
          background-color: ${colors.error};
        `
      case isSuccess:
        return `
          padding: 12px 30px;
          background-color: ${colors.success};
        `
    }
  }};
`;