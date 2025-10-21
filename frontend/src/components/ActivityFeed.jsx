import { useInventory } from "../contextAPI/InventoryContext";
import { TruckIcon, ShoppingCart, AlertTriangle, Package } from "lucide-react";

const ActivityFeed = () => {
const { activities } = useInventory();

  const getIcon = (type) => {
    switch (type) {
      case "shipment":
        return <TruckIcon className="h-5 w-5 text-green-500" />;
      case "order":
        return <ShoppingCart className="h-5 w-5 text-purple-500" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "product_added":
        return <Package className="h-5 w-5 text-blue-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-md border border-gray-200 transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Real-Time Activity Feed
      </h2>

      <div className="overflow-y-auto max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 transition-all">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.slice(0, 20).map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out"
              >
                <div className="mt-1">{getIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 font-medium leading-snug">
                    {activity.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 py-16">
            No recent activity
          </p>
        )}
      </div>
    </div>
  )
}

export default ActivityFeed