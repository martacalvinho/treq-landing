
import { useState } from "react";
import { Search, X, Filter, Star, Clock, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Material {
  id: string;
  name: string;
  description: string;
  brand: string;
  type: string;
  project: string;
  status: 'Available' | 'Discontinued' | 'New';
  price: string;
  usageCount?: number;
  lastUsed?: string;
  isDuplicate?: boolean;
  isFrequentlyUsed?: boolean;
  deliveryTime?: string;
  alternativesCount?: number;
}

const allMaterials: Material[] = [
  {
    id: '1',
    name: 'Rockfon Blanka Activity™ E15',
    description: 'Acoustic ceiling panels • 600x600x15mm',
    brand: 'Rockfon',
    type: 'Commercial',
    project: 'Office Tower',
    status: 'Available',
    price: '$24.50/m²',
    usageCount: 8,
    lastUsed: 'Office Tower Q2 2024',
    isDuplicate: true,
    isFrequentlyUsed: true
  },
  {
    id: '2',
    name: 'Mutina Puzzle Indoor Collection',
    description: 'Ceramic wall tiles • Various sizes available',
    brand: 'Mutina',
    type: 'Flooring',
    project: 'Residential Tower',
    status: 'Available',
    price: '$89.00/m²',
    deliveryTime: '4-6 weeks delivery'
  },
  {
    id: '3',
    name: 'Artemide Architectural Profile Series',
    description: 'Linear LED strip lighting • 2700K-4000K',
    brand: 'Artemide',
    type: 'Lighting',
    project: 'Office Tower',
    status: 'Discontinued',
    price: '$156.00/m',
    alternativesCount: 3
  },
  {
    id: '4',
    name: 'Interface Human Nature Carpet',
    description: 'Modular carpet tiles • Carbon neutral',
    brand: 'Interface',
    type: 'Flooring',
    project: 'Office Tower',
    status: 'New',
    price: '$42.00/m²'
  }
];

const MaterialDashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState(['Office Tower', 'Commercial', 'Rockfon']);
  const [showDuplicates, setShowDuplicates] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  const removeFilter = (filter: string) => {
    setSelectedFilters(prev => prev.filter(f => f !== filter));
  };

  const addFilter = (filter: string) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters(prev => [...prev, filter]);
    }
  };

  const toggleDuplicates = () => {
    setShowDuplicates(!showDuplicates);
  };

  const availableFilters = [
    { label: 'Project: Residential Tower', value: 'Residential Tower' },
    { label: 'Type: Flooring', value: 'Flooring' },
    { label: 'Type: Lighting', value: 'Lighting' },
    { label: 'Brand: Interface', value: 'Interface' },
    { label: 'Brand: Artemide', value: 'Artemide' },
    { label: 'Brand: Mutina', value: 'Mutina' },
    { label: 'Status: Available', value: 'Available' },
    { label: 'Status: Discontinued', value: 'Discontinued' },
  ].filter(filter => !selectedFilters.includes(filter.value));

  // Filter materials based on selected filters
  const filteredMaterials = allMaterials.filter(material => {
    if (selectedFilters.length === 0) return true;
    
    return selectedFilters.some(filter => 
      material.project === filter ||
      material.type === filter ||
      material.brand === filter ||
      material.status === filter
    );
  });

  // Sort materials
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return (b.usageCount || 0) - (a.usageCount || 0);
      case 'price':
        const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
        return priceA - priceB;
      case 'availability':
        const statusOrder = { 'Available': 0, 'New': 1, 'Discontinued': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const duplicateCount = filteredMaterials.filter(m => m.isDuplicate).length;

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
      {/* Dashboard Header with Search Bar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Search className="h-4 w-4 text-coral" />
            </div>
            <span className="font-semibold text-gray-800">Material Library</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Package className="h-4 w-4" />
            <span>{filteredMaterials.length} materials</span>
          </div>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by material, project, or manufacturer..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-600"
              defaultValue="acoustic ceiling panels"
            />
          </div>
        </div>
        
        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedFilters.map((filter, index) => (
            <span 
              key={filter}
              className="bg-white px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:bg-coral-50 hover:border-coral-200 transition-all duration-200 cursor-pointer group flex items-center gap-2"
              onClick={() => removeFilter(filter)}
            >
              {index === 0 ? 'Project: ' : index === 1 ? 'Type: ' : 'Brand: '}{filter}
              <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </span>
          ))}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white px-3 py-2 rounded-full text-sm font-medium text-gray-500 border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2">
                <Filter className="h-3 w-3" />
                Add filter
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {availableFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => addFilter(filter.value)}
                  className="cursor-pointer"
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Smart Insights */}
        {showDuplicates && duplicateCount > 0 && (
          <div 
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 shadow-sm cursor-pointer group"
            onClick={toggleDuplicates}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-amber-800 font-bold text-sm">{duplicateCount} potential duplicates detected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 text-xs font-medium">Auto-detected</span>
                <X className="h-3 w-3 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Enhanced Material Cards */}
      <div className="p-6 space-y-3 bg-gradient-to-b from-white to-gray-50 max-h-80 overflow-y-auto">
        {sortedMaterials.map((material) => (
          <div 
            key={material.id}
            className={`${
              material.isFrequentlyUsed 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400' 
                : material.status === 'Discontinued'
                ? 'bg-white border border-gray-200 opacity-75'
                : 'bg-white border border-gray-200'
            } rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                {material.isFrequentlyUsed && (
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-500 fill-current" />
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Frequently Used</span>
                  </div>
                )}
                {material.status === 'New' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-coral rounded-full"></div>
                    <span className="text-xs font-semibold text-coral uppercase tracking-wide">Recently Added</span>
                  </div>
                )}
                <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-coral transition-colors duration-200">
                  {material.name}
                </h4>
                <p className="text-gray-600 text-sm mb-2">{material.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {material.usageCount && (
                    <span>Used in {material.usageCount} projects</span>
                  )}
                  {material.lastUsed && (
                    <>
                      <span>•</span>
                      <span>Last spec: {material.lastUsed}</span>
                    </>
                  )}
                  {material.deliveryTime && (
                    <>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span>In stock</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{material.deliveryTime}</span>
                      </div>
                    </>
                  )}
                  {material.alternativesCount && (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      <span>{material.alternativesCount} similar alternatives available</span>
                    </div>
                  )}
                  {material.status === 'New' && (
                    <>
                      <span>Added 2 days ago</span>
                      <span>•</span>
                      <span>Sustainability focused</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                  material.isDuplicate 
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : material.status === 'Available'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : material.status === 'Discontinued'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {material.isDuplicate ? 'Duplicate' : material.status}
                </span>
                <span className={`text-xs ${material.status === 'Discontinued' ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                  {material.price}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredMaterials.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No materials found</p>
            <p className="text-sm">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>

      {/* Dashboard Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Showing {sortedMaterials.length} of {allMaterials.length} results</span>
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-8 text-xs border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="recent">Recently used</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDashboard;
