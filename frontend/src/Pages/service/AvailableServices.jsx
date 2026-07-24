import React, { useMemo, useState } from "react";
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
  PawPrint,
  Wrench,
  Home,
  CheckCircle2,
  Leaf,
  Phone,
  Star,
} from "lucide-react";
import "./AvailableServices.css";

const trustBar = [
  { icon: ShieldCheck, label: "100% Safe & Eco Friendly" },
  { icon: UserCheck, label: "Trained & Verified Technicians" },
  { icon: Clock, label: "On-Time Service" },
  { icon: Calendar, label: "Easy Online Booking" },
  { icon: Headphones, label: "24/7 Customer Support" },
];

const services = [
  {
    id: "termite-control",
    name: "Termite Control",
    description: "Complete protection from termites with advanced treatment.",
    icon: Bug,
    badge: "Most Popular",
    category: "Residential",
    pestType: "Termite",
    features: ["Inspection", "Treatment", "Warranty"],
    price: "₹2,499 onwards",
    duration: "60 - 90 mins",
  },
  {
    id: "cockroach-control",
    name: "Cockroach Control",
    description: "Effective cockroach elimination for homes and offices.",
    icon: Bug,
    category: "Residential",
    pestType: "Cockroach",
    features: ["Inspection", "Treatment", "Spraying"],
    price: "₹1,299 onwards",
    duration: "45 - 60 mins",
  },
  {
    id: "rodent-control",
    name: "Rodent Control",
    description: "Get rid of rats and rodents safely and effectively.",
    icon: PawPrint,
    category: "Commercial",
    pestType: "Rodent",
    features: ["Inspection", "Baiting", "Sealing"],
    price: "₹1,499 onwards",
    duration: "45 - 45 mins",
  },
  {
    id: "mosquito-control",
    name: "Mosquito Control",
    description: "Reduce mosquito breeding and ensure a safe environment.",
    icon: Bug,
    category: "Residential",
    pestType: "Mosquito",
    features: ["Fogging", "Larvae Control", "Repellent"],
    price: "₹999 onwards",
    duration: "30 - 45 mins",
  },
  {
    id: "bed-bug-treatment",
    name: "Bed Bug Treatment",
    description: "Specialized treatment to eliminate bed bugs completely.",
    icon: Bug,
    category: "Residential",
    pestType: "Bed Bug",
    features: ["Inspection", "Heat Treatment", "Spraying"],
    price: "₹1,799 onwards",
    duration: "60 - 90 mins",
  },
  {
    id: "ant-control",
    name: "Ant Control",
    description: "Effective solutions for ant infestations in your space.",
    icon: Bug,
    category: "Residential",
    pestType: "Ant",
    features: ["Inspection", "Gel Treatment", "Spraying"],
    price: "₹699 onwards",
    duration: "30 - 45 mins",
  },
  {
    id: "general-pest-control",
    name: "General Pest Control",
    description: "All-in-one pest control for common household pests.",
    icon: Wrench,
    category: "Residential",
    pestType: "Multiple",
    features: ["Inspection", "Treatment", "Spraying"],
    price: "₹1,199 onwards",
    duration: "45 - 60 mins",
  },
  {
    id: "annual-pest-protection",
    name: "Annual Pest Protection",
    description: "Year-round protection plan for a pest-free environment.",
    icon: Home,
    category: "Commercial",
    pestType: "Multiple",
    features: ["Regular Visits", "Priority Support", "Warranty"],
    price: "₹4,999 onwards",
    duration: "Yearly Plan",
  },
];

export default function AvailableServices({ onSelectService, onContactSupport }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [pestType, setPestType] = useState("All Pest Types");
  const [area, setArea] = useState("All Areas");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !search.trim() ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.pestType.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All Categories" || s.category === category;
      const matchesPestType = pestType === "All Pest Types" || s.pestType === pestType;
      return matchesSearch && matchesCategory && matchesPestType;
    });
  }, [search, category, pestType]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setPestType("All Pest Types");
    setArea("All Areas");
  };

  const handleSelect = (serviceId) => {
    if (typeof onSelectService === "function") {
      onSelectService(serviceId);
    } else {
      console.log("Selected service:", serviceId);
    }
  };

  const handleContactSupport = () => {
    if (typeof onContactSupport === "function") {
      onContactSupport();
    } else {
      console.log("Contact support clicked");
    }
  };

  return (
    <div className="avs-page">
      <nav className="avs-breadcrumb" aria-label="Breadcrumb">
          Dashboard
        <ChevronRight size={14} className="avs-breadcrumb-sep" />
        <span className="avs-breadcrumb-current">Available Services</span>
      </nav>

      <header className="avs-header">
        <div className="avs-header-left">
          <span className="avs-header-icon">
            <ShieldCheck size={26} strokeWidth={2} />
          </span>
          <div>
            <h1 className="avs-title">Available Services</h1>
            <p className="avs-subtitle">
              Explore our professional pest control services for a cleaner and safer environment.
            </p>
          </div>
        </div>

        <div className="avs-promo-card">
          <div className="avs-promo-text">
            <h2 className="avs-promo-title">Protect Your Home &amp; Family</h2>
            <p className="avs-promo-desc">
              Choose the right pest control service for a healthier living space.
            </p>
          </div>
          <div className="avs-promo-illustration">
            <Home size={40} strokeWidth={1.5} className="avs-promo-home" />
            <ShieldCheck size={26} strokeWidth={2} className="avs-promo-shield" />
            <Bug size={16} strokeWidth={2} className="avs-promo-bug" />
          </div>
        </div>
      </header>

      <section className="avs-trust-bar">
        {trustBar.map(({ icon: Icon, label }) => (
          <div className="avs-trust-item" key={label}>
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="avs-filters-card">
        <div className="avs-search-wrap">
          <Search size={16} className="avs-search-icon" />
          <input
            type="text"
            className="avs-search-input"
            placeholder="Search services by name or pest type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="avs-select">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All Categories</option>
            <option>Residential</option>
            <option>Commercial</option>
          </select>
          <ChevronDown size={16} className="avs-select-caret" />
        </div>

        <div className="avs-select">
          <select value={pestType} onChange={(e) => setPestType(e.target.value)}>
            <option>All Pest Types</option>
            <option>Termite</option>
            <option>Cockroach</option>
            <option>Rodent</option>
            <option>Mosquito</option>
            <option>Bed Bug</option>
            <option>Ant</option>
            <option>Multiple</option>
          </select>
          <ChevronDown size={16} className="avs-select-caret" />
        </div>

        <div className="avs-select">
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option>All Areas</option>
            <option>Pune</option>
            <option>Mumbai</option>
            <option>Pimpri-Chinchwad</option>
          </select>
          <ChevronDown size={16} className="avs-select-caret" />
        </div>

        <button type="button" className="avs-btn avs-btn-outline" onClick={handleClearFilters}>
          <Filter size={16} strokeWidth={2} />
          Clear Filters
        </button>
      </section>

      <div className="avs-section-heading">
        <h2 className="avs-section-title">Our Pest Control Services</h2>
        <span className="avs-section-count">{filtered.length} Services Available</span>
      </div>

      {filtered.length === 0 ? (
        <div className="avs-empty-state">No services match your search or filters.</div>
      ) : (
        <section className="avs-grid">
          {filtered.map((s) => {
            const Icon = s.icon;
            return (
              <div
                className="avs-card"
                key={s.id}
                onClick={() => handleSelect(s.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(s.id);
                }}
              >
                <div className="avs-card-top">
                  <span className="avs-card-icon">
                    <Icon size={28} strokeWidth={1.75} />
                  </span>
                  <div className="avs-card-heading">
                    <div className="avs-card-title-row">
                      <h3 className="avs-card-title">{s.name}</h3>
                      {s.badge && (
                        <span className="avs-card-badge">
                          <Star size={11} strokeWidth={2} />
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <p className="avs-card-desc">{s.description}</p>
                  </div>
                </div>

                <div className="avs-card-features">
                  {s.features.map((f) => (
                    <span className="avs-feature-chip" key={f}>
                      <CheckCircle2 size={13} strokeWidth={2} />
                      {f}
                    </span>
                  ))}
                </div>

                <div className="avs-card-footer">
                  <span className="avs-card-price">
                    <Leaf size={14} strokeWidth={2} />
                    {s.price}
                  </span>
                  <span className="avs-card-duration">
                    <Clock size={14} strokeWidth={2} />
                    {s.duration}
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <section className="avs-help-band">
        <div className="avs-help-left">
          <span className="avs-help-icon">
            <Headphones size={22} strokeWidth={2} />
          </span>
          <div>
            <h3 className="avs-help-title">Need Help Choosing the Right Service?</h3>
            <p className="avs-help-desc">
              Our pest control experts are here to help you select the best solution for your needs.
            </p>
          </div>
        </div>
        <button type="button" className="avs-btn avs-btn-primary" onClick={handleContactSupport}>
          <Phone size={16} strokeWidth={2} />
          Contact Support
        </button>
      </section>
    </div>
  );
}