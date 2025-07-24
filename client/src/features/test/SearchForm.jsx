import React, { useState, useMemo, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowLeftRight,
  PlaneTakeoff,
  User,
  X,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { Button } from "../../components/Button";
import {
  DialogTravel,
  DialogContent,
  DialogTitle,
} from "../../components/dialog";
import flightjson from "../../data/flight_city.json";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFlights,
  selectFlightData,
  selectFlightStatus,
} from "./flightSlice";
import {
  addMonths,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";

// Loader Component
const SearchLoader = () => (
  <div className="flex justify-center items-center py-4">
    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
    <span className="ml-2 text-sm text-gray-500">Loading airports...</span>
  </div>
);

export default function SearchForm() {
  useDocumentTitle("Welcome to Holidayfly");
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(null);
  const [travelers, setTravelers] = useState("1 Adult, Economy");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectorModalOpen, setIsModalSector] = useState(false);
  const [modalType, setModalType] = useState("");
  const [routeType, setRouteType] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedClass, setSelectedClass] = useState("Economy/Premium Economy");
  const [fromSearchText, setFromSearchText] = useState("");
  const [toSearchText, setToSearchText] = useState("");
  const [isFromField, setIsFromField] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const flightData = useSelector(selectFlightData);
  const flightStatus = useSelector(selectFlightStatus);
  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value, isFrom) => {
      if (isFrom) {
        setFromSearchText(value);
      } else {
        setToSearchText(value);
      }
      setIsLoading(false);
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    setIsLoading(true);
    debouncedSearch(e.target.value, isFromField);
  };

  // Optimize filtered suggestions with useMemo
  const filteredSuggestions = useMemo(() => {
    const searchText = isFromField ? fromSearchText : toSearchText;
    if (!searchText) {
      return flightjson
        .filter((city) => city.CountryCode === "IN")
        .slice(0, 10);
    }
    return flightjson
      .filter((city) =>
        `${city.cn} ${city.AirportName} ${city.AirportCode}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      )
      .slice(0, 20);
  }, [fromSearchText, toSearchText, isFromField]);

  const handleIncrement = (type) => {
    if (type === "adults") setAdults(adults + 1);
    if (type === "children") setChildren(children + 1);
    if (type === "infants") setInfants(infants + 1);
    updateTravelersText(
      adults + (type === "adults" ? 1 : 0),
      children + (type === "children" ? 1 : 0),
      infants + (type === "infants" ? 1 : 0)
    );
  };

  const handleDecrement = (type) => {
    if (type === "adults" && adults > 1) setAdults(adults - 1);
    if (type === "children" && children > 0) setChildren(children - 1);
    if (type === "infants" && infants > 0) setInfants(infants - 1);
    updateTravelersText(
      type === "adults" && adults > 1 ? adults - 1 : adults,
      type === "children" && children > 0 ? children - 1 : children,
      type === "infants" && infants > 0 ? infants - 1 : infants
    );
  };

  const updateTravelersText = (adults, children, infants) => {
    const travelerText = `${adults} Adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}${infants > 0 ? `, ${infants} Infant${infants > 1 ? "s" : ""}` : ""}, ${selectedClass}`;
    setTravelers(travelerText);
  };

  const renderCalendar = () => {
    const months = Array.from({ length: 4 }, (_, i) =>
      addMonths(new Date(), i)
    );
    return (
      <div className="flex flex-col gap-4 overflow-y-auto h-full">
        {months.map((month, idx) => {
          const days = eachDayOfInterval({
            start: startOfMonth(month),
            end: endOfMonth(month),
          });
          const firstDayIndex = getDay(startOfMonth(month));
          return (
            <div key={idx} className="border-b pb-4">
              <h3 className="text-lg font-semibold text-center mb-2">
                {format(month, "MMMM yyyy")}
              </h3>
              <div className="grid grid-cols-7 gap-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div key={day} className="font-semibold text-gray-500">
                      {day}
                    </div>
                  )
                )}
                {Array(firstDayIndex)
                  .fill(null)
                  .map((_, index) => (
                    <div key={`empty-${index}`} className="p-2"></div>
                  ))}
                {days.map((day, index) => {
                  const isSelected =
                    isSameDay(day, departureDate) ||
                    (routeType === 2 && isSameDay(day, returnDate));
                  const isInRange =
                    routeType === 2 &&
                    departureDate &&
                    returnDate &&
                    isWithinInterval(day, {
                      start: departureDate,
                      end: returnDate,
                    });
                  const isDisabled =
                    isBefore(day, new Date()) ||
                    (routeType === 2 &&
                      departureDate &&
                      !returnDate &&
                      isBefore(day, departureDate));
                  return (
                    <div
                      key={index}
                      className={`p-2 rounded-full cursor-pointer ${isSelected ? "bg-black text-white" : isInRange ? "bg-gray-300" : "hover:bg-gray-200"} ${isDisabled ? "text-gray-300 cursor-not-allowed" : ""}`}
                      onClick={() => !isDisabled && handleDateClick(day)}
                    >
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleDateClick = (date) => {
    if (isBefore(date, new Date())) return;
    if (routeType === 1) {
      setDepartureDate(date);
      setIsOpen(false);
    } else {
      if (!departureDate || returnDate) {
        setDepartureDate(date);
        setReturnDate(null);
      } else if (!returnDate && !isBefore(date, departureDate)) {
        setReturnDate(date);
      }
    }
  };

  const routeTypeClick = (TripType, ids) => {
    setRouteType(ids);
    setTripType(TripType);
    setIsOpen(true);
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
    console.log(`Swapped locations: From ${to} to ${from}`);
  };

  const openModal = (type, isFrom = true) => {
    setModalType(type);
    if (type === "sector") {
      setIsModalSector(true);
      setIsFromField(isFrom);
      // Reset search text based on field
      if (isFrom) {
        setFromSearchText("");
      } else {
        setToSearchText("");
      }
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCitySelect = (city) => {
    const cityText = `${city.cn} (${city.AirportCode})`;
    if (isFromField) {
      if (cityText === to) {
        alert("Origin and destination cannot be the same.");
        return;
      }
      setFrom(cityText);
      console.log(`From city changed to: ${cityText}`);
    } else {
      if (cityText === from) {
        alert("Origin and destination cannot be the same.");
        return;
      }
      setTo(cityText);
      console.log(`To city changed to: ${cityText}`);
    }
    setIsModalSector(false);
    setFromSearchText("");
    setToSearchText("");
  };

  // Build a Map once for faster lookup
  const airportMap = useMemo(() => {
    const map = new Map();
    flightjson.forEach((city) => map.set(city.AirportCode, city));
    return map;
  }, []);

  const handleSearchFlights = async (e) => {
    e.preventDefault();

    if (!from || !to || !departureDate) {
      alert("Please select From, To and Departure Date.");
      return;
    }

    const extractCode = (text) => {
      const match = /\(([^)]+)\)/.exec(text);
      return match ? match[1] : null;
    };

    const fromCode = extractCode(from);
    const toCode = extractCode(to);

    if (!fromCode || !toCode) {
      alert("Invalid airport codes.");
      return;
    }

    const fromCity = airportMap.get(fromCode);
    const toCity = airportMap.get(toCode);

    if (!fromCity || !toCity) {
      alert("City not found in dataset.");
      return;
    }

    const interNationalSearch =
      fromCity.CountryCode === "IN" && toCity.CountryCode === "IN" ? "0" : "1";

    const payload = {
      interNationalSearch: interNationalSearch,
      JourneyType: routeType.toString(),
      TPSystemID: 159,
      FareTypes: "REGULAR",
      APIData: {
        searchQuery: {
          cabinClass: selectedClass.toUpperCase().includes("ECONOMY")
            ? "ECONOMY"
            : "BUSINESS",
          paxInfo: {
            ADULT: adults.toString(),
            CHILD: children.toString(),
            INFANT: infants.toString(),
          },
          routeInfos: [
            {
              fromCityOrAirport: { code: fromCode },
              toCityOrAirport: { code: toCode },
              travelDate: format(departureDate, "yyyy-MM-dd"),
            },
            ...(routeType === 2 && returnDate
              ? [
                  {
                    fromCityOrAirport: { code: toCode },
                    toCityOrAirport: { code: fromCode },
                    travelDate: format(returnDate, "yyyy-MM-dd"),
                  },
                ]
              : []),
          ],
          searchModifiers: {
            pft: "REGULAR",
            isDirectFlight: true,
            isConnectingFlight: true,
          },
        },
      },
    };

    try {
      setIsSearching(true);
      await dispatch(fetchFlights(payload)).unwrap();
      navigate("/flight/roundsearch");
    } catch (err) {
      console.error("Flight search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearchFlights}>
      <div className="bg-gray-100 flex justify-center items-center py-6">
        <div className="bg-blue-50 px-2 py-6 flex justify-center">
          <div className="bg-white w-full max-w-7xl rounded-xl shadow-lg px-4 py-6">
            {/* Trip Type Tabs */}
            <div className="flex items-center justify-start space-x-3 mb-6 flex-wrap">
              {[
                { label: "One Way", icon: "🛫", value: "oneway", id: 1 },
                { label: "Round Trip", icon: "🔁", value: "roundtrip", id: 2 },
                // { label: "Multi City", icon: "🧭", value: "multicity", id: 3 }
              ].map(({ label, icon, value, id }) => (
                <button
                  key={value}
                  onClick={() => routeTypeClick(value, id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-150 text-sm font-semibold 
            ${
              tripType === value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-100"
            }`}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
              {/* <div className="ml-auto flex items-center gap-2">
        <input type="checkbox" id="direct" className="accent-blue-600" />
        <label htmlFor="direct" className="text-sm text-gray-700 font-medium">
          Direct Flights Only
        </label>
      </div> */}
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* From */}
              <div
                onClick={() => openModal("sector", true)}
                className="cursor-pointer"
              >
                <label className="text-sm text-gray-600 font-medium">
                  Departing From
                </label>
                <div className="mt-1 border rounded-lg p-3 flex items-center gap-2 hover:shadow-sm">
                  <span className="text-lg">📍</span>
                  <span className="text-gray-800 text-sm">
                    {from || "Source City"}
                  </span>
                </div>
              </div>

              {/* To */}
              <div
                onClick={() => openModal("sector", false)}
                className="cursor-pointer"
              >
                <label className="text-sm text-gray-600 font-medium">
                  Going To
                </label>
                <div className="mt-1 border rounded-lg p-3 flex items-center gap-2 hover:shadow-sm">
                  <span className="text-lg">📍</span>
                  <span className="text-gray-800 text-sm">
                    {to || "Destination City"}
                  </span>
                </div>
              </div>

              {/* Departure */}
              <div onClick={() => setIsOpen(true)} className="cursor-pointer">
                <label className="text-sm text-gray-600 font-medium">
                  Departure
                </label>
                <div className="mt-1 border rounded-lg p-3 flex items-center gap-2 hover:shadow-sm">
                  <span className="text-lg">✈️</span>
                  <span className="text-gray-800 text-sm">
                    {format(departureDate, "dd MMM yyyy")}
                  </span>
                </div>
              </div>

              {/* Return */}
              <div
                onClick={() => routeType === 2 && setIsOpen(true)}
                className={`cursor-pointer ${tripType === "roundtrip" ? "" : "opacity-50 pointer-events-none"}`}
              >
                <label className="text-sm text-gray-600 font-medium">
                  Return
                </label>
                <div className="mt-1 border rounded-lg p-3 flex items-center gap-2 hover:shadow-sm">
                  <span className="text-lg">✈️</span>
                  <span className="text-gray-800 text-sm">
                    {returnDate ? format(returnDate, "dd MMM yyyy") : "Return"}
                  </span>
                </div>
              </div>

              {/* Travellers */}
              <div
                onClick={() => openModal("travelers")}
                className="cursor-pointer"
              >
                <label className="text-sm text-gray-600 font-medium">
                  Travellers
                </label>
                <div className="mt-1 border rounded-lg p-3 flex items-center gap-2 hover:shadow-sm">
                  <span className="text-lg">🚶</span>
                  <span className="text-gray-800 text-sm">{travelers}</span>
                </div>
              </div>
            </div>

            {/* Fare Types */}
            <div className="flex flex-wrap gap-2 mt-6">
              {["Regular", "Student", "Senior Citizen"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600"
                >
                  <input
                    type="radio"
                    name="fareType"
                    className="accent-blue-600"
                  />{" "}
                  {type}
                </label>
              ))}
            </div>

            {/* Cabin Classes */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "Economy",
                "Premium economy",
                "Business class",
                "Premium Business",
                "First class",
              ].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border 
            ${
              selectedClass.includes(cls)
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
                  onClick={() => {
                    setSelectedClass(cls);
                    updateTravelersText(adults, children, infants);
                  }}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Search Button */}
            <div className="mt-6 text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow-md"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" />
                    Searching...
                  </div>
                ) : (
                  "Search Flights"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Travelers Modal */}
        <DialogTravel open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogContent className="rounded-t-2xl p-4 shadow-2xl z-[100]">
            <div className="flex justify-between items-center pb-4 border-b">
              <DialogTitle className="text-lg font-semibold">
                Select Traveller & Class
              </DialogTitle>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-500 text-sm font-semibold">
                  ADD NUMBER OF TRAVELLERS
                </h3>
                {[
                  {
                    label: "Adults",
                    age: "12 yrs & above",
                    count: adults,
                    type: "adults",
                  },
                  {
                    label: "Children",
                    age: "2 - 12 yrs",
                    count: children,
                    type: "children",
                  },
                  {
                    label: "Infants",
                    age: "Under 2 yrs",
                    count: infants,
                    type: "infants",
                  },
                ].map(({ label, age, count, type }) => (
                  <div
                    key={type}
                    className="flex justify-between items-center py-2"
                  >
                    <div>
                      <p className="font-semibold">{label}</p>
                      <p className="text-xs text-gray-500">
                        {age} on the day of travel
                      </p>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDecrement(type)}
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="mx-3 font-medium">{count}</span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleIncrement(type)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  "Economy/Premium Economy",
                  "Premium Economy",
                  "Business",
                  "First Class",
                ].map((cabin) => (
                  <Button
                    type="button"
                    key={cabin}
                    className="text-xs p-2 shadow-sm w-full"
                    variant={selectedClass === cabin ? "default" : "outline"}
                    onClick={() => {
                      setSelectedClass(cabin);
                      updateTravelersText(adults, children, infants);
                    }}
                  >
                    {cabin}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              className="w-full bg-blue-600 mt-4 text-white"
              onClick={() => setIsModalOpen(false)}
            >
              DONE
            </Button>
          </DialogContent>
        </DialogTravel>

        {/* Date Selection Modal */}
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="w-full h-full bg-white p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Select Departure Date</h2>
              <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <div className="flex-1 flex flex-col p-4 overflow-y-auto">
              {renderCalendar()}
            </div>
            <Button
              type="button"
              className="bg-blue-600 text-white"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </Dialog>

        {/* Airport Selection Modal */}
        <Dialog
          open={isSectorModalOpen}
          onClose={() => setIsModalSector(false)}
          className="fixed inset-0 flex items-end justify-center z-50"
        >
          <div className="bg-white w-full max-w-md h-[90%] rounded-t-2xl shadow-lg p-4 flex flex-col">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">
                {isFromField ? "Travelling From?" : "Travelling To?"}
              </h2>
              <button onClick={() => setIsModalSector(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 border rounded-lg p-3 flex items-center gap-3">
              <PlaneTakeoff className="text-blue-600" />
              <input
                type="text"
                value={isFromField ? fromSearchText : toSearchText}
                onChange={handleSearchChange}
                placeholder={
                  isFromField
                    ? "Enter Origin City/Airport"
                    : "Enter Destination City/Airport"
                }
                className="w-full text-gray-500 outline-none placeholder-gray-400"
              />
            </div>
            <div className="mt-4 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                POPULAR SEARCHES
              </h3>
              {isLoading ? (
                <SearchLoader />
              ) : (
                <div className="space-y-1 overflow-y-auto pr-1">
                  {filteredSuggestions.map((city) => (
                    <button
                      key={city.AirportCode}
                      onClick={() => handleCitySelect(city)}
                      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-start">
                        <p className="font-medium text-sm text-black">
                          {city.cn}, {city.CountryCode}
                        </p>
                        <p className="text-xs text-gray-500">
                          {city.AirportName}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium">
                        {city.AirportCode}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog>
      </div>
    </form>
  );
}
