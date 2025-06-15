
import { TrendingUp, Package, Users, AlertCircle } from "lucide-react";

const HeroDashboardPreview = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] max-w-lg">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <TrendingUp className="h-4 w-4 text-coral" />
          </div>
          <span className="font-semibold text-gray-800">Usage Overview</span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="p-6 space-y-6 bg-gradient-to-b from-white to-gray-50">
        {/* Monthly Usage - Hero Stat */}
        <div className="text-center">
          <div className="text-4xl font-bold text-coral mb-1">35/100</div>
          <div className="text-sm text-gray-600 font-medium">Materials this month</div>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">2</div>
            <div className="text-xs text-gray-500">Active projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">35</div>
            <div className="text-xs text-gray-500">Total materials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">6</div>
            <div className="text-xs text-gray-500">Manufacturers</div>
          </div>
        </div>
        
        {/* Smart Insight */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-semibold text-blue-900 text-sm">Top Material</div>
              <div className="text-blue-700 text-xs">Phenolic Compact Partition Panel</div>
              <div className="text-blue-600 text-xs">Used in 3 projects • CAISL, Office Tower</div>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700">Recent Activity</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <div className="w-2 h-2 bg-coral rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Mirror added to Office Tower</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">ROCA materials updated</div>
                <div className="text-xs text-gray-500">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboardPreview;
