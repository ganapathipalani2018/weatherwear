import React, { useRef, useState } from 'react';
import { Modal, View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, PanResponder, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');

export default function TryOnModal({ visible, product, onClose, onPhotoCaptured, capturedPhoto }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedToGallery, setSavedToGallery] = useState(false);
  const cameraRef = useRef(null);

  // Pinch/zoom and drag/move
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);
  const pan = useRef(new Animated.ValueXY({ x: width * 0.25, y: width * 0.3 })).current;
  const lastPan = useRef({ x: width * 0.25, y: width * 0.3 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          lastScale.current = scale._value;
        } else if (gestureState.numberActiveTouches === 1) {
          lastPan.current = { x: pan.x._value, y: pan.y._value };
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          const touches = evt.nativeEvent.touches;
          if (touches.length === 2) {
            const dx = touches[0].pageX - touches[1].pageX;
            const dy = touches[0].pageY - touches[1].pageY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (!lastScale.currentDistance) {
              lastScale.currentDistance = distance;
            } else {
              const scaleFactor = distance / lastScale.currentDistance;
              scale.setValue(lastScale.current * scaleFactor);
            }
          }
        } else if (gestureState.numberActiveTouches === 1) {
          pan.setValue({
            x: lastPan.current.x + gestureState.dx,
            y: lastPan.current.y + gestureState.dy,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.numberActiveTouches < 2) {
          lastScale.current = scale._value;
          lastScale.currentDistance = null;
        }
        if (gestureState.numberActiveTouches < 1) {
          lastPan.current = { x: pan.x._value, y: pan.y._value };
        }
      },
    })
  ).current;

  const requestCameraPermission = async () => {
    if (hasCameraPermission === null) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    }
  };

  React.useEffect(() => {
    if (visible) {
      requestCameraPermission();
      scale.setValue(1);
      pan.setValue({ x: width * 0.25, y: width * 0.3 });
      setSavedToGallery(false);
    }
    // eslint-disable-next-line
  }, [visible]);

  const capturePhoto = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        const fileName = `${FileSystem.documentDirectory}TryOn_${Date.now()}.jpg`;
        await FileSystem.moveAsync({ from: photo.uri, to: fileName });
        Alert.alert('Photo Saved', `Saved to: ${fileName}`);
        onPhotoCaptured(fileName);
        setSavedToGallery(false);
      } catch (e) {
        Alert.alert('Error', 'Failed to capture photo.');
      }
      setIsCapturing(false);
    }
  };

  const saveToGallery = async () => {
    if (!capturedPhoto) return;
    setIsSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to save photos.');
        setIsSaving(false);
        return;
      }
      await MediaLibrary.saveToLibraryAsync(capturedPhoto);
      setSavedToGallery(true);
      Alert.alert('Saved', 'Photo saved to gallery!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save photo.');
    }
    setIsSaving(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.tryOnContainer}>
        {capturedPhoto ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} resizeMode="contain" />
            <Text style={styles.previewText}>Photo Preview</Text>
            <View style={styles.modalActions}>
              {!savedToGallery && (
                <TouchableOpacity style={styles.saveBtn} onPress={saveToGallery} disabled={isSaving}>
                  <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : 'Save to My Try-Ons'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : hasCameraPermission === false ? (
          <Text>No access to camera</Text>
        ) : (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.front}
            ref={cameraRef}
            ratio="16:9"
          >
            {product && (
              <Animated.Image
                source={{ uri: product.image }}
                style={[
                  styles.overlayImage,
                  { transform: [{ scale }, ...pan.getTranslateTransform()] },
                ]}
                resizeMode="contain"
                {...panResponder.panHandlers}
              />
            )}
          </Camera>
        )}
        {!capturedPhoto && hasCameraPermission !== false && (
          <View style={styles.tryOnControls}>
            <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto} disabled={isCapturing}>
              <Text style={styles.captureBtnText}>{isCapturing ? 'Saving...' : 'Capture'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  tryOnContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: width,
    height: width * 1.33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayImage: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    opacity: 0.7,
  },
  tryOnControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  captureBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 2,
    marginHorizontal: 10,
  },
  captureBtnText: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 2,
    marginHorizontal: 10,
    marginTop: 10,
  },
  closeBtnText: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  capturedImage: {
    width: width * 0.8,
    height: width * 1.1,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#222',
  },
  previewText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 