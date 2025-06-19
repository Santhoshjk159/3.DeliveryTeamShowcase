import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Star,
  Bell,
  X,
  Save,
  Target,
  Grid3X3,
  CalendarDays,
  Zap,
  Eye,
  EyeOff,
  Check,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const EventCalendar = ({ onBack }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Sprint Planning",
      date: new Date(2025, 5, 12),
      time: "10:00 AM",
      location: "Room A",
      priority: "high",
      status: "confirmed",
      category: "meeting",
      description: "Q3 sprint planning session",
      isDeadline: false,
      isCompleted: false
    },
    {
      id: 2,
      title: "Client Presentation",
      date: new Date(2025, 5, 15),
      time: "2:00 PM",
      location: "Virtual",
      priority: "high",
      status: "confirmed",
      category: "presentation",
      description: "Quarterly review presentation",
      isDeadline: false,
      isCompleted: true
    },
    {
      id: 3,
      title: "Project Delivery",
      date: new Date(2025, 5, 20),
      deadlineDate: new Date(2025, 5, 20),
      time: "End of Day",
      location: "Internal",
      priority: "high",
      status: "pending",
      category: "deadline",
      description: "Final project deliverables due",
      isDeadline: true,
      isCompleted: false
    },
    {
      id: 4,
      title: "Code Review Deadline",
      date: new Date(2025, 6, 10),
      deadlineDate: new Date(2025, 6, 10),
      time: "5:00 PM",
      location: "Development",
      priority: "high",
      status: "pending",
      category: "deadline",
      description: "All code must be reviewed",
      isDeadline: true,
      isCompleted: false
    },
    {
      id: 5,
      title: "Team Sync",
      date: new Date(2025, 6, 5),
      time: "9:00 AM",
      location: "Room B",
      priority: "medium",
      status: "confirmed",
      category: "meeting",
      description: "Weekly team synchronization",
      isDeadline: false,
      isCompleted: true
    },
    {
      id: 6,
      title: "UI Design Review",
      date: new Date(2025, 4, 15),
      time: "3:00 PM",
      location: "Conference Room",
      priority: "medium",
      status: "confirmed",
      category: "review",
      description: "Review new UI designs",
      isDeadline: false,
      isCompleted: true
    }
  ]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    deadlineDate: new Date(),
    time: '',
    location: '',
    priority: 'medium',
    category: 'meeting',
    description: '',
    isDeadline: false,
    isCompleted: false
  });

  const categories = [
    { value: 'meeting', label: 'Meeting', color: 'bg-blue-500', textColor: 'text-blue-700' },
    { value: 'presentation', label: 'Presentation', color: 'bg-purple-500', textColor: 'text-purple-700' },
    { value: 'training', label: 'Training', color: 'bg-green-500', textColor: 'text-green-700' },
    { value: 'review', label: 'Review', color: 'bg-indigo-500', textColor: 'text-indigo-700' },
    { value: 'deadline', label: 'Deadline', color: 'bg-red-500', textColor: 'text-red-700' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return filteredEvents.filter(event =>
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventsForMonth = (year, month) => {
    return filteredEvents.filter(event =>
      event.date.getFullYear() === year &&
      event.date.getMonth() === month
    );
  };

  const getTotalEventsForPeriod = () => {
    if (viewMode === 'month') {
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      return filteredEvents.filter(event =>
        event.date.getMonth() === currentMonth &&
        event.date.getFullYear() === currentYear
      ).length;
    } else {
      const currentYear = currentDate.getFullYear();
      return filteredEvents.filter(event =>
        event.date.getFullYear() === currentYear
      ).length;
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return filteredEvents
      .filter(event => event.date >= today && !event.isCompleted)
      .sort((a, b) => a.date - b.date)
      .slice(0, 3);
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return events
      .filter(event => event.isDeadline && event.deadlineDate >= today && !event.isCompleted)
      .sort((a, b) => a.deadlineDate - b.deadlineDate)
      .slice(0, 3);
  };

  const getCompletedEvents = () => {
    return events
      .filter(event => event.isCompleted)
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);
  };

  const handleAddEvent = () => {
    const event = {
      ...newEvent,
      id: Date.now(),
      status: 'confirmed',
      category: newEvent.isDeadline ? 'deadline' : newEvent.category
    };
    setEvents([...events, event]);
    resetForm();
  };

  const handleViewEvent = (event) => {
    setViewingEvent(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({ ...event, deadlineDate: event.deadlineDate || event.date });
    setShowEventModal(true);
  };

  const handleUpdateEvent = () => {
    const updatedEvent = {
      ...newEvent,
      id: editingEvent.id,
      category: newEvent.isDeadline ? 'deadline' : newEvent.category
    };
    setEvents(events.map(event =>
      event.id === editingEvent.id ? updatedEvent : event
    ));
    resetForm();
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
    }
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const toggleEventCompletion = (eventId) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, isCompleted: !event.isCompleted } : event
    ));
  };

  const resetForm = () => {
    setEditingEvent(null);
    setViewingEvent(null);
    setNewEvent({
      title: '',
      date: new Date(),
      deadlineDate: new Date(),
      time: '',
      location: '',
      priority: 'medium',
      category: 'meeting',
      description: '',
      isDeadline: false,
      isCompleted: false
    });
    setShowEventModal(false);
    setShowViewModal(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const fullMonthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderYearView = () => {
    const currentYear = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
        <div className="bg-blue-900 text-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateYear(-1)}
                className="p-1 hover:bg-blue-800 transition-colors rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black">{currentYear}</h2>
              <button
                onClick={() => navigateYear(1)}
                className="p-1 hover:bg-blue-800 transition-colors rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-medium opacity-80">
              {events.filter(e => e.date.getFullYear() === currentYear).length} events
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="grid grid-cols-3 gap-4 h-full">
            {months.map(month => {
              const monthEvents = getEventsForMonth(currentYear, month);
              const hasDeadlines = monthEvents.some(e => e.isDeadline);
              const hasHighPriority = monthEvents.some(e => e.priority === 'high');

              return (
                <div
                  key={month}
                  onClick={() => {
                    setCurrentDate(new Date(currentYear, month, 1));
                    setViewMode('month');
                  }}
                  className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 p-3 cursor-pointer transition-all duration-200 rounded group flex flex-col"
                >
                  <div className="text-center mb-3">
                    <h4 className="font-black text-gray-900 group-hover:text-blue-900 text-sm">
                      {monthNames[month]}
                    </h4>
                    <div className="flex justify-center space-x-1 mt-1">
                      {monthEvents.length > 0 && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {hasDeadlines && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {hasHighPriority && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="text-center mb-2">
                      <span className="text-xs font-bold text-gray-600">
                        {monthEvents.length} events
                      </span>
                    </div>

                    <div className="space-y-1 flex-1">
                      {monthEvents.slice(0, 4).map(event => {
                        const category = categories.find(c => c.value === event.category);
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewEvent(event);
                            }}
                            className={`text-xs px-2 py-1 ${category.color} text-white font-medium truncate rounded text-center hover:opacity-80 transition-opacity cursor-pointer`}
                            title={`${event.title} - ${event.time} - Click to view`}
                          >
                            {event.isDeadline && <Target className="w-2 h-2 inline mr-1" />}
                            {event.title.length > 12 ? event.title.substring(0, 10) + '..' : event.title}
                          </div>
                        );
                      })}
                      {monthEvents.length > 4 && (
                        <div className="text-xs text-gray-500 font-medium text-center">
                          +{monthEvents.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
        <div className="bg-blue-900 text-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-blue-800 transition-colors rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black">
                {fullMonthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-blue-800 transition-colors rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs font-medium opacity-80">
              {getTotalEventsForPeriod()} events
            </div>
          </div>
        </div>

        <div className="p-3 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center text-xs font-black text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 flex-1">
              {getDaysInMonth(currentDate).map((date, index) => {
                if (!date) {
                  return <div key={index} className="p-1 min-h-[80px] flex-1"></div>;
                }

                const dayEvents = getEventsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`p-1 min-h-[80px] flex-1 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-blue-50 rounded flex flex-col ${isToday ? 'bg-blue-100 border-blue-300 ring-1 ring-blue-400' : ''
                      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-900' : 'text-gray-700'
                      }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1 flex-1">
                      {dayEvents.slice(0, 3).map(event => {
                        const category = categories.find(c => c.value === event.category);
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewEvent(event);
                            }}
                            className={`text-xs px-1 py-0.5 ${category.color} ${event.isCompleted ? 'opacity-60' : ''
                              } text-white font-medium truncate rounded flex items-center cursor-pointer hover:opacity-80 transition-opacity`}
                            title={`${event.title} - ${event.time} - Click to view`}
                          >
                            {event.isDeadline && <Target className="w-2 h-2 mr-1 flex-shrink-0" />}
                            {event.isCompleted && <Check className="w-2 h-2 mr-1 flex-shrink-0" />}
                            <span className="truncate">
                              {event.title.length > 8 ? event.title.substring(0, 8) + '..' : event.title}
                            </span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 font-medium px-1">
                          +{dayEvents.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-montserrat">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-blue-900 transition-colors font-semibold text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <div className="h-5 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-blue-900 flex items-center justify-center rounded">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-black text-gray-900">Team Calendar</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex bg-gray-200 rounded-full p-1">
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 flex items-center space-x-2 ${viewMode === 'month'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>Month</span>
                </button>
                <button
                  onClick={() => setViewMode('year')}
                  className={`px-4 py-2 text-sm font-bold rounded-full transition-all duration-300 flex items-center space-x-2 ${viewMode === 'year'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Year</span>
                </button>
              </div>

              {/* Add Event Button */}
              <button
                onClick={() => setShowEventModal(true)}
                className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Add Event</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-900 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  {viewMode === 'month' ? 'Month Events' : 'Year Events'}
                </p>
                <p className="text-lg font-black text-gray-900">{getTotalEventsForPeriod()}</p>
                <p className="text-xs text-blue-600 font-medium">
                  {viewMode === 'month'
                    ? `${fullMonthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                    : currentDate.getFullYear()
                  }
                </p>
              </div>
              <Calendar className="w-6 h-6 text-blue-900" />
            </div>
          </div>

          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Confirmed</p>
                <p className="text-lg font-black text-gray-900">
                  {filteredEvents.filter(e => e.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-red-500 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Deadlines</p>
                <p className="text-lg font-black text-gray-900">
                  {events.filter(e => e.isDeadline && !e.isCompleted).length}
                </p>
              </div>
              <Target className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-yellow-500 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">High Priority</p>
                <p className="text-lg font-black text-gray-900">
                  {filteredEvents.filter(e => e.priority === 'high' && !e.isCompleted).length}
                </p>
              </div>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-3 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500 rounded">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Completed</p>
                <p className="text-lg font-black text-gray-900">
                  {events.filter(e => e.isCompleted).length}
                </p>
              </div>
              <Check className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            {viewMode === 'month' ? renderMonthView() : renderYearView()}
          </div>

          {/* Enhanced Sidebar - Reordered */}
          <div className="space-y-3">
            {/* 1. Deadlines - First Priority */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black flex items-center">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
                      <Target className="w-3 h-3" />
                    </div>
                    Critical Deadlines
                  </h3>
                  <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {getUpcomingDeadlines().length}
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
                {getUpcomingDeadlines().length === 0 ? (
                  <div className="text-center py-4">
                    <Target className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs font-medium">No deadlines</p>
                    <p className="text-gray-400 text-xs">All caught up! 🎉</p>
                  </div>
                ) : (
                  getUpcomingDeadlines().map(event => {
                    const daysUntil = Math.ceil((event.deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
                    const isUrgent = daysUntil <= 3;

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleViewEvent(event)}
                        className={`group relative overflow-hidden bg-gradient-to-r p-2.5 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm ${isUrgent
                          ? 'from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-2 border-red-300'
                          : 'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-2 border-orange-300'
                          }`}
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="font-bold text-gray-900 text-xs flex items-center group-hover:text-red-700 transition-colors flex-1 min-w-0">
                            <Target className="w-3 h-3 text-red-500 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{event.title}</span>
                          </h4>
                          <div className={`px-1.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ml-1 ${isUrgent ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                            }`}>
                            {daysUntil === 0 ? 'TODAY' : daysUntil === 1 ? 'TOM' : `${daysUntil}D`}
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="w-2.5 h-2.5 mr-1.5 text-red-600" />
                            <span className="font-bold">Due: {event.deadlineDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Upcoming Events */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black flex items-center">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
                      <Bell className="w-3 h-3" />
                    </div>
                    Upcoming Events
                  </h3>
                  <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {getUpcomingEvents().length}
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
                {getUpcomingEvents().length === 0 ? (
                  <div className="text-center py-4">
                    <Bell className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs font-medium">No upcoming events</p>
                  </div>
                ) : (
                  getUpcomingEvents().map((event, index) => {
                    const category = categories.find(c => c.value === event.category);
                    const priority = priorities.find(p => p.value === event.priority);
                    const daysUntil = Math.ceil((event.date - new Date()) / (1000 * 60 * 60 * 24));

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleViewEvent(event)}
                        className="group bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 p-2.5 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                            <div className={`w-2.5 h-2.5 ${category.color} rounded-full flex-shrink-0`}></div>
                            <h4 className="font-bold text-gray-900 text-xs truncate group-hover:text-blue-900 transition-colors">
                              {event.title}
                            </h4>
                          </div>
                          <div className="flex space-x-1">
                            <span className={`px-1.5 py-0.5 text-xs font-bold ${priority.color} ${priority.bgColor} rounded-full`}>
                              {priority.label.charAt(0)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-2.5 h-2.5 mr-1.5 text-blue-600" />
                            <span className="font-medium">{event.date.toLocaleDateString()}</span>
                            <span className="mx-1.5 text-gray-400">•</span>
                            <Clock className="w-2.5 h-2.5 mr-1 text-green-600" />
                            <span className="font-medium">{event.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 3. Completed Events */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black flex items-center">
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
                      <Check className="w-3 h-3" />
                    </div>
                    Completed
                  </h3>
                  <div className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                    {getCompletedEvents().length}
                  </div>
                </div>
              </div>
              <div className="p-2 space-y-2 max-h-48 overflow-y-auto">
                {getCompletedEvents().length === 0 ? (
                  <div className="text-center py-4">
                    <Check className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs font-medium">No completed events</p>
                  </div>
                ) : (
                  getCompletedEvents().map(event => {
                    const category = categories.find(c => c.value === event.category);

                    return (
                      <div
                        key={event.id}
                        onClick={() => handleViewEvent(event)}
                        className="group bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200 hover:border-green-300 p-2.5 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-1.5">
                          <h4 className="font-bold text-gray-700 text-xs flex items-center flex-1 min-w-0">
                            <Check className="w-3 h-3 text-green-600 mr-1.5 flex-shrink-0" />
                            <span className="truncate">{event.title}</span>
                          </h4>
                          <div className={`w-2.5 h-2.5 ${category.color} rounded-full flex-shrink-0`}></div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-2.5 h-2.5 mr-1.5 text-green-600" />
                            <span className="font-medium">{event.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Events List with Pagination */}
        <div className="mt-4 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black">All Events ({filteredEvents.length})</h3>
              <div className="flex items-center space-x-3">
                {/* Category Legend */}
                <div className="hidden md:flex space-x-2">
                  {categories.map(category => (
                    <div key={category.value} className="flex items-center text-xs">
                      <div className={`w-2 h-2 ${category.color} rounded mr-1`}></div>
                      <span className="text-blue-100">{category.label}</span>
                    </div>
                  ))}
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 transition-colors rounded-lg ${showFilters ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
                >
                  {showFilters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          {showFilters && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 border-b border-gray-200">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium shadow-sm"
                  />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium shadow-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Enhanced Events List */}
          <div className="divide-y divide-gray-100">
            {currentEvents.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold text-lg mb-2">No events found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or add a new event</p>
              </div>
            ) : (
              currentEvents.map(event => {
                const category = categories.find(c => c.value === event.category);
                const priority = priorities.find(p => p.value === event.priority);
                return (
                  <div key={event.id} className={`p-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200 group border-l-4 ${event.isCompleted ? 'border-green-400 bg-green-50/30' : 'border-blue-400'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 cursor-pointer" onClick={() => handleViewEvent(event)}>
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-4 h-4 ${category.color} rounded-full flex-shrink-0 ${event.isCompleted ? 'opacity-60' : ''}`}></div>
                          <h4 className={`text-base font-bold flex items-center group-hover:text-blue-900 transition-colors ${event.isCompleted ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                            {event.isDeadline && <Target className="w-4 h-4 text-red-500 mr-2" />}
                            {event.isCompleted && <Check className="w-4 h-4 text-green-600 mr-2" />}
                            {event.title}
                          </h4>
                          <span className={`px-3 py-1 text-xs font-bold ${priority.color} ${priority.bgColor} rounded-full`}>
                            {priority.label}
                          </span>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {event.status}
                          </span>
                          {event.isCompleted && (
                            <span className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <p className={`mb-3 font-medium text-sm line-clamp-2 ${event.isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                            {event.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="font-medium">{event.date.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2 text-green-600" />
                            <span className="font-medium">{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                            <span className="font-medium">{event.location}</span>
                          </div>
                          {event.isDeadline && (
                            <div className="flex items-center text-red-600">
                              <Target className="w-4 h-4 mr-2" />
                              <span className="font-bold">Due: {event.deadlineDate.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleEventCompletion(event.id)}
                          className={`p-2 transition-colors rounded-lg ${event.isCompleted ? 'text-orange-600 hover:bg-orange-100' : 'text-green-600 hover:bg-green-100'}`}
                          title={event.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                        >
                          {event.isCompleted ? <ArrowUp className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="p-2 text-blue-600 hover:bg-blue-100 transition-colors rounded-lg"
                          title="View Event"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-green-600 hover:bg-green-100 transition-colors rounded-lg"
                          title="Edit Event"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="p-2 text-red-600 hover:bg-red-100 transition-colors rounded-lg"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 font-medium">
                  Showing {indexOfFirstEvent + 1} to {Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${currentPage === pageNum
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* All existing modals remain the same */}
      {/* Event View Modal */}
      {showViewModal && viewingEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full shadow-2xl rounded-lg">
            <div className={`p-4 text-white ${categories.find(c => c.value === viewingEvent.category)?.color === 'bg-red-500' ? 'bg-red-600' :
              categories.find(c => c.value === viewingEvent.category)?.color === 'bg-blue-500' ? 'bg-blue-900' :
                categories.find(c => c.value === viewingEvent.category)?.color === 'bg-green-500' ? 'bg-green-600' :
                  categories.find(c => c.value === viewingEvent.category)?.color === 'bg-purple-500' ? 'bg-purple-600' :
                    'bg-indigo-600'
              } flex justify-between items-center`}>
              <div className="flex items-center space-x-3">
                {viewingEvent.isDeadline && <Target className="w-6 h-6" />}
                {viewingEvent.isCompleted && <Check className="w-6 h-6" />}
                <div>
                  <h2 className="text-xl font-black">{viewingEvent.title}</h2>
                  <p className="text-sm opacity-90">
                    {categories.find(c => c.value === viewingEvent.category)?.label}
                    {viewingEvent.isDeadline && ' - Deadline'}
                    {viewingEvent.isCompleted && ' - Completed'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 transition-all duration-200 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="font-semibold">{viewingEvent.date.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                    <div className="flex items-center text-gray-900">
                      <Clock className="w-5 h-5 mr-3 text-green-600" />
                      <span className="font-semibold">{viewingEvent.time}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                    <div className="flex items-center text-gray-900">
                      <MapPin className="w-5 h-5 mr-3 text-purple-600" />
                      <span className="font-semibold">{viewingEvent.location}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                    <div className="flex items-center">
                      <Star className={`w-5 h-5 mr-3 ${priorities.find(p => p.value === viewingEvent.priority)?.color
                        }`} />
                      <span className={`px-3 py-1 text-sm font-bold rounded-full ${priorities.find(p => p.value === viewingEvent.priority)?.bgColor
                        } ${priorities.find(p => p.value === viewingEvent.priority)?.color}`}>
                        {priorities.find(p => p.value === viewingEvent.priority)?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {viewingEvent.isDeadline && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <label className="block text-sm font-bold text-red-700 mb-2">Deadline Date</label>
                  <div className="flex items-center text-red-900">
                    <Target className="w-5 h-5 mr-3 text-red-600" />
                    <span className="font-bold">{viewingEvent.deadlineDate.toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full ${viewingEvent.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {viewingEvent.status === 'confirmed' ? <CheckCircle className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                    {viewingEvent.status.charAt(0).toUpperCase() + viewingEvent.status.slice(1)}
                  </span>
                </div>

                {viewingEvent.isCompleted && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Completion</label>
                    <span className="inline-flex items-center px-4 py-2 text-sm font-bold bg-purple-100 text-purple-800 rounded-full">
                      <Check className="w-4 h-4 mr-2" />
                      Completed
                    </span>
                  </div>
                )}
              </div>

              {viewingEvent.description && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium leading-relaxed">{viewingEvent.description}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditEvent(viewingEvent);
                }}
                className="bg-blue-900 text-white px-4 py-2 hover:bg-blue-800 transition-colors font-semibold rounded-lg flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Event
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full shadow-2xl rounded">
            <div className="bg-blue-900 text-white p-3 flex justify-between items-center">
              <h2 className="text-lg font-black">
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </h2>
              <button
                onClick={resetForm}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 transition-all duration-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  placeholder="Event title"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date.toISOString().split('T')[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
              </div>

              {newEvent.isDeadline && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newEvent.deadlineDate.toISOString().split('T')[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, deadlineDate: new Date(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  placeholder="Location"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                  <select
                    value={newEvent.priority}
                    onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    disabled={newEvent.isDeadline}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium disabled:bg-gray-100"
                  >
                    {categories.filter(c => c.value !== 'deadline').map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDeadline"
                  checked={newEvent.isDeadline}
                  onChange={(e) => setNewEvent({ ...newEvent, isDeadline: e.target.checked })}
                  className="w-4 h-4 text-red-600 border border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isDeadline" className="ml-2 text-sm font-semibold text-gray-700 flex items-center">
                  <Target className="w-4 h-4 mr-1 text-red-500" />
                  Mark as Deadline
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isCompleted"
                  checked={newEvent.isCompleted}
                  onChange={(e) => setNewEvent({ ...newEvent, isCompleted: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isCompleted" className="ml-2 text-sm font-semibold text-gray-700 flex items-center">
                  <Check className="w-4 h-4 mr-1 text-purple-500" />
                  Mark as Completed
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  placeholder="Event description"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
              <button
                onClick={resetForm}
                className="px-3 py-1.5 text-gray-700 hover:bg-gray-200 transition-colors font-semibold rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                className="bg-blue-900 text-white px-3 py-1.5 hover:bg-blue-800 transition-colors font-semibold rounded text-sm flex items-center"
              >
                <Save className="w-4 h-4 mr-1" />
                {editingEvent ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full shadow-2xl rounded-lg">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Event</h3>
              <p className="text-gray-600 mb-1">Are you sure you want to delete</p>
              <p className="font-bold text-gray-900 mb-6">"{eventToDelete.title}"?</p>
              <p className="text-sm text-gray-500">This action cannot be undone.</p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-200 transition-colors font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors font-semibold rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;