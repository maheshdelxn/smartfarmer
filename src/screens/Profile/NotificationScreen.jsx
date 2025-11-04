import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Mock data and enums
const NotificationType = {
  WEATHER: 'weather',
  MARKET: 'market',
  GOVERNMENT: 'government',
  ALERT: 'alert',
  REMINDER: 'reminder',
  PAYMENT: 'payment',
  EQUIPMENT: 'equipment',
  EDUCATION: 'education',
};

const NotificationFilter = {
  ALL: 'all',
  WEATHER: 'weather',
  MARKET: 'market',
  GOVERNMENT: 'government',
  ALERT: 'alert',
  PAYMENT: 'payment',
};

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(NotificationFilter.ALL);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Weather Alert',
      message: 'Heavy rain expected tomorrow in your region',
      time: '2 hours ago',
      isRead: false,
      type: NotificationType.WEATHER,
    },
    {
      id: '2',
      title: 'Market Update',
      message: 'Wheat prices increased by 5% in local market',
      time: '5 hours ago',
      isRead: true,
      type: NotificationType.MARKET,
    },
    {
      id: '3',
      title: 'New Government Scheme',
      message: 'New fertilizer subsidy announced for your region',
      time: '1 day ago',
      isRead: false,
      type: NotificationType.GOVERNMENT,
    },
    {
      id: '4',
      title: 'Pest Alert',
      message: 'Locust sightings reported in nearby districts',
      time: '2 days ago',
      isRead: true,
      type: NotificationType.ALERT,
    },
    {
      id: '5',
      title: 'Irrigation Reminder',
      message: 'Time to water your soybean crops in field B',
      time: '3 days ago',
      isRead: true,
      type: NotificationType.REMINDER,
    },
    {
      id: '6',
      title: 'Payment Received',
      message: '₹15,200 received for your wheat harvest',
      time: '1 week ago',
      isRead: false,
      type: NotificationType.PAYMENT,
    },
    {
      id: '7',
      title: 'Equipment Maintenance',
      message: 'Your tractor service is due next week',
      time: '1 week ago',
      isRead: true,
      type: NotificationType.EQUIPMENT,
    },
    {
      id: '8',
      title: 'New Farming Technique',
      message: 'Learn about vertical farming methods in your area',
      time: '2 weeks ago',
      isRead: true,
      type: NotificationType.EDUCATION,
    },
  ]);

  // Colors matching your profile screen
  const primaryColor = '#16a34a';
  const primaryTextColor = '#166534';
  const unreadBackgroundColor = '#f0fdf4';
  const cardBorderColor = '#dcfce7';

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      currentFilter === NotificationFilter.ALL ||
      notification.type === currentFilter;
    const matchesUnreadFilter = !showUnreadOnly || !notification.isRead;
    return matchesFilter && matchesUnreadFilter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case NotificationType.WEATHER:
        return { icon: 'cloud', color: '#60a5fa' };
      case NotificationType.MARKET:
        return { icon: 'attach-money', color: '#fb923c' };
      case NotificationType.GOVERNMENT:
        return { icon: 'assignment', color: '#c084fc' };
      case NotificationType.ALERT:
        return { icon: 'warning', color: '#f87171' };
      case NotificationType.REMINDER:
        return { icon: 'notifications', color: '#60a5fa' };
      case NotificationType.PAYMENT:
        return { icon: 'payment', color: '#16a34a' };
      case NotificationType.EQUIPMENT:
        return { icon: 'build', color: '#a16207' };
      case NotificationType.EDUCATION:
        return { icon: 'school', color: '#4f46e5' };
      default:
        return { icon: 'info', color: primaryColor };
    }
  };

  const getFilterName = (filter) => {
    switch (filter) {
      case NotificationFilter.ALL:
        return 'All';
      case NotificationFilter.WEATHER:
        return 'Weather';
      case NotificationFilter.MARKET:
        return 'Market';
      case NotificationFilter.GOVERNMENT:
        return 'Government';
      case NotificationFilter.ALERT:
        return 'Alerts';
      case NotificationFilter.PAYMENT:
        return 'Payments';
      default:
        return 'All';
    }
  };

  const getFilterIcon = (filter) => {
    switch (filter) {
      case NotificationFilter.ALL:
        return 'filter-alt';
      case NotificationFilter.WEATHER:
        return 'cloud';
      case NotificationFilter.MARKET:
        return 'attach-money';
      case NotificationFilter.GOVERNMENT:
        return 'assignment';
      case NotificationFilter.ALERT:
        return 'warning';
      case NotificationFilter.PAYMENT:
        return 'payment';
      default:
        return 'filter-alt';
    }
  };

  const handleNotificationTap = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    switch (notification.type) {
      case NotificationType.WEATHER:
        showWeatherAlertDetails(notification);
        break;
      case NotificationType.MARKET:
        showMarketDetails(notification);
        break;
      default:
        Alert.alert(notification.title, 'Notification tapped');
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    Alert.alert('Success', 'All notifications marked as read');
  };

  const deleteNotification = (id) => {
    const deletedNotification = notifications.find(notif => notif.id === id);
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    
    Alert.alert(
      'Notification Deleted',
      'The notification has been deleted',
      [
        {
          text: 'Undo',
          onPress: () => {
            setNotifications(prev => [...prev, deletedNotification]);
          },
        },
        { text: 'OK', style: 'cancel' },
      ]
    );
  };

  const confirmDelete = (notification) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNotification(notification.id),
        },
      ]
    );
  };

  const showNotificationOptions = (notification) => {
    Alert.alert(
      'Notification Options',
      '',
      [
        {
          text: notification.isRead ? 'Mark as Unread' : 'Mark as Read',
          onPress: () => markAsRead(notification.id),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(notification),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const addSampleNotification = () => {
    const types = Object.values(NotificationType);
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const newNotification = {
      id: Date.now().toString(),
      title: 'New Notification',
      message: 'This is a sample notification added for testing',
      time: 'Just now',
      isRead: false,
      type: randomType,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const showWeatherAlertDetails = (notification) => {
    Alert.alert(
      notification.title,
      `${notification.message}\n\nRecommended actions:\n• Cover sensitive crops\n• Check drainage systems\n• Postpone pesticide application`,
      [{ text: 'Close' }]
    );
  };

  const showMarketDetails = (notification) => {
    Alert.alert(
      notification.title,
      `${notification.message}\n\nCurrent prices:\n• Wheat: ₹2,150 per quintal\n• Rice: ₹1,890 per quintal\n• Soybean: ₹3,240 per quintal`,
      [{ text: 'Close' }]
    );
  };

  const FilterChip = ({ label, selected, onPress }) => (
    <TouchableOpacity
      className={`px-4 py-3 rounded-full border mx-1 ${
        selected 
          ? 'bg-green-100 border-green-500' 
          : 'bg-white border-gray-300'
      }`}
      onPress={onPress}
    >
      <Text className={`text-sm font-medium ${
        selected ? 'text-green-700' : 'text-gray-600'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const NotificationCard = ({ notification }) => {
    const { icon, color } = getNotificationIcon(notification.type);
    
    return (
      <TouchableOpacity
        className={`mx-4 my-2 rounded-xl border ${
          notification.isRead ? 'bg-white' : 'bg-green-50'
        } border-green-100`}
        onPress={() => handleNotificationTap(notification)}
        onLongPress={() => showNotificationOptions(notification)}
      >
        <View className="p-4 flex-row items-start">
          {/* Notification Icon */}
          <View 
            className="w-10 h-10 rounded-lg justify-center items-center mr-4"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon name={icon} size={20} color={color} />
          </View>

          {/* Notification Content */}
          <View className="flex-1">
            {/* Title */}
            <Text className={`text-base ${
              notification.isRead ? 'font-normal' : 'font-bold'
            } text-green-900`}>
              {notification.title}
            </Text>

            <View className="h-1.5" />

            {/* Message */}
            <Text className="text-sm text-gray-600">
              {notification.message}
            </Text>

            <View className="h-2.5" />

            {/* Time and Read Indicator */}
            <View className="flex-row items-center">
              <Text className="text-xs text-green-600">
                {notification.time}
              </Text>
              
              <View className="flex-1" />
              
              {/* Unread Indicator */}
              {!notification.isRead && (
                <View className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center px-8 py-16">
      <Icon name="notifications-off" size={64} color="#9ca3af" />
      <View className="h-4" />
      <Text className="text-lg text-gray-500 text-center">
        No notifications
      </Text>
      <View className="h-2" />
      <Text className="text-sm text-gray-400 text-center">
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
      
      {/* Header */}
      <View className="bg-green-600 flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text className="text-white text-xl font-semibold">Notifications</Text>
        
        <View className="flex-row">
          <TouchableOpacity 
            className="p-2 mr-2"
            onPress={() => setShowFilterModal(true)}
          >
            <Icon name="filter-alt" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity className="p-2" onPress={markAllAsRead}>
            <Icon name="mark-as-unread" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Section with Proper Spacing */}
      <View className="bg-gray-50 border-b border-gray-200">
        <View className="py-3">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          >
            <View className="flex-row items-center">
              <FilterChip
                label="Unread Only"
                selected={showUnreadOnly}
                onPress={() => setShowUnreadOnly(!showUnreadOnly)}
              />
              
              {Object.values(NotificationFilter).map(filter => (
                <FilterChip
                  key={filter}
                  label={getFilterName(filter)}
                  selected={currentFilter === filter}
                  onPress={() => setCurrentFilter(filter)}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {filteredNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <View className="py-2">
            {filteredNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-green-600 rounded-full justify-center items-center shadow-lg"
        onPress={addSampleNotification}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-3/4">
            <Text className="text-xl font-bold text-center mb-4">
              Filter Notifications
            </Text>
            
            {/* Unread Only Switch */}
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-base">Unread Only</Text>
              <Switch
                value={showUnreadOnly}
                onValueChange={setShowUnreadOnly}
                trackColor={{ false: '#f3f4f6', true: '#dcfce7' }}
                thumbColor={showUnreadOnly ? primaryColor : '#f3f4f6'}
              />
            </View>

            {/* Filter Options */}
            {Object.values(NotificationFilter).map(filter => (
              <TouchableOpacity
                key={filter}
                className="flex-row items-center py-4 border-b border-gray-100"
                onPress={() => {
                  setCurrentFilter(filter);
                  setShowFilterModal(false);
                }}
              >
                <Icon 
                  name={getFilterIcon(filter)} 
                  size={20} 
                  color={primaryColor} 
                  className="mr-3"
                />
                <Text className="flex-1 text-base">{getFilterName(filter)}</Text>
                {currentFilter === filter && (
                  <Icon name="check" size={20} color={primaryColor} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              className="mt-4 py-3 bg-green-600 rounded-xl"
              onPress={() => setShowFilterModal(false)}
            >
              <Text className="text-white text-center text-base font-semibold">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationScreen;