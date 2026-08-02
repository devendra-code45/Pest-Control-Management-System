function getDotClass(type) {
  if (
    type === "PAYMENT_SUCCESS" ||
    type === "REFUND_PROCESSED"
  ) {
    return "orange";
  }

  if (
    type === "PAYMENT_RECEIVED" ||
    type === "REFUND_COMPLETED"
  ) {
    return "blue";
  }

  return "";
}

function formatRelativeTime(createdAt) {
  if (!createdAt) {
    return "";
  }

  const createdTime =
    new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return "";
  }

  const seconds = Math.max(
    0,
    Math.floor(
      (Date.now() - createdTime) / 1000
    )
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1 ? "" : "s"
    } ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${
      hours === 1 ? "" : "s"
    } ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  return new Date(
    createdAt
  ).toLocaleDateString();
}

export default function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const handleNotificationClick = (
    notification
  ) => {
    if (
      !notification.read &&
      typeof onMarkAsRead === "function"
    ) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div className="nb-notification-dropdown">
      <div className="nb-notification-header">
        <strong>Notifications</strong>

        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={
            loading || unreadCount === 0
          }
        >
          Mark all as read
        </button>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="nb-notification-item">
          <div>
            <p>Loading notifications...</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="nb-notification-item">
          <div>
            <strong>No notifications</strong>

            <p>
              New notifications will appear
              here.
            </p>
          </div>
        </div>
      ) : (
        notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className={`nb-notification-item ${
                notification.read
                  ? ""
                  : "unread"
              }`}
              role="button"
              tabIndex={0}
              onClick={() =>
                handleNotificationClick(
                  notification
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();

                  handleNotificationClick(
                    notification
                  );
                }
              }}
            >
              <span
                className={`nb-notification-dot ${getDotClass(
                  notification.type
                )}`}
              />

              <div>
                <strong>
                  {notification.title}
                </strong>

                <p>{notification.message}</p>

                <small>
                  {formatRelativeTime(
                    notification.createdAt
                  )}
                </small>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}
