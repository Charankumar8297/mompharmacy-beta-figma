import { COLOR } from '@/constants/color';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ITEM_WIDTH = screenWidth * 0.9; 
const SPACING = screenWidth * 0.05; 

const banners = [
  {
    title: 'Medicine delivery',
    description: 'Get your health, delivered within 10 minutes',
    buttonText: 'Book Now',
    link: '/BottomNavbar/categories'
  },
  {
    title: 'Blood Donor Finder',
    description: 'Find nearby blood donors quickly 24/7',
    buttonText: 'Find Now',
    link: '/BloodDonor/front'
  },
  {
    title: 'Doctor consultations',
    description: 'Consult a doctor instantly anytime-anywhere',
    buttonText: 'Book Now',
    link: '/Comingsoon/doctor'
  },
  {
    title: 'Lab tests',
    description: 'Book lab tests from home fast, easy, 24/7',
    buttonText: 'Schedule Now',
    link: '/Comingsoon/bloodtest'
  },
  {
    title: 'Hospital Finder',
    description: 'Find nearby hospitals for urgent needs',
    buttonText: 'Find Now',
    link: '/Comingsoon/hospital'
  },
];

const BannerCarousel = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % banners.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item }) => (
    <View style={styles.bannerWrapper}>
      <View style={styles.card}>
        <View style={styles.textContainer}>
             <View >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => {router.push(item.link || '/');}}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.buttonText}>{item.buttonText}</Text>
                <MaterialIcons name="arrow-forward" size={24} color={COLOR.primary} />
            </View>

</TouchableOpacity>

        </View>
      </View>
    </View>
  );

  const handlePaginationPress = useCallback((i) => {
    flatListRef.current.scrollToIndex({ index: i, animated: true });
    setCurrentIndex(i);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }], 
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH + SPACING,
          offset: (ITEM_WIDTH + SPACING) * index,
          index,
        })}
        contentContainerStyle={{ paddingHorizontal: SPACING }} // Added padding on both sides
      />
      <View style={styles.pagination}>
        {banners.map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? '#00bfa5' : '#ccc' },
            ]}
            onPress={() => handlePaginationPress(i)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  bannerWrapper: {
    width: ITEM_WIDTH, 
    marginRight: SPACING, 
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#00a99d',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,

  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
  },
  button: {
    paddingVertical:6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    backgroundColor:'#fff',
    borderRadius:8,
  },
  buttonText: {
    color: '#00a99d',
    fontWeight: '900',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

export default BannerCarousel;
