import { useState } from 'react';
import { initialCamps } from '/src/components/CampList.jsx'; 
// import camps from '/src/data/camps.json';
import { interestOptions, scheduleOptions, locationAreas } from '/src/components/FilterPanel.jsx'; 
import { getAreaForLocation } from '/src/components/CampMap.jsx'; // Assuming you have a utility function to get area based on lat/lng
import '/src/styles/App.css';


export default function SummerCampFinder() {
  const [camps, setCamps] = useState(initialCamps);
  const [hoveredCamp, setHoveredCamp] = useState(null);
  const [filters, setFilters] = useState({
                                          ageRange: [5, 16],
                                          interests: [],
                                          schedule: "all",
                                          maxFee: 500,
                                          location: "all",
                                        });

  // Add area property to each camp
  const campsWithArea = camps.map(camp => ({
    ...camp,
    area: getAreaForLocation(camp.location.lat, camp.location.lng)
  }));

  // Apply filters to camps
  const filteredCamps = campsWithArea.filter(camp => {
    // Age filter - check if camp's age range overlaps with filter age range
    const ageMatch = 
      (camp.minAge <= filters.ageRange[1] && camp.maxAge >= filters.ageRange[0]);
    
    // Interest filter
    const interestMatch = 
      filters.interests.length === 0 || 
      filters.interests.some(interest => camp.interests.includes(interest));
    
    // Schedule filter
    const scheduleMatch = 
      filters.schedule === "all" || 
      camp.schedule === filters.schedule;
    
    // Fee filter
    const feeMatch = camp.fee <= filters.maxFee;
    
    // Location filter
    const locationMatch = 
      filters.location === "all" || 
      camp.area === filters.location;
    
    return ageMatch && interestMatch && scheduleMatch && feeMatch && locationMatch;
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "ageMin" || name === "ageMax") {
      const ageIndex = name === "ageMin" ? 0 : 1;
      const newAgeRange = [...filters.ageRange];
      newAgeRange[ageIndex] = parseInt(value);
      
      setFilters(prev => ({
        ...prev,
        ageRange: newAgeRange
      }));
    } else if (type === "checkbox") {
      if (checked) {
        setFilters(prev => ({
          ...prev,
          interests: [...prev.interests, value]
        }));
      } else {
        setFilters(prev => ({
          ...prev,
          interests: prev.interests.filter(interest => interest !== value)
        }));
      }
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white">
      <img src="/src/assets/logo_wide.jpg" alt="CampSmart Logo" className="logo_top" />
      {/* <h1 className="header">CampSmart</h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filter Panel */}
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Filter Camps</h2>
          
          {/* Age Range Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Age Range</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="ageMin"
                min="5"
                max="16"
                value={filters.ageRange[0]}
                onChange={handleFilterChange}
                className="w-20 p-2 border border-gray-300 rounded"
              />
              <span>to</span>
              <input
                type="number"
                name="ageMax"
                min="5"
                max="16"
                value={filters.ageRange[1]}
                onChange={handleFilterChange}
                className="w-20 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          {/* Interests Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Interests</h3>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map(interest => (
                <div key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    id={interest}
                    name="interests"
                    value={interest}
                    checked={filters.interests.includes(interest)}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <label htmlFor={interest} className="text-sm capitalize">
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Schedule Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Schedule</h3>
            <select
              name="schedule"
              value={filters.schedule}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">All Schedules</option>
              {scheduleOptions.map(option => (
                <option key={option} value={option}>
                  {option === "full-day" ? "Full Day" : "Half Day"}
                </option>
              ))}
            </select>
          </div>
          
          {/* Fee Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              Maximum Fee: ${filters.maxFee}
            </h3>
            <input
              type="range"
              name="maxFee"
              min="200"
              max="500"
              step="25"
              value={filters.maxFee}
              onChange={handleFilterChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>$200</span>
              <span>$500</span>
            </div>
          </div>
          
          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="all">All Locations</option>
              {locationAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 p-3 bg-indigo-50 rounded-md">
            <p className="text-indigo-700 font-medium">
              Found {filteredCamps.length} camps matching your criteria
            </p>
          </div>
        </div>
        
        {/* Map and Results Panel */}
        <div className="md:col-span-2">
          {/* Interactive Map (Simplified for this demo) */}
          <div className="bg-blue-50 p-2 rounded-lg shadow mb-6 h-96 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-100 rounded-lg">
              {/* Simple representation of a map */}
              <div className="h-full w-full relative overflow-hidden">
                {/* Map background with grid */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                  {Array(64).fill().map((_, i) => (
                    <div key={i} className="border border-blue-200"></div>
                  ))}
                </div>
                
                {/* Map markers for camps */}
                {filteredCamps.map(camp => (
                  <div 
                    key={camp.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${
                      hoveredCamp === camp.id ? 'bg-red-500 ring-4 ring-red-200' : 'bg-red-500'
                    }`}
                    style={{
                      left: `${((camp.location.lng + 122.5) / 0.2) * 100}%`,
                      top: `${(-(camp.location.lat - 37.85) / 0.15) * 100}%`,
                    }}
                    onMouseEnter={() => setHoveredCamp(camp.id)}
                    onMouseLeave={() => setHoveredCamp(null)}
                  ></div>
                ))}
                
                {/* Hover information box */}
                {hoveredCamp && (
                  <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-10 w-64">
                    {(() => {
                      const camp = filteredCamps.find(c => c.id === hoveredCamp);
                      return camp ? (
                        <>
                          <h3 className="font-bold text-indigo-700">{camp.name}</h3>
                          <p className="text-sm">{camp.address}</p>
                          <p className="text-sm">{camp.phone}</p>
                          <p className="text-sm text-blue-600">{camp.website}</p>
                          <div className="mt-1 text-xs text-gray-500">
                            Ages {camp.minAge}-{camp.maxAge} • ${camp.fee}/week
                          </div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
                
                {/* Map labels */}
                <div className="absolute top-2 left-2 bg-white/70 px-2 py-1 rounded text-xs">
                  San Francisco Area
                </div>
              </div>
            </div>
          </div>
          
          {/* Camp List */}
          <div className="bg-gray-50 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">Available Camps</h2>
            
            {filteredCamps.length > 0 ? (
              <div className="space-y-4">
                {filteredCamps.map(camp => (
                  <div 
                    key={camp.id} 
                    className={`p-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 ${
                      hoveredCamp === camp.id ? 'border-indigo-500' : 'border-indigo-200'
                    }`}
                    onMouseEnter={() => setHoveredCamp(camp.id)}
                    onMouseLeave={() => setHoveredCamp(null)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{camp.name}</h3>
                        <p className="text-sm text-gray-600">{camp.address}</p>
                      </div>
                      <div className="text-right">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          ${camp.fee}/week
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {camp.interests.map(interest => (
                        <span key={interest} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded capitalize">
                          {interest}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Ages:</span> {camp.minAge}-{camp.maxAge} • 
                      <span className="font-medium"> Schedule:</span> {camp.schedule === "full-day" ? "Full Day" : "Half Day"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                No camps match your current filter criteria. Try adjusting your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 