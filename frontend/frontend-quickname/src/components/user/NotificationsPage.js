import React, { useState, useEffect, useRef } from 'react';

const NotificationsPage = ({ 
  showNotifications, 
  notifications, 
  onClose, 
  onViewAll,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  loadMoreNotifications
}) => {
  const [localNotifications, setLocalNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsRef = useRef(null);

  // Initialize local notifications when props change
  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      setLocalNotifications(notifications);
    }
  }, [notifications]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, onClose]);

  // Add safety checks
  if (!showNotifications) {
    return null;
  }

  if (!localNotifications || !Array.isArray(localNotifications)) {
    return null;
  }

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    }
  };

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      if (loadMoreNotifications) {
        const nextPage = currentPage + 1;
        const newNotifications = await loadMoreNotifications(nextPage);
        
        if (newNotifications && newNotifications.length > 0) {
          setLocalNotifications(prev => [...prev, ...newNotifications]);
          setCurrentPage(nextPage);
        } else {
          setHasMore(false);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockNotifications = generateMockNotifications(currentPage * 5, 5);
        setLocalNotifications(prev => [...prev, ...mockNotifications]);
        setCurrentPage(prev => prev + 1);
        
        if (currentPage >= 3) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId) => {
    if (markAsRead) {
      markAsRead(notificationId);
    } else {
      setLocalNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    }
  };

  const handleMarkAllAsRead = () => {
    if (markAllAsRead) {
      markAllAsRead();
    } else {
      setLocalNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    }
  };

  const handleDeleteNotification = (notificationId) => {
    if (deleteNotification) {
      deleteNotification(notificationId);
    } else {
      setLocalNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      );
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order: '📦',
      system: '⚙️',
      customer: '👤',
      payment: '💳',
      security: '🔒',
      promotion: '🎁',
      default: '🔔'
    };
    return icons[type] || icons.default;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const unreadCount = localNotifications.filter(notif => !notif.read).length;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      zIndex: 1000,
    },
    notificationsPage: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '420px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      zIndex: 1001,
      maxHeight: '80vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    notificationsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f8fafc'
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    unreadBadge: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '10px',
      padding: '2px 8px',
      fontSize: '12px',
      fontWeight: '600'
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px'
    },
    markAllReadButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#7C2A62',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px 8px',
      borderRadius: '4px'
    },
    notificationsList: {
      flex: 1,
      overflowY: 'auto',
      maxHeight: '400px'
    },
    notificationItem: {
      display: 'flex',
      padding: '16px 20px',
      borderBottom: '1px solid #f3f4f6',
      transition: 'background-color 0.3s ease',
      position: 'relative',
      backgroundColor: 'transparent',
      cursor: 'pointer'
    },
    unreadNotification: {
      backgroundColor: '#f0f9ff'
    },
    notificationIcon: {
      fontSize: '20px',
      marginRight: '12px',
      marginTop: '2px',
      flexShrink: 0
    },
    notificationContent: {
      flex: 1,
      minWidth: 0
    },
    notificationTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 4px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    notificationMessage: {
      fontSize: '13px',
      color: '#6b7280',
      margin: '0 0 4px 0',
      lineHeight: '1.4',
      wordWrap: 'break-word'
    },
    notificationTime: {
      fontSize: '11px',
      color: '#9ca3af'
    },
    deleteButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontSize: '12px',
      padding: '2px 6px',
      borderRadius: '3px',
      marginLeft: '8px'
    },
    emptyState: {
      padding: '40px 20px',
      textAlign: 'center',
      color: '#6b7280'
    },
    loadingState: {
      padding: '20px',
      textAlign: 'center',
      color: '#6b7280'
    },
    notificationsFooter: {
      padding: '16px 20px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#f8fafc'
    },
    viewAllButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#7C2A62',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      transition: 'background-color 0.2s ease'
    },
    loadMoreButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'transparent',
      color: '#7C2A62',
      border: '1px solid #7C2A62',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      marginBottom: '10px'
    },
    loadMoreButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  };

  const generateMockNotifications = (startId, count) => {
    const types = ['order', 'system', 'customer', 'payment', 'promotion'];
    const messages = [
      'Your order #ORD-12345 has been shipped',
      'System maintenance scheduled for tonight',
      'New customer registration completed',
      'Payment of $149.99 received successfully',
      'Special promotion: 20% off all items this weekend',
      'Your account password was changed',
      'New review received for your product',
      'Inventory low for product "Wireless Earbuds"',
      'Weekly sales report is ready',
      'Security alert: New login from unknown device'
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `notification-${startId + i}`,
      title: `Notification ${startId + i + 1}`,
      message: messages[Math.floor(Math.random() * messages.length)],
      type: types[Math.floor(Math.random() * types.length)],
      time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      read: false
    }));
  };

  return (
    <>
      {/* Overlay for catching outside clicks */}
      <div style={styles.overlay} />
      
      {/* Notifications Popup */}
      <div ref={notificationsRef} style={styles.notificationsPage}>
        <div style={styles.notificationsHeader}>
          <div>
            <h3 style={{ margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <span style={styles.unreadBadge}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <div style={styles.headerActions}>
            {unreadCount > 0 && (
              <button
                style={styles.markAllReadButton}
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </button>
            )}
            <button
              style={styles.closeButton}
              onClick={onClose}
              aria-label="Close notifications"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div style={styles.notificationsList}>
          {localNotifications.length > 0 ? (
            <>
              {localNotifications.slice(0, 5).map(notification => (
                <div 
                  key={notification.id} 
                  style={{
                    ...styles.notificationItem,
                    ...(!notification.read ? styles.unreadNotification : {})
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={styles.notificationContent}>
                    <div style={styles.notificationTitle}>
                      <span>{notification.title || 'Notification'}</span>
                      <button
                        style={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                        aria-label="Delete notification"
                      >
                        ×
                      </button>
                    </div>
                    <p style={styles.notificationMessage}>
                      {notification.message || 'No message'}
                    </p>
                    <span style={styles.notificationTime}>
                      {formatTime(notification.time)}
                    </span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={styles.emptyState}>
              No notifications available
            </div>
          )}
        </div>
        
        <div style={styles.notificationsFooter}>
          <button
            style={styles.viewAllButton}
            onClick={handleViewAll}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;