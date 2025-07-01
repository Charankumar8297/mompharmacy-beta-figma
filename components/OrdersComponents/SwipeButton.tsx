
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    View
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const SwipeToConfirm = ({ visible, onConfirm, onClose }: Props) => {
  const panX = useRef(new Animated.Value(0)).current;
  const [confirmed, setConfirmed] = useState(false);
  const trackWidth = SCREEN_WIDTH - 40; 
  const thumbWidth = 60; 

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      
      onPanResponderGrant: () => {
        panX.extractOffset();
      },
      
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(0, Math.min(gesture.dx, trackWidth - thumbWidth));
        panX.setValue(newX);
      },
      
      onPanResponderRelease: (_, gesture) => {
        panX.flattenOffset();
        
        if (gesture.dx > (trackWidth - thumbWidth) * 0.7) {
          const toValue = trackWidth - thumbWidth;
          Animated.spring(panX, {
            toValue,
            useNativeDriver: false,
            bounciness: 0,
          }).start(() => {
            setConfirmed(true);
            setTimeout(() => {
              onConfirm();
              setConfirmed(false);
              panX.setValue(0);
            }, 500);
          });
        } else {
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: false,
            bounciness: 0,
          }).start();
        }
      },
    })
  ).current;

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.swipeTrack}>
          <Text style={styles.swipeText}>Swipe to Place Order</Text>
          <View style={styles.trackBackground} />
          <Animated.View 
            style={[
              styles.swipeCircle, 
              { 
                transform: [{ translateX: panX }],
                backgroundColor: confirmed ? '#4CAF50' : '#00a99d',
              }
            ]}
            {...panResponder.panHandlers}
          >
            <MaterialIcons
              name={confirmed ? 'check' : 'arrow-forward'}
              size={28}
              color="#fff"
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default SwipeToConfirm;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  swipeTrack: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 30,
    position: 'relative',
  },
  trackBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
  },
  swipeText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#00a99d',
    fontWeight: '600',
    fontSize: 16,
    zIndex: 5,
  },
  swipeCircle: {
    position: 'absolute',
    left: 5,
    top: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
});
