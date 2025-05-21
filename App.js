import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';



export default function App() {
const [expoPushToken, setExpoPushToken] = useState('');

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
      title: '🚗 차량 사용 알림',
      body: '나 지금 차 쓸게!',
    }),
  });

  console.log('🚀 알림 전송됨!');
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
      <Text>Sibling Something sharing</Text>
      
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
circleButton: {
  width: 200,
  height: 200,
  borderRadius: 100, // 반지름이 절반 = 원형
  backgroundColor: '#2196F3',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 30,
  elevation: 5, // 그림자 효과 (Android)
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
},

buttonText: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
}

});
