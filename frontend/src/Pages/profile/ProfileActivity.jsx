import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Filter,
  KeyRound,
  Laptop,
  LogIn,
  LogOut,
  Mail,
  Monitor,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  UserRound,
} from 'lucide-react';
import './ProfileActivity.css';

const ACTIVITY_DATA = [
  {
    id: 1,
    title: 'Login Successful',
    description: 'Logged in using password',
    category: 'Login Activity',
    status: 'Success',
    statusType: 'success',
    iconType: 'login',
    ipAddress: '192.168.1.45',
    date: '2026-07-16',
    dateTime: '16 Jul 2026, 02:47 PM',
    location: 'Pune, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Chrome',
  },
  {
    id: 2,
    title: 'Profile Updated',
    description: 'Personal information has been updated',
    category: 'Profile Changes',
    status: 'Update',
    statusType: 'update',
    iconType: 'profile',
    ipAddress: '192.168.1.45',
    date: '2026-07-16',
    dateTime: '16 Jul 2026, 11:15 AM',
    location: 'Pune, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Chrome',
  },
  {
    id: 3,
    title: 'Password Changed',
    description: 'Password changed successfully',
    category: 'Security Activity',
    status: 'Success',
    statusType: 'success',
    iconType: 'password',
    ipAddress: '192.168.1.45',
    date: '2026-07-15',
    dateTime: '15 Jul 2026, 09:12 AM',
    location: 'Pune, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Chrome',
  },
  {
    id: 4,
    title: 'Two Factor Authentication Enabled',
    description: 'Two factor authentication enabled',
    category: 'Security Activity',
    status: 'Security',
    statusType: 'security',
    iconType: 'security',
    ipAddress: '192.168.1.45',
    date: '2026-07-14',
    dateTime: '14 Jul 2026, 04:30 PM',
    location: 'Pune, Maharashtra, India',
    device: 'Android 13',
    browser: 'Chrome Mobile',
  },
  {
    id: 5,
    title: 'Email Verified',
    description: 'Email address verified successfully',
    category: 'Security Activity',
    status: 'Success',
    statusType: 'success',
    iconType: 'email',
    ipAddress: '192.168.1.45',
    date: '2026-07-12',
    dateTime: '12 Jul 2026, 10:05 AM',
    location: 'Pune, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Chrome',
  },
  {
    id: 6,
    title: 'Phone Verified',
    description: 'Phone number verified successfully',
    category: 'Security Activity',
    status: 'Success',
    statusType: 'success',
    iconType: 'phone',
    ipAddress: '192.168.1.45',
    date: '2026-07-12',
    dateTime: '12 Jul 2026, 09:58 AM',
    location: 'Pune, Maharashtra, India',
    device: 'Android 13',
    browser: 'Chrome Mobile',
  },
  {
    id: 7,
    title: 'Logged Out',
    description: 'Logged out from web session',
    category: 'Login Activity',
    status: 'Info',
    statusType: 'info',
    iconType: 'logout',
    ipAddress: '192.168.1.45',
    date: '2026-07-11',
    dateTime: '11 Jul 2026, 06:20 PM',
    location: 'Pune, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Chrome',
  },
  {
    id: 8,
    title: 'New Device Login',
    description: 'Login from new device – Windows • Chrome',
    category: 'Login Activity',
    status: 'Warning',
    statusType: 'warning',
    iconType: 'device',
    ipAddress: '103.21.45.67',
    date: '2026-07-10',
    dateTime: '10 Jul 2026, 08:40 PM',
    location: 'Mumbai, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Chrome',
  },
  {
    id: 9,
    title: 'Password Reset Request',
    description: 'Password reset link requested',
    category: 'Security Activity',
    status: 'Warning',
    statusType: 'warning',
    iconType: 'reset',
    ipAddress: '103.21.45.67',
    date: '2026-07-10',
    dateTime: '10 Jul 2026, 08:35 PM',
    location: 'Mumbai, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Chrome',
  },
  {
    id: 10,
    title: 'Preferences Updated',
    description: 'Language and notification settings updated',
    category: 'Preference Changes',
    status: 'Update',
    statusType: 'update',
    iconType: 'profile',
    ipAddress: '192.168.1.45',
    date: '2026-07-09',
    dateTime: '09 Jul 2026, 03:15 PM',
    location: 'Pune, Maharashtra, India',
    device: 'Windows 11',
    browser: 'Microsoft Edge',
  },
  {
    id: 11,
    title: 'Push Notifications Enabled',
    description: 'Browser push notifications enabled',
    category: 'Preference Changes',
    status: 'Success',
    statusType: 'success',
    iconType: 'security',
    ipAddress: '192.168.1.45',
    date: '2026-07-08',
    dateTime: '08 Jul 2026, 01:28 PM',
    location: 'Pune, Maharashtra, India',
    device: 'Android 13',
    browser: 'Chrome Mobile',
  },
];

const FILTER_OPTIONS = [
  'All Activities',
  'Login Activity',
  'Security Activity',
  'Profile Changes',
  'Preference Changes',
];

const DATE_OPTIONS = [
  {
    value: 'all',
    label: 'All Dates',
  },
  {
    value: '7',
    label: 'Last 7 Days',
  },
  {
    value: '15',
    label: 'Last 15 Days',
  },
  {
    value: '30',
    label: 'Last 30 Days',
  },
];

const ITEMS_PER_PAGE = 9;

function ProfileActivity() {
  const navigate = useNavigate();

  const [activityFilter, setActivityFilter] =
    useState('All Activities');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActivities = useMemo(() => {
    return ACTIVITY_DATA.filter((activity) => {
      const matchesCategory =
        activityFilter === 'All Activities' ||
        activity.category === activityFilter;

      if (!matchesCategory) {
        return false;
      }

      if (dateFilter === 'all') {
        return true;
      }

      const activityDate = new Date(`${activity.date}T00:00:00`);
      const latestActivityDate = new Date('2026-07-16T23:59:59');

      const minimumDate = new Date(latestActivityDate);
      minimumDate.setDate(
        minimumDate.getDate() - Number(dateFilter) + 1,
      );

      return activityDate >= minimumDate;
    });
  }, [activityFilter, dateFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredActivities.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const visibleActivities = useMemo(() => {
    const startIndex =
      (safeCurrentPage - 1) * ITEMS_PER_PAGE;

    return filteredActivities.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [filteredActivities, safeCurrentPage]);

  const firstVisibleRecord =
    filteredActivities.length === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;

  const lastVisibleRecord = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    filteredActivities.length,
  );

  const handleActivityFilterChange = (event) => {
    setActivityFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setActivityFilter('All Activities');
    setDateFilter('all');
    setCurrentPage(1);
  };

  const goToPage = (pageNumber) => {
    const validPage = Math.min(
      Math.max(pageNumber, 1),
      totalPages,
    );

    setCurrentPage(validPage);
  };

  const renderActivityIcon = (iconType) => {
    switch (iconType) {
      case 'login':
        return <LogIn size={19} aria-hidden="true" />;

      case 'profile':
        return <UserRound size={19} aria-hidden="true" />;

      case 'password':
        return <KeyRound size={19} aria-hidden="true" />;

      case 'security':
        return <ShieldCheck size={19} aria-hidden="true" />;

      case 'email':
        return <Mail size={19} aria-hidden="true" />;

      case 'phone':
        return <Smartphone size={19} aria-hidden="true" />;

      case 'logout':
        return <LogOut size={19} aria-hidden="true" />;

      case 'device':
        return <Laptop size={19} aria-hidden="true" />;

      case 'reset':
        return <RotateCcw size={19} aria-hidden="true" />;

      default:
        return <Monitor size={19} aria-hidden="true" />;
    }
  };

  return (
    <main className="profile-activity-page">
      <header className="profile-activity-header">
        <div>
          <nav
            className="profile-activity-breadcrumb"
            aria-label="Activity breadcrumb"
          >
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <ChevronRight size={15} aria-hidden="true" />

            <button
              type="button"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>

            <ChevronRight size={15} aria-hidden="true" />

            <span aria-current="page">Activity</span>
          </nav>

          <h1>Activity</h1>

          <p>
            Review your recent account activity and security events.
          </p>
        </div>

        <button
          type="button"
          className="profile-activity-back-button"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to Profile
        </button>
      </header>

      <section className="profile-activity-card">
        <div className="profile-activity-card-header">
          <div className="profile-activity-section-heading">
            <div className="profile-activity-section-icon">
              <CalendarDays size={23} aria-hidden="true" />
            </div>

            <div>
              <h2>Account Activity</h2>
              <p>
                A log of important actions and events on your
                account.
              </p>
            </div>
          </div>

          <div className="profile-activity-filter-group">
            <label className="profile-activity-filter-control">
              <span className="profile-activity-visually-hidden">
                Filter by date
              </span>

              <CalendarDays size={18} aria-hidden="true" />

              <select
                value={dateFilter}
                onChange={handleDateFilterChange}
              >
                {DATE_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="profile-activity-filter-control">
              <span className="profile-activity-visually-hidden">
                Filter by activity type
              </span>

              <Filter size={18} aria-hidden="true" />

              <select
                value={activityFilter}
                onChange={handleActivityFilterChange}
              >
                {FILTER_OPTIONS.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            {(activityFilter !== 'All Activities' ||
              dateFilter !== 'all') && (
              <button
                type="button"
                className="profile-activity-reset-button"
                onClick={handleResetFilters}
              >
                <RotateCcw size={17} aria-hidden="true" />
                Reset
              </button>
            )}
          </div>
        </div>

        {visibleActivities.length > 0 ? (
          <>
            <div className="profile-activity-table-wrapper">
              <table className="profile-activity-table">
                <thead>
                  <tr>
                    <th scope="col">Activity</th>
                    <th scope="col">Details</th>
                    <th scope="col">IP Address</th>
                    <th scope="col">Date &amp; Time</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleActivities.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <div className="profile-activity-name-cell">
                          <div
                            className={`profile-activity-event-icon profile-activity-event-${activity.statusType}`}
                          >
                            {renderActivityIcon(
                              activity.iconType,
                            )}
                          </div>

                          <div className="profile-activity-name-copy">
                            <div>
                              <strong>{activity.title}</strong>

                              <span
                                className={`profile-activity-status profile-activity-status-${activity.statusType}`}
                              >
                                {activity.status}
                              </span>
                            </div>

                            <small>
                              {activity.device} · {activity.browser}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <p className="profile-activity-description">
                          {activity.description}
                        </p>
                      </td>

                      <td>
                        <span className="profile-activity-ip">
                          {activity.ipAddress}
                        </span>
                      </td>

                      <td>
                        <div className="profile-activity-date-cell">
                          <time>{activity.dateTime}</time>
                          <span>{activity.location}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="profile-activity-mobile-list">
              {visibleActivities.map((activity) => (
                <article
                  className="profile-activity-mobile-card"
                  key={activity.id}
                >
                  <div className="profile-activity-mobile-header">
                    <div
                      className={`profile-activity-event-icon profile-activity-event-${activity.statusType}`}
                    >
                      {renderActivityIcon(activity.iconType)}
                    </div>

                    <div>
                      <h3>{activity.title}</h3>

                      <span
                        className={`profile-activity-status profile-activity-status-${activity.statusType}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>

                  <p>{activity.description}</p>

                  <dl>
                    <div>
                      <dt>IP Address</dt>
                      <dd>{activity.ipAddress}</dd>
                    </div>

                    <div>
                      <dt>Date &amp; Time</dt>
                      <dd>{activity.dateTime}</dd>
                    </div>

                    <div>
                      <dt>Location</dt>
                      <dd>{activity.location}</dd>
                    </div>

                    <div>
                      <dt>Device</dt>
                      <dd>
                        {activity.device} · {activity.browser}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <footer className="profile-activity-footer">
              <p>
                Showing {firstVisibleRecord} to {lastVisibleRecord}{' '}
                of {filteredActivities.length} activities
              </p>

              <nav
                className="profile-activity-pagination"
                aria-label="Activity pagination"
              >
                <button
                  type="button"
                  aria-label="Go to first page"
                  disabled={safeCurrentPage === 1}
                  onClick={() => goToPage(1)}
                >
                  <ChevronFirst size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  aria-label="Go to previous page"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    goToPage(safeCurrentPage - 1)
                  }
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={
                      safeCurrentPage === pageNumber
                        ? 'page'
                        : undefined
                    }
                    className={
                      safeCurrentPage === pageNumber
                        ? 'profile-activity-page-button-active'
                        : ''
                    }
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  aria-label="Go to next page"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    goToPage(safeCurrentPage + 1)
                  }
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  aria-label="Go to last page"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() => goToPage(totalPages)}
                >
                  <ChevronLast size={18} aria-hidden="true" />
                </button>
              </nav>
            </footer>
          </>
        ) : (
          <div className="profile-activity-empty-state">
            <CheckCircle2 size={42} aria-hidden="true" />

            <h3>No matching activities</h3>

            <p>
              No account activities match the selected filters.
            </p>

            <button
              type="button"
              onClick={handleResetFilters}
            >
              <RotateCcw size={18} aria-hidden="true" />
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProfileActivity;