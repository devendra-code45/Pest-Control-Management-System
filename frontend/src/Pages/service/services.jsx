import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Pencil,
  MoreVertical,
  Bug,
  ShieldCheck,
  CalendarX,
  Tag,
  Leaf,
  ChevronLeft,
  ChevronRight,
  Rat,
  SprayCan,
  Shield,
  Wind,
} from "lucide-react";
import "./services.css";

const SERVICE_ICONS = {
  "Termite Control": Bug,
  "General Pest Control": SprayCan,
  "Rodent Control": Rat,
  "Bed Bug Control": Shield,
  "Mosquito Control": Wind,
};

const MOCK_SERVICES = [
  {
    id: "SRV-2025-00124",
    name: "Termite Treatment",
    category: "Termite Control",
    description: "Comprehensive termite inspection and treatment to protect your property.",
    duration: "2 - 3 Hours",
    price: 150,
    status: "Active",
  },
  {
    id: "SRV-2025-00125",
    name: "Cockroach Control",
    category: "General Pest Control",
    description: "Effective cockroach control service for residential and commercial spaces.",
    duration: "1 - 2 Hours",
    price: 100,
    status: "Active",
  },
  {
    id: "SRV-2025-00126",
    name: "Rodent Control",
    category: "Rodent Control",
    description: "Safe and effective rodent removal and prevention solutions.",
    duration: "2 - 4 Hours",
    price: 120,
    status: "Active",
  },
  {
    id: "SRV-2025-00127",
    name: "General Pest Control",
    category: "General Pest Control",
    description: "General pest control for ants, spiders, flies and other common pests.",
    duration: "1 - 2 Hours",
    price: 90,
    status: "Active",
  },
  {
    id: "SRV-2025-00128",
    name: "Bed Bug Treatment",
    category: "Bed Bug Control",
    description: "Specialized treatment for bed bugs with complete eradication.",
    duration: "2 - 3 Hours",
    price: 130,
    status: "Inactive",
  },
  {
    id: "SRV-2025-00129",
    name: "Mosquito Control",
    category: "Mosquito Control",
    description: "Mosquito control service for outdoor and indoor areas.",
    duration: "1 - 2 Hours",
    price: 80,
    status: "Active",
  },
];

const STAT_CARDS = [
  { label: "Total Services", value: 24, sub: "All Services", icon: Tag },
  { label: "Active Services", value: 20, sub: "Currently Active", icon: ShieldCheck },
  { label: "Inactive Services", value: 4, sub: "Currently Inactive", icon: CalendarX },
  { label: "Popular Service", value: "Termite Treatment", sub: "Most Booked", icon: Tag, isText: true },
  { label: "Eco-friendly", value: 16, sub: "Green Services", icon: Leaf },
];

export default function Services() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => ["all", ...new Set(MOCK_SERVICES.map((s) => s.category))],
    []
  );

  const filtered = useMemo(() => {
    return MOCK_SERVICES.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || s.category === category;
      const matchesStatus = status === "all" || s.status.toLowerCase() === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  const navigate = useNavigate();

  return (
    <div className="services-page">
      <div className="services-breadcrumb">
        <span className="crumb-active">Dashboard</span>
        <span className="crumb-sep">›</span>
        <span>Services</span>
      </div>

      <div className="services-header">
        <div>
          <h1>Services</h1>
          <p>Manage all pest control services offered by your company.</p>
        </div>
        <button className="btns btns-primary services-add-btn" onClick={() => navigate("/admin/services/add")}>
          <Plus size={18} />
          Add Service
        </button>
      </div>

      

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by service name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="toolbar-field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="toolbar-field">
            <label>Show</label>
            <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
              <option value={10}>10 Per Page</option>
              <option value={25}>25 Per Page</option>
              <option value={50}>50 Per Page</option>
            </select>
          </div>
        </div>

        <div className="table-scroll">
          <table className="services-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No services match your search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const Icon = SERVICE_ICONS[s.category] || Bug;
                  return (
                    <tr key={s.id}>
                      <td>
                        <div className="service-name-cell">
                          <span className="service-icon">
                            <Icon size={18} />
                          </span>
                          <div>
                            <div className="service-name">{s.name}</div>
                            <div className="service-sub-category">{s.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="service-description">{s.description}</td>
                      <td className="duration-cell">{s.duration}</td>
                      <td className="price-cell">${s.price.toFixed(2)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            s.status === "Active" ? "status-active" : "status-inactive"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-btn" aria-label="View"  onClick={() => navigate("/admin/services/details")}>
                            <Eye size={16} />
                          </button>
                          <button className="icon-btn" aria-label="Edit" onClick={() => navigate("/admin/services/edit")}>
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Showing 1 to {filtered.length} of 24 results</span>
          <div className="pagination">
            <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`page-btn ${page === n ? "page-btn-active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <span className="page-ellipsis">...</span>
            <button
              className={`page-btn ${page === 5 ? "page-btn-active" : ""}`}
              onClick={() => setPage(5)}
            >
              5
            </button>
            <button className="page-btn" onClick={() => setPage((p) => Math.min(5, p + 1))}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}