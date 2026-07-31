import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Clock,
  Calendar,
  Headphones,
  Search,
  ChevronDown,
  Filter,
  Bug,
  Home,
  CheckCircle2,
  Leaf,
  Phone,
  Star,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import api from "../../api/axios";
import "./AvailableServices.css";

const trustBar = [
  {
    icon: ShieldCheck,
    label: "100% Safe & Eco Friendly",
  },
  {
    icon: UserCheck,
    label: "Trained & Verified Technicians",
  },
  {
    icon: Clock,
    label: "On-Time Service",
  },
  {
    icon: Calendar,
    label: "Easy Online Booking",
  },
  {
    icon: Headphones,
    label: "Customer Support",
  },
];

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (!error.response) {
    return "Unable to connect to the backend.";
  }

  return "Unable to load available services.";
};

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export default function AvailableServices({
  onSelectService,
  onContactSupport,
}) {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All Categories");
  const [duration, setDuration] =
    useState("All Durations");
  const [priceRange, setPriceRange] =
    useState("All Prices");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/customer/services"
      );

      setServices(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (requestError) {
      setServices([]);
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const categories = useMemo(
    () => [
      "All Categories",
      ...new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      ),
    ],
    [services]
  );

  const durations = useMemo(
    () => [
      "All Durations",
      ...new Set(
        services
          .map((service) => service.duration)
          .filter(Boolean)
      ),
    ],
    [services]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !query ||
        String(service.name || "")
          .toLowerCase()
          .includes(query) ||
        String(service.category || "")
          .toLowerCase()
          .includes(query) ||
        String(service.description || "")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All Categories" ||
        service.category === category;

      const matchesDuration =
        duration === "All Durations" ||
        service.duration === duration;

      const price = Number(service.price || 0);

      const matchesPrice =
        priceRange === "All Prices" ||
        (priceRange === "Below ₹1,000" &&
          price < 1000) ||
        (priceRange === "₹1,000 - ₹2,000" &&
          price >= 1000 &&
          price <= 2000) ||
        (priceRange === "Above ₹2,000" &&
          price > 2000);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDuration &&
        matchesPrice
      );
    });
  }, [
    services,
    search,
    category,
    duration,
    priceRange,
  ]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setDuration("All Durations");
    setPriceRange("All Prices");
  };

  const handleSelect = (service) => {
    sessionStorage.setItem(
      "pcmsSelectedServiceId",
      String(service.id)
    );

    sessionStorage.setItem(
      "pcmsSelectedService",
      JSON.stringify(service)
    );

    if (typeof onSelectService === "function") {
      onSelectService(service.id, service);
      return;
    }

    navigate("/customer/create-booking", {
      state: {
        serviceId: service.id,
        service,
      },
    });
  };

  const handleContactSupport = () => {
    if (typeof onContactSupport === "function") {
      onContactSupport();
      return;
    }

    navigate("/customer/contact-support");
  };

  return (
    <div className="avs-page">
      <nav
        className="avs-breadcrumb"
        aria-label="Breadcrumb"
      >
        <button
          type="button"
          className="avs-breadcrumb-link avs-breadcrumb-button"
          onClick={() =>
            navigate("/customer/dashboard")
          }
        >
          Dashboard
        </button>

        <ChevronRight
          size={14}
          className="avs-breadcrumb-sep"
        />

        <span className="avs-breadcrumb-current">
          Available Services
        </span>
      </nav>

      <header className="avs-header">
        <div className="avs-header-left">
          <span className="avs-header-icon">
            <ShieldCheck
              size={26}
              strokeWidth={2}
            />
          </span>

          <div>
            <h1 className="avs-title">
              Available Services
            </h1>

            <p className="avs-subtitle">
              Explore our professional pest control
              services for a cleaner and safer
              environment.
            </p>
          </div>
        </div>

        <div className="avs-promo-card">
          <div className="avs-promo-text">
            <h2 className="avs-promo-title">
              Protect Your Home &amp; Family
            </h2>

            <p className="avs-promo-desc">
              Choose the right pest control service
              for a healthier living space.
            </p>
          </div>

          <div className="avs-promo-illustration">
            <Home
              size={40}
              strokeWidth={1.5}
              className="avs-promo-home"
            />

            <ShieldCheck
              size={26}
              strokeWidth={2}
              className="avs-promo-shield"
            />

            <Bug
              size={16}
              strokeWidth={2}
              className="avs-promo-bug"
            />
          </div>
        </div>
      </header>

      <section className="avs-trust-bar">
        {trustBar.map(
          ({ icon: Icon, label }) => (
            <div
              className="avs-trust-item"
              key={label}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{label}</span>
            </div>
          )
        )}
      </section>

      {error && (
        <div className="avs-message avs-message-error">
          <AlertCircle size={17} />
          {error}

          <button
            type="button"
            className="avs-retry-button"
            onClick={loadServices}
          >
            Retry
          </button>
        </div>
      )}

      <section className="avs-filters-card">
        <div className="avs-search-wrap">
          <Search
            size={16}
            className="avs-search-icon"
          />

          <input
            type="text"
            className="avs-search-input"
            placeholder="Search services by name or category..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="avs-select">
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="avs-select-caret"
          />
        </div>

        <div className="avs-select">
          <select
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value)
            }
          >
            {durations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="avs-select-caret"
          />
        </div>

        <div className="avs-select">
          <select
            value={priceRange}
            onChange={(event) =>
              setPriceRange(event.target.value)
            }
          >
            <option>All Prices</option>
            <option>Below ₹1,000</option>
            <option>₹1,000 - ₹2,000</option>
            <option>Above ₹2,000</option>
          </select>

          <ChevronDown
            size={16}
            className="avs-select-caret"
          />
        </div>

        <button
          type="button"
          className="avs-btn avs-btn-outline"
          onClick={handleClearFilters}
        >
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <div className="avs-section-heading">
        <h2 className="avs-section-title">
          Our Pest Control Services
        </h2>

        <span className="avs-section-count">
          {filtered.length} Services Available
        </span>
      </div>

      {loading ? (
        <div className="avs-loading">
          <LoaderCircle
            size={22}
            className="avs-loading-icon"
          />
          Loading available services...
        </div>
      ) : filtered.length === 0 ? (
        <div className="avs-empty-state">
          No active services match your search
          or filters.
        </div>
      ) : (
        <section className="avs-grid">
          {filtered.map((service, index) => (
            <div
              className="avs-card"
              key={service.id}
              onClick={() =>
                handleSelect(service)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  handleSelect(service);
                }
              }}
            >
              <div className="avs-card-top">
                <span className="avs-card-icon">
                  {service.serviceImage ? (
                    <img
                      src={service.serviceImage}
                      alt={service.name}
                      className="avs-card-image"
                    />
                  ) : (
                    <Bug
                      size={28}
                      strokeWidth={1.75}
                    />
                  )}
                </span>

                <div className="avs-card-heading">
                  <div className="avs-card-title-row">
                    <h3 className="avs-card-title">
                      {service.name}
                    </h3>

                    {index === 0 && (
                      <span className="avs-card-badge">
                        <Star
                          size={11}
                          strokeWidth={2}
                        />
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="avs-card-desc">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="avs-card-features">
                <span className="avs-feature-chip">
                  <CheckCircle2
                    size={13}
                    strokeWidth={2}
                  />
                  {service.category}
                </span>

                <span className="avs-feature-chip">
                  <CheckCircle2
                    size={13}
                    strokeWidth={2}
                  />
                  Active Service
                </span>
              </div>

              <div className="avs-card-footer">
                <span className="avs-card-price">
                  <Leaf
                    size={14}
                    strokeWidth={2}
                  />
                  {formatPrice(service.price)}
                </span>

                <span className="avs-card-duration">
                  <Clock
                    size={14}
                    strokeWidth={2}
                  />
                  {service.duration}
                </span>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="avs-help-band">
        <div className="avs-help-left">
          <span className="avs-help-icon">
            <Headphones
              size={22}
              strokeWidth={2}
            />
          </span>

          <div>
            <h3 className="avs-help-title">
              Need Help Choosing the Right
              Service?
            </h3>

            <p className="avs-help-desc">
              Our pest control experts are here to
              help you select the best solution for
              your needs.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="avs-btn avs-btn-primary"
          onClick={handleContactSupport}
        >
          <Phone size={16} strokeWidth={2} />
          Contact Support
        </button>
      </section>
    </div>
  );
}