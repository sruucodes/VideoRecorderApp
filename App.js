import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera'; // Ensure proper import for expo-camera

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null); // Reference for Camera component
  // Request camera permission
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // request permission
      setHasPermission(status === 'granted'); // Set permission state
    };
    requestPermission();
  }, []);
  const handleRecordVideo = async () => {
    if (cameraRef.current && !isRecording) {
      const options = {
        quality: Camera.Constants.VideoQuality['720p'], // Choose video quality
        maxDuration: 60, // Max video duration of 60 seconds
      };

      try {
        const video = await cameraRef.current.recordAsync(options);
        console.log('Video recorded to:', video.uri);
        Alert.alert('Recording complete!', `Video saved to: ${video.uri}`);
      } catch (error) {
        console.log('Error during recording:', error);
        Alert.alert('Recording Error', 'There was an issue during recording.');
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      setIsRecording(false);
      await cameraRef.current.stopRecording(); // Stop the recording
    }
  };

  // Handle permission state
  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back} // Ensure Constants.Type is available
        ref={cameraRef} // Reference to the camera
      />
      <View style={styles.buttonContainer}>
        {!isRecording ? (
          <Button
            title="Start Recording"
            onPress={() => {
              setIsRecording(true);
              handleRecordVideo(); // Start video recording when the button is pressed
            }}
          />
        ) : (
          <Button title="Stop Recording" onPress={stopRecording} />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 3,
    width: '100%',
    height: '100%', // Ensure the camera occupies the whole screen
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
