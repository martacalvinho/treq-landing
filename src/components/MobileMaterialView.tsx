
import { Search } from "lucide-react";

const MobileMaterialView = () => {
  return (
    <div className="lg:hidden mt-8">
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Search className="h-5 w-5 text-coral" />
            <span className="font-semibold text-gray-800">Quick Search</span>
          </div>
          <div className="bg-coral-50 border border-coral-200 rounded-lg p-3">
            <span className="text-coral-800 font-medium text-sm">
              💡 12 duplicate materials detected across your projects
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">Acoustic Panels</h4>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">Duplicate</span>
            </div>
            <p className="text-sm text-gray-600">Rockfon Blanka Activity™</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">Ceramic Tiles</h4>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Available</span>
            </div>
            <p className="text-sm text-gray-600">Mutina Puzzle Indoor</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm opacity-75">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">LED Lighting</h4>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">Discontinued</span>
            </div>
            <p className="text-sm text-gray-600">Artemide Profile Series</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMaterialView;
