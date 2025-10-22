import { useState } from "react";
import { useInventory } from "../contextAPI/InventoryContext";
import { AlertTriangle, CheckCircle, XCircle, Filter, Eye } from "lucide-react";
import StateCard from "../components/StateCard";

const Alerts = () => {
  const { alerts, resolveAlert, dismissAlert, products } = useInventory();
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab === "all") return true;
    return alert.status === activeTab;
  });

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length;
  const dismissedCount = alerts.filter((a) => a.status === "dismissed").length;

  const getTimestamp = (date) => {
    const now = new Date();
    const alertDate = new Date(date);
    const diffMs = now.getTime() - alertDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const getProduct = (productId) => products.find((p) => p.id === productId);

  const renderEmpty = (icon, message) => (
    <div className="text-center py-10 text-gray-500">
      {icon}
      <p className="mt-3 text-sm">{message}</p>
    </div>
  );

  const renderAlert = (alert) => {
    const product = getProduct(alert.productId);

    const statusColors = {
      active: "border-orange-300 bg-orange-50",
      resolved: "border-green-300 bg-green-50",
      dismissed: "border-gray-300 bg-gray-50",
    };

    return (
      <div
        key={alert.id}
        className={`rounded-lg border p-4 transition-all duration-300 hover:shadow-md ${statusColors[alert.status]}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {alert.status === "active" && (
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              )}
              {alert.status === "resolved" && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {alert.status === "dismissed" && (
                <XCircle className="h-5 w-5 text-gray-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-gray-900 font-semibold">
                  {alert.productName}
                </h4>
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full ${
                    alert.status === "active"
                      ? "bg-orange-500"
                      : alert.status === "resolved"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                >
                  {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                Stock level:{" "}
                <span className="text-orange-700 font-medium">
                  {alert.quantity} units
                </span>{" "}
                (Threshold: {alert.threshold})
              </p>

              {product && (
                <div className="mb-3 text-xs text-gray-500">
                  <span>Current stock: </span>
                  <span
                    className={`font-medium ${
                      product.quantity <= product.reorderThreshold
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.quantity} units
                  </span>
                </div>
              )}

              <p className="text-xs text-gray-500">
                {getTimestamp(alert.timestamp)}
              </p>
            </div>
          </div>

          {alert.status === "active" && (
            <div className="flex md:flex-row flex-col gap-3 ml-2 flex-shrink-0">
              <button
                onClick={() => resolveAlert(alert.id)}
                className="flex items-center gap-1 border border-green-300 text-green-700 text-sm px-3 py-1 rounded-lg hover:bg-green-50 transition "
              >
                <CheckCircle className="h-4 w-4" />
                Resolve
              </button>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="flex items-center gap-1 border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-lg hover:bg-gray-50 transition"
              >
                <XCircle className="h-4 w-4" />
                Dismiss
              </button>
            </div>
          )}
        </div>

        {alert.status === "active" && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-orange-200">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (alert.quantity / alert.threshold) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shipment Management</h1>
        <p className="mt-1 text-gray-600">
          Receive and process incoming shipments
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setActiveTab(e.target.value);
          }}
          className="w-40 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">All Alerts</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StateCard
          title="Low Stock Items"
          value={activeCount}
          icon={AlertTriangle}
          color="orange"
        />
        <StateCard
          title="Resolved"
          value={resolvedCount}
          icon={CheckCircle}
          color="green"
        />
        <StateCard
          title="Dismissed"
          value={dismissedCount}
          icon={XCircle}
          color="purple"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Alert History</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: `All (${alerts.length})`, value: "all" },
            { label: `Active (${activeCount})`, value: "active" },
            { label: `Resolved (${resolvedCount})`, value: "resolved" },
            { label: `Dismissed (${dismissedCount})`, value: "dismissed" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {filteredAlerts.length > 0
            ? filteredAlerts.map((alert) => renderAlert(alert))
            : renderEmpty(
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />,
                "No alerts found"
              )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
