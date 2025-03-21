import React, { useState, useRef } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { View, Text, Image, Dimensions, TouchableOpacity, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import WelcomeButton from '../../components/WelcomeButton';
import { styles } from './styles';
import { onboardingData, OnboardingItem } from './helpers';

const { width, height } = Dimensions.get('window');
const Welcome = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      setCurrentIndex(viewableItems[0]?.index ?? 0);
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const nextSlide = () => {
    if (currentIndex < onboardingData?.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const skipToLogin = () => {
    navigation.navigate('Login');
  };

  const renderOnboardingItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                },
                index === currentIndex ? styles.activeDot : {},
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={skipToLogin}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={onboardingData}
        renderItem={renderOnboardingItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slidesRef}
      />

      <Paginator />

      <View style={styles.bottomContainer}>
        {currentIndex === onboardingData.length - 1 ? (
          <WelcomeButton title="Get Started" onPress={skipToLogin} style={styles.button} />
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
