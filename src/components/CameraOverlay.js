import React, { useRef } from 'react';
import { View, Image, StyleSheet, Animated, PanResponder } from 'react-native';

export default function CameraOverlay({ brightness = 1 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const lastScale = useRef(1);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        if (gestureState.numberActiveTouches === 2) {
          lastScale.current = scale._value;
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
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.numberActiveTouches < 2) {
          lastScale.current = scale._value;
          lastScale.currentDistance = null;
        }
      },
    })
  ).current;

  return (
    <View style={styles.overlayContainer} pointerEvents="box-none">
      <Animated.Image
        source={require('../../assets/images/jacket.png')}
        style={[
          styles.overlayImage,
          {
            opacity: brightness,
            transform: [{ scale }],
          },
        ]}
        resizeMode="contain"
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'box-none',
  },
  overlayImage: {
    width: 250,
    height: 250,
    opacity: 1,
  },
});
