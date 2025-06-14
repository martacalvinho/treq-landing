
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Search, X, Filter, Star, Clock, CheckCircle2, AlertTriangle, Package } from "lucide-react";
import { useState } from "react";
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

const HeroSection = () => {
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
    { label: 'Status: Available', value: 'Available' },
    { label: 'Status: Discontinued', value: 'Discontinued' },
  ].filter(filter => !selectedFilters.includes(filter.value));

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 py-20 md:py-32 pt-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[0.95] mb-6">
                Your Studio's
                <br />
                <span className="text-coral bg-gradient-to-r from-coral to-coral-600 bg-clip-text text-transparent">
                  Material Memory
                </span>
              </h1>
            </div>
            <div className="space-y-6 mb-10">
              <p className="text-xl md:text-2xl text-gray-700 font-semibold leading-tight">
                Never lose track of materials again.
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Instantly search everything you've ever specified - by project, client, type or manufacturer. Build your own complete intelligent material library.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg group"
              >
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 text-lg font-medium hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                Watch 60-sec demo
              </Button>
            </div>
          </div>
          
          {/* Enhanced Desktop Dashboard */}
          <div className="relative hidden lg:block">
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
                    <span>2,847 materials</span>
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
                {showDuplicates && (
                  <div 
                    className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 shadow-sm cursor-pointer group"
                    onClick={toggleDuplicates}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-sm"></div>
                        <span className="text-amber-800 font-bold text-sm">12 potential duplicates detected</span>
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
                {/* Featured Material */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-blue-500 fill-current" />
                        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Frequently Used</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors duration-200">
                        Rockfon Blanka Activity™ E15
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Acoustic ceiling panels • 600x600x15mm</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Used in 8 projects</span>
                        <span>•</span>
                        <span>Last spec: Office Tower Q2 2024</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold border border-yellow-200">
                        Duplicate
                      </span>
                      <span className="text-xs text-gray-500">$24.50/m²</span>
                    </div>
                  </div>
                </div>
                
                {/* Available Material */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-coral transition-colors duration-200">
                        Mutina Puzzle Indoor Collection
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Ceramic wall tiles • Various sizes available</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>In stock</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>4-6 weeks delivery</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold border border-green-200">
                        Available
                      </span>
                      <span className="text-xs text-gray-500">$89.00/m²</span>
                    </div>
                  </div>
                </div>
                
                {/* Discontinued Material */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group opacity-75">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-coral transition-colors duration-200">
                        Artemide Architectural Profile Series
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Linear LED strip lighting • 2700K-4000K</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          <span>3 similar alternatives available</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold border border-red-200">
                        Discontinued
                      </span>
                      <span className="text-xs text-gray-400 line-through">$156.00/m</span>
                    </div>
                  </div>
                </div>

                {/* New Material */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-coral rounded-full"></div>
                        <span className="text-xs font-semibold text-coral uppercase tracking-wide">Recently Added</span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-coral transition-colors duration-200">
                        Interface Human Nature Carpet
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Modular carpet tiles • Carbon neutral</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Added 2 days ago</span>
                        <span>•</span>
                        <span>Sustainability focused</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold border border-blue-200">
                        New
                      </span>
                      <span className="text-xs text-gray-500">$42.00/m²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Footer */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Showing 4 of 127 results</span>
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
            
            {/* Enhanced floating elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-coral/20 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-blue-400/10 rounded-full flex items-center justify-center" style={{ animationDelay: '1s' }}>
              <div className="w-4 h-4 bg-blue-400/20 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-indigo-400/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Mobile Alternative - keep existing mobile code */}
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
