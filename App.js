import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');

  // 🕒 시간 상태
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handlePress = async () => {
    if (!expoPushToken) {
      console.log('❌ 푸시 토큰 없음');
      return;
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        sound: 'default',
        title: '차량 사용 알림',
        body: `나 ${startTime.toLocaleTimeString().slice(0, 5)}부터 ${endTime.toLocaleTimeString().slice(0, 5)}까지 차 쓸게!`,
      }),
    });

    console.log('알림 전송됨!');
  };

  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          alert('알림 권한이 필요합니다!');
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('✅ Expo Push Token:', token);
        setExpoPushToken(token);
      } else {
        alert('실제 기기에서만 푸시 알림을 테스트할 수 있어요!');
      }
    };

    registerForPushNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sibling Car Sharing</Text>

      {/* 시작 시간 선택 */}
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeBox}>
        <Text>시작 시간: {startTime.toLocaleTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartTime(selectedDate);
          }}
        />
      )}

      {/* 종료 시간 선택 */}
      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeBox}>
        <Text>종료 시간: {endTime.toLocaleTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="spinner"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndTime(selectedDate);
          }}
        />
      )}

      {/* 🚗 버튼 */}
      <TouchableOpacity style={styles.circleButton} onPress={handlePress}>
        <Text style={styles.buttonText}>사용</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  timeBox: {
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    width: 200,
    alignItems: 'center',
  },
  circleButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
