import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Users, BarChart3, Settings, Download,Eye,TrendingUp, ArrowRight, Menu, X, Target, Award, Briefcase, Play, Star, CheckCircle, ExternalLink, Calendar, User, FileText, Shield, Database, Code, ChevronLeft, ChevronRight, Monitor, Zap, Globe, PieChart, Mail, MessageSquare, File } from 'lucide-react';
import vdartlogo from './assets/vdartlogo.svg';
import Dashboard from './Dashboard';
import EventCalendar from './EventCalendar'
import ProcessFlow from './ProcessFlow';
//importing images
import * as rtImages from './assets/projects/RT Dashboard'
import * as slaImages from './assets/projects/SLA Dashboard'
import * as emailImages from './assets/projects/Email Generator'
import shoutoutimg from './assets/projects/Shoutout.png';
import sladashboard from './assets/projects/SLA Dashboard.png'
import emailgen from './assets/projects/emailgen.png'

const VDartDeliveryHomepage = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showEventCalendar, setShowEventCalendar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showBUModal, setShowBUModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hasStatsAnimated, setHasStatsAnimated] = useState(false);
  const [currentProject, setCurrentProject] = useState(0)
  const [currentReport, setCurrentReport] = useState(0);
  const [showProcessFlow, setShowProcessFlow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Trigger stats when scrolled past 600px (reduced from 800px)
      if (window.scrollY > 600 && !hasStatsAnimated) {
        setHasStatsAnimated(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(entry.target.dataset.animate));
          }
        });
      },
      { threshold: 0.1, rootMargin: '20px' } // Reduced rootMargin
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4500);
    const projectInterval = setInterval(() => {
      setCurrentProject(prev => (prev + 1) % projects.length);
    }, 5000);
    const reportInterval = setInterval(() => {
      setCurrentReport(prev => (prev + 1) % Math.ceil(8 / 3));
    }, 6000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      clearInterval(interval);
      clearInterval(projectInterval);
      clearInterval(reportInterval);
    };
  }, [hasStatsAnimated]);

  const services = [
    {
      icon: <Users className="w-5 h-5" />, // Reduced from w-6 h-6
      title: "Business Unit Engagement",
      subtitle: "Strategic Connector",
      description: "Acts as a strategic connector between business leaders and delivery teams—gathering expectations, implementing feedback, and enhancing team productivity.",
      gradient: "from-gray-700 to-slate-800",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-100",
      isClickable: true,
      modalType: 'bu'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />, // Reduced from w-6 h-6
      title: "Data Analysis",
      subtitle: "Insights & Intelligence",
      description: "Partners with Recruitment and Leadership to deliver accurate, actionable insights that enable data-driven decisions and performance tracking.",
      gradient: "from-gray-700 to-slate-800",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-100",
      isClickable: true,
      modalType: 'data'
    },
    {
      icon: <Settings className="w-5 h-5" />, // Reduced from w-6 h-6
      title: "Tools Management",
      subtitle: "Operational Excellence",
      description: "Monitors tool adoption, provides training, optimizes tool efficiency, and identifies new solutions—ensuring resources directly support team goals.",
      gradient: "from-gray-700 to-slate-800",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-100",
      isClickable: true,
      modalType: 'tools'
    }
  ];

  const stats = [
    { number: "98%", label: "SLA Compliance", icon: <Target className="w-4 h-4" /> }, // Reduced from w-5 h-5
    { number: "149+", label: "Employees Supported", icon: <Users className="w-4 h-4" /> },
    { number: "7+", label: "Business Tools Managed", icon: <Settings className="w-4 h-4" /> },
    { number: "10%", label: "Efficiency Increase", icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const features = [
    { title: "OPERATIONAL EXCELLENCE", subtitle: "Streamlined processes driving success", icon: <Target className="w-6 h-6" /> }, // Reduced from w-8 h-8
    { title: "EMPLOYEE SUCCESS", subtitle: "Empowering teams to achieve more", icon: <Users className="w-6 h-6" /> },
    { title: "PERFORMANCE OPTIMIZATION", subtitle: "Data-driven continuous improvement", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const projects = [
    {
      id: 1,
      title: "Recruitment Tools Dashboard",
      description: "Comprehensive dashboard providing real-time insights into recruitment tools performance, usage analytics, and optimization opportunities.",
      category: "Dashboard Development",
      gallery: [
        rtImages.image1,    // Image 1
        rtImages.image2,    // Image 2
        rtImages.image3,    // Image 3
        rtImages.image4     // Image 4
      ],
      link: "#recruitment-dashboard",
      downloadLink: "#download-1",
      githubLink: "#github-1",
      documentationLink: "#docs-1",
      metrics: { improvement: "35%", timeline: "2 months", impact: "High" },
      status: "active",
      tech: ["React", "Node.js", "MongoDB"]
    },
    {
      id: 2,
      title: "SLA Dashboard",
      description: "Advanced SLA monitoring and tracking system with automated alerts and comprehensive reporting capabilities.",
      category: "Performance Monitoring",
      image: slaImages.image1,
      gallery: [
        slaImages.image1,    // Image 1
        slaImages.image2,    // Image 2
        slaImages.image3,    // Image 3
        slaImages.image4     // Image 4
      ],
      link: "#sla-dashboard",
      downloadLink: "#download-2",
      githubLink: "#github-2",
      documentationLink: "#docs-2",
      metrics: { improvement: "50%", timeline: "3 months", impact: "Critical" },
      status: "active",
      tech: ["Vue.js", "Python", "PostgreSQL"]
    },
    {
      id: 3,
      title: "Shoutout System",
      description: "Employee recognition platform fostering positive workplace culture through peer-to-peer appreciation.",
      category: "Employee Engagement",
      image: shoutoutimg,
      gallery:[
        shoutoutimg.image1,
        shoutoutimg.image2
      ],
      link: "#shoutout-system",
      downloadLink: "#download-3",
      githubLink: "#github-3",
      documentationLink: "#docs-3",
      metrics: { improvement: "75%", timeline: "1 month", impact: "High" },
      status: "beta",
      tech: ["Angular", "Express", "MySQL"]
    },
    {
      id: 4,
      title: "Email Generator",
      description: "Automated email generation system with customizable templates for various recruitment scenarios.",
      category: "Communication Automation",
      image: emailgen,
      gallery: [
        emailImages.image1,    // Image 1
        emailImages.image2,    // Image 2
        emailImages.image3,    // Image 3
      ],
      link: "#email-generator",
      downloadLink: "#download-4",
      githubLink: "#github-4",
      documentationLink: "#docs-4",
      metrics: { improvement: "60%", timeline: "2 months", impact: "Medium" },
      status: "active",
      tech: ["React", "Django", "Redis"]
    }
  ];
  const ourChampions = [
    {
      name: "Sarah Johnson",
      designation: "Senior Data Analyst",
      department: "Analytics Division",
      photo: "https://images.unsplash.com/photo-1494790108755-2616c6d0ea3e?w=300&h=300&fit=crop&crop=face",
      description: "Expert in transforming complex data into actionable business insights. Sarah has delivered 15+ critical reports with 99.8% accuracy, driving strategic decision-making across multiple departments.",
      badge: "Data Excellence",
      color: "from-blue-600 to-blue-800",
      achievements: ["15+ Reports", "99.8% Accuracy", "3 Years"]
    },
    {
      name: "Michael Chen",
      designation: "Tools Operations Specialist",
      department: "Operations Team",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Innovation leader who optimized 12 recruitment tools, improving operational efficiency by 40%. Michael's technical expertise ensures seamless tool integration and user adoption.",
      badge: "Innovation Leader",
      color: "from-green-600 to-green-800",
      achievements: ["12 Tools", "40% Efficiency", "4 Years"]
    },
    {
      name: "Emily Rodriguez",
      designation: "Business Engagement Lead",
      department: "Strategy Division",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      description: "Strategic connector who successfully aligned 50+ stakeholder requirements. Emily bridges the gap between business vision and operational execution with exceptional communication skills.",
      badge: "Stakeholder Champion",
      color: "from-purple-600 to-purple-800",
      achievements: ["50+ Stakeholders", "100% Alignment", "5 Years"]
    },
    {
      name: "David Kim",
      designation: "Quality Assurance Manager",
      department: "Quality Control",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Quality guardian who maintained 98.5% SLA compliance across all projects. David's meticulous approach ensures exceptional service delivery and client satisfaction.",
      badge: "Quality Guardian",
      color: "from-red-600 to-red-800",
      achievements: ["98.5% SLA", "Zero Defects", "6 Years"]
    },
    {
      name: "Jessica Walsh",
      designation: "Process Optimization Expert",
      department: "Operations Excellence",
      photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
      description: "Efficiency expert who streamlined 20+ workflows, reducing processing time by 35%. Jessica's analytical mindset drives continuous improvement across all operations.",
      badge: "Efficiency Expert",
      color: "from-indigo-600 to-indigo-800",
      achievements: ["20+ Workflows", "35% Faster", "3 Years"]
    },
    {
      name: "Alex Thompson",
      designation: "Technical Development Lead",
      department: "Technology Team",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      description: "Tech innovator who led development of 8 major dashboard solutions. Alex combines technical excellence with user-centric design to create impactful digital experiences.",
      badge: "Tech Innovator",
      color: "from-cyan-600 to-cyan-800",
      achievements: ["8 Dashboards", "100% Uptime", "4 Years"]
    },
    {
      name: "Maria Santos",
      designation: "Client Success Manager",
      department: "Client Relations",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
      description: "Client champion who achieved 96% satisfaction across 40+ accounts. Maria's relationship-building expertise ensures long-term partnerships and exceptional service delivery.",
      badge: "Client Champion",
      color: "from-pink-600 to-pink-800",
      achievements: ["40+ Accounts", "96% Satisfaction", "5 Years"]
    },
    {
      name: "Robert Taylor",
      designation: "Performance Analytics Manager",
      department: "Analytics Division",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
      description: "Impact driver who identified $500K+ in cost savings through data insights. Robert's analytical expertise transforms raw data into strategic business value.",
      badge: "Impact Driver",
      color: "from-amber-600 to-amber-800",
      achievements: ["$500K Savings", "25+ Insights", "4 Years"]
    }
    ];
  const ourReports = [
    {
      title: "Weekly Performance Dashboard",
      description: "Comprehensive overview of team performance metrics, KPIs, and operational efficiency indicators.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-900",
      category: "Performance Analytics",
      frequency: "Weekly",
      lastUpdated: "June 2024",
      status: "live"
    },
    {
      title: "Monthly Business Review",
      description: "Executive-level insights including strategic metrics, trend analysis, and business impact assessment.",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-900",
      category: "Executive Reports",
      frequency: "Monthly",
      lastUpdated: "June 2024",
      status: "updated"
    },
    {
      title: "Tool Utilization Analysis",
      description: "In-depth analysis of tool adoption, usage patterns, and optimization opportunities across platforms.",
      icon: <Settings className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-900",
      category: "Tool Analytics",
      frequency: "Bi-weekly",
      lastUpdated: "June 2024",
      status: "live"
    },
    {
      title: "Recruitment Pipeline Insights",
      description: "Detailed analysis of recruitment funnel performance, conversion rates, and process bottlenecks.",
      icon: <Users className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-900",
      category: "Pipeline Analytics",
      frequency: "Weekly",
      lastUpdated: "June 2024",
      status: "live"
    },
    {
      title: "Quality Assurance Report",
      description: "Comprehensive quality metrics, audit results, and compliance tracking across all delivery functions.",
      icon: <Shield className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-900",
      category: "Quality Control",
      frequency: "Monthly",
      lastUpdated: "June 2024",
      status: "updated"
    },
    {
      title: "Data Integrity Dashboard",
      description: "Real-time monitoring of data quality, accuracy metrics, and system reliability indicators.",
      icon: <Database className="w-6 h-6" />,
      color: "bg-gradient-to-br from-blue-600 to-blue-900",
      category: "Data Quality",
      frequency: "Real-time",
      lastUpdated: "Live",
      status: "live"
    }
  ]

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
  };


  const handleServiceClick = (modalType) => {
    switch (modalType) {
      case 'tools':
        setShowToolsModal(true);
        break;
      case 'data':
        setShowDataModal(true);
        break;
      case 'bu':
        setShowBUModal(true);
        break;
      default:
        break;
    }
  };
  const getPhotoLabel = (projectTitle, photoIndex) => {
    const labels = {
      'Recruitment Tools Dashboard': ['Dashboard', 'Analytics', 'Reports', 'Settings'],
      'SLA Dashboard': ['Overview', 'Metrics', 'Alerts', 'Details'],
      'Shoutout System': ['Feed', 'Create', 'Profile', 'Stats'],
      'Email Generator': ['Templates', 'Editor', 'Preview', 'Send']
    };
    return labels[projectTitle]?.[photoIndex] || 'Screenshot';
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }
  if (showEventCalendar) {
    return <EventCalendar onBack={() => setShowEventCalendar(false)} />;
  }
  if (showProcessFlow) {
    return <ProcessFlow onBack={() => setShowProcessFlow(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-montserrat antialiased overflow-x-hidden">
      {/* Navigation - Reduced sizes */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrollY > 50
        ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-300'
        : 'bg-white shadow-lg border-b border-gray-200'
        }`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6"> {/* Reduced max width and padding */}
          <div className="flex justify-between items-center py-3"> {/* Reduced padding */}
            {/* VDart Logo - Left Side */}
            <div className="flex items-center">
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden bg-white">
                <img
                  src={vdartlogo}
                  alt="VDart Logo"
                  className="w-10 h-10 object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6"> {/* Reduced spacing */}
              <button
                onClick={() => scrollToSection('projects')}
                className="relative text-gray-700 hover:text-blue-900 transition-colors font-semibold group text-sm" // Added text-sm
              >
                Projects
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-900 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="relative text-gray-700 hover:text-blue-900 transition-colors font-semibold group text-sm"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-900 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => scrollToSection('impact')}
                className="relative text-gray-700 hover:text-blue-900 transition-colors font-semibold group text-sm"
              >
                Our Impact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-900 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => setShowEventCalendar(true)}
                className="bg-blue-900 text-white px-4 py-2 hover:bg-blue-800 transition-all duration-300 font-semibold text-xs shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 rounded-md flex items-center" // Reduced padding and text size
              >
                <Calendar className="w-3 h-3 mr-2" /> {/* Reduced icon size */}
                Event Calendar
              </button>
              <button
                onClick={() => setShowProcessFlow(true)}
                className="bg-blue-900 text-white px-4 py-2 hover:bg-blue-800 transition-all duration-300 font-semibold text-xs shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 rounded-md flex items-center"
              >
                <Settings className="w-3 h-3 mr-2" />
                Process Flow
              </button>
              <button
                onClick={() => setShowDashboard(true)}
                className="bg-blue-900 text-white px-4 py-2 hover:bg-blue-800 transition-all duration-300 font-semibold text-xs shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 rounded-md flex items-center"
              >
                <File className="w-3 h-3 mr-2" />
                File Manager
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 transition-colors rounded-md"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />} {/* Reduced icon size */}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3"> {/* Reduced padding and spacing */}
              <button
                onClick={() => scrollToSection('projects')}
                className="block w-full text-left text-gray-700 hover:text-blue-900 transition-colors font-semibold text-sm"
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('services')}
                className="block w-full text-left text-gray-700 hover:text-blue-900 transition-colors font-semibold text-sm"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('impact')}
                className="block w-full text-left text-gray-700 hover:text-blue-900 transition-colors font-semibold text-sm"
              >
                Our Impact
              </button>
              <button
                onClick={() => setShowProcessFlow(true)}
                className="w-full bg-blue-900 text-white px-4 py-2 font-semibold text-xs rounded-md"
              >
                Process Flow
              </button>
              <button
                onClick={() => setShowDashboard(true)}
                className="w-full bg-blue-900 text-white px-4 py-2 font-semibold text-xs rounded-md"
              >
                File Management Center
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Reduced sizes */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-gray-100 relative overflow-hidden"> {/* Reduced padding */}
        {/* Background Elements - Smaller */}
        <div className="absolute inset-0">
          <div className="absolute top-16 right-0 w-64 h-64 bg-blue-900/5 rounded-full blur-3xl"></div> {/* Reduced from w-96 h-96 */}
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-900/5 rounded-full blur-2xl"></div> {/* Reduced from w-64 h-64 */}
        </div>

        <div className="max-w-6xl mx-auto px-4 lg:px-6 relative"> {/* Reduced max width */}
          <div className="text-center">
            {/* Badge - Smaller */}
            <div
              className={`inline-flex items-center px-4 py-2 bg-blue-900 text-white font-black text-xs tracking-wider mb-6 rounded-full shadow-lg transform transition-all duration-700 ${visibleElements.has('hero-badge') ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} // Reduced padding and text size
              data-animate="hero-badge"
            >
              <Award className="w-4 h-4 mr-2" /> {/* Reduced icon size */}
              DELIVERY EXCELLENCE TEAM
            </div>

            {/* Enhanced Description - Smaller */}
            <div
              className={`transform transition-all duration-700 delay-400 ${visibleElements.has('hero-desc') ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              data-animate="hero-desc"
            >
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto"> {/* Reduced padding and max width */}
                <p className="text-base text-gray-700 leading-relaxed font-medium mb-3"> {/* Reduced text size and margin */}
                  The <span className="text-gray-900 font-bold bg-yellow-100 px-2 py-1 rounded ">Delivery Team</span> is a <span className="text-blue-900 font-black">core pillar</span> driving
                  <span className="text-blue-900 font-black"> operational excellence</span> and
                  <span className="text-green-700 font-black"> employee success</span>.
                  Structured into <span className="text-blue-900 font-bold">three specialized entities</span>, ensuring seamless alignment between
                  <span className="text-gray-900 font-bold"> process</span>,
                  <span className="text-blue-700 font-bold"> productivity</span>, and
                  <span className="text-green-700 font-bold"> performance</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Gallery Section - Collage Style with Stable Popup */}
      <section id="projects" className="py-12 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          {/* Section Header */}
          <div
            className={`text-center mb-10 transform transition-all duration-700 ${visibleElements.has('projects-header') ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            data-animate="projects-header"
          >
            <div className="w-16 h-1 bg-blue-900 mx-auto mb-4"></div>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">
              OUR PROJECTS
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto font-medium text-base">
              Our innovative solutions driving organizational excellence
            </p>
          </div>

          {/* Main Project Display */}
          <div className="relative">
            <div className="bg-white shadow-2xl border border-gray-200 overflow-hidden rounded-lg">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Enhanced Project Visual - Wrapped Container */}
                <div className="bg-gray-50 border-r border-gray-200">
                  <div className="h-80 relative overflow-hidden bg-white m-3 rounded-lg shadow-sm">
                    <img
                      id={`main-image-${currentProject}`}
                      src={projects[currentProject].gallery ? projects[currentProject].gallery[0] : projects[currentProject].image}
                      alt={projects[currentProject].title}
                      className="w-full h-full object-contain transition-all duration-500"
                    />

             

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-lg ${projects[currentProject].status === 'active'
                        ? 'bg-green-500 text-white'
                        : projects[currentProject].status === 'beta'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-500 text-white'
                        }`}>
                        {projects[currentProject].status?.toUpperCase()}
                      </div>
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-semibold">
                        {projects[currentProject].gallery?.length || 4} photos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Project Details */}
                <div className="p-8 flex flex-col justify-between bg-white">
                  {/* Project Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                      {projects[currentProject].title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-medium text-base mb-4">
                      {projects[currentProject].description}
                    </p>


                  </div>

                  {/* Project Metrics */}
                  <div className="mb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 rounded-xl border border-blue-200 hover:border-blue-300 transform hover:scale-105">
                        <div className="text-xl font-black text-blue-900 mb-1">
                          {projects[currentProject].metrics.improvement}
                        </div>
                        <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                          Efficiency
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 rounded-xl border border-green-200 hover:border-green-300 transform hover:scale-105">
                        <div className="text-xl font-black text-green-900 mb-1">
                          {projects[currentProject].metrics.timeline}
                        </div>
                        <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                          Timeline
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 rounded-xl border border-purple-200 hover:border-purple-300 transform hover:scale-105">
                        <div className="text-xl font-black text-purple-900 mb-1">
                          {projects[currentProject].metrics.impact}
                        </div>
                        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                          Impact
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Row - Thumbnails and Action Buttons Parallel */}
              <div className="grid lg:grid-cols-2 gap-0 border-t border-gray-200 bg-gray-50">
                {/* Left Side - Photo Gallery */}
                <div className="bg-white border-r border-gray-200 px-6 py-4">
                  <div className="flex space-x-3 justify-center items-center overflow-x-auto">
                    {(projects[currentProject].gallery || [
                      projects[currentProject].image,
                      projects[currentProject].image,
                      projects[currentProject].image,
                      projects[currentProject].image
                    ]).map((photo, photoIndex) => (
                      <div
                        key={photoIndex}
                        className="group relative cursor-pointer flex-shrink-0"
                        onMouseEnter={() => {
                          const mainImg = document.getElementById(`main-image-${currentProject}`);
                          if (mainImg) {
                            mainImg.style.opacity = '0.7';
                            setTimeout(() => {
                              mainImg.src = photo;
                              mainImg.style.opacity = '1';
                            }, 150);
                          }
                        }}
                      >
                        {/* Enhanced Thumbnail - Larger Size */}
                        <div className={`w-20 h-16 rounded-lg overflow-hidden border-2 shadow-sm transform transition-all duration-200 hover:scale-110 hover:shadow-md bg-white ${photoIndex === 0 ? 'border-blue-400 ring-1 ring-blue-300' : 'border-gray-300 hover:border-blue-400'}`}>
                          <img
                            src={photo}
                            alt={`View ${photoIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Enhanced Tooltip - Positioned above thumbnail */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap font-medium">
                            {getPhotoLabel(projects[currentProject].title, photoIndex)}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="bg-white px-6 py-4 flex items-center justify-center">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => window.open(projects[currentProject].downloadLink, '_blank')}
                      className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-110 rounded-xl flex items-center justify-center"
                    >
                      <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap font-medium">
                        View
                      </div>
                    </button>

                    <button
                      onClick={() => window.open(projects[currentProject].downloadLink, '_blank')}
                      className="group relative w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-110 rounded-xl flex items-center justify-center"
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap font-medium">
                        Download
                      </div>
                    </button>

                    <button
                      onClick={() => window.open(projects[currentProject].githubLink, '_blank')}
                      className="group relative w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-110 rounded-xl flex items-center justify-center"
                    >
                      <Code className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap font-medium">
                        Source
                      </div>
                    </button>

                    <button
                      onClick={() => window.open(projects[currentProject].documentationLink, '_blank')}
                      className="group relative w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-110 rounded-xl flex items-center justify-center"
                    >
                      <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap font-medium">
                        Docs
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Navigation Controls */}
            <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
              <button
                onClick={prevProject}
                className="bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-900 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-full border-2 border-gray-200 hover:border-blue-200"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
              <button
                onClick={nextProject}
                className="bg-white hover:bg-gray-50 text-gray-700 hover:text-blue-900 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-full border-2 border-gray-200 hover:border-blue-200"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Clean Project Indicators */}
          <div className="flex justify-center items-center space-x-3 mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProject(index)}
                className={`transition-all duration-300 ${currentProject === index
                  ? 'bg-blue-900 w-8 h-3 rounded-full shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400 w-3 h-3 rounded-full hover:scale-125 transform'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      

      {/* Reports Gallery Section - Similar size reductions */}
      <section id="reports" className="py-12 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          {/* Section Header */}
          <div
            className={`text-center mb-10 transform transition-all duration-700 ${visibleElements.has('reports-header') ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            data-animate="reports-header"
          >
            <div className="w-16 h-1 bg-blue-900 mx-auto mb-4"></div>
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4">
              OUR REPORTS
              {/* <span className="block text-blue-900">WITH INSIGHTS</span> */}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto font-medium text-base">
              Comprehensive analytics and data-driven insights powering strategic decisions
            </p>
          </div>

          {/* Gallery Container */}
          <div className="relative">
            {/* Gallery Display */}
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentReport * (100 / 3)}%)` }}
              >
                {/* Reports List */}
                {ourReports.map((report, index) => (
                  <div key={index} className="w-1/3 flex-shrink-0 px-2"> {/* Reduced padding */}
                    <div className="group bg-white hover:bg-gray-50 transition-all duration-500 border border-gray-200 hover:border-blue-200 hover:shadow-2xl transform hover:-translate-y-2 rounded-xl overflow-hidden"> {/* Reduced translate */}
                      {/* Report Header */}
                      <div className={`${report.color} p-5 text-white relative overflow-hidden`}> {/* Reduced padding */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div> {/* Reduced sizes */}
                        <div className="absolute top-3 right-3"> {/* Reduced positioning */}
                          <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${report.status === 'live' ? 'bg-green-400 animate-pulse' :
                            report.status === 'updated' ? 'bg-blue-400' : 'bg-yellow-400'
                            }`}></div> {/* Reduced size */}
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3"> {/* Reduced margin */}
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300"> {/* Reduced size */}
                              {report.icon}
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold opacity-90 uppercase tracking-wider">
                                {report.frequency}
                              </div>
                              <div className="text-xs font-semibold opacity-90">
                                {report.lastUpdated}
                              </div>
                            </div>
                          </div>
                          <h3 className="text-lg font-black mb-2 group-hover:text-white/95 transition-colors leading-tight"> {/* Reduced text size */}
                            {report.title}
                          </h3>
                          <div className="text-xs font-semibold opacity-90 uppercase tracking-wider">
                            {report.category}
                          </div>
                        </div>
                      </div>

                      {/* Report Content */}
                      <div className="p-5"> {/* Reduced padding */}
                        <p className="text-gray-600 leading-relaxed font-medium mb-5 text-sm"> {/* Reduced text size and margin */}
                          {report.description}
                        </p>
                        <div className="flex space-x-2"> {/* Reduced spacing */}
                          <button className="flex-1 bg-gray-900 text-white px-3 py-2.5 hover:bg-blue-900 transition-all duration-300 font-semibold text-xs rounded-lg flex items-center justify-center group shadow-lg hover:shadow-xl"> {/* Reduced padding and text size */}
                            <FileText className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" /> {/* Reduced icon size */}
                            View Report
                            <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls - Smaller */}
            <div className="absolute top-1/2 -translate-y-1/2 left-3">
              <button
                onClick={() => setCurrentReport(currentReport === 0 ? 1 : currentReport - 1)}
                className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 p-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-full border border-gray-200 hover:border-gray-300" // Reduced padding
              >
                <ChevronLeft className="w-5 h-5" /> {/* Reduced icon size */}
              </button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-3">
              <button
                onClick={() => setCurrentReport(currentReport === 1 ? 0 : currentReport + 1)}
                className="bg-white/95 backdrop-blur-sm hover:bg-white text-gray-900 p-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 rounded-full border border-gray-200 hover:border-gray-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gallery Indicators - Smaller */}
          <div className="flex justify-center space-x-2 mt-6">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentReport(index)}
                className={`transition-all duration-300 rounded-full ${currentReport === index
                  ? 'w-8 h-2.5 bg-blue-900' // Reduced sizes
                  : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

     

      {/* Compact Services Section - Size reductions */}
      <section id="services" className="py-12 bg-gray-100 relative"> {/* Reduced padding */}
        {/* Section Header */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6 mb-10"> {/* Reduced max width and margin */}
          <div
            className={`text-center transform transition-all duration-700 ${visibleElements.has('services-header') ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            data-animate="services-header"
          >
            <div className="w-16 h-1 bg-blue-900 mx-auto mb-4"></div> {/* Reduced width and margin */}
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-4"> {/* Reduced text sizes */}
              OUR SERVICES
              {/* <span className="block text-blue-900">SERVICES</span> */}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto font-medium text-base"> {/* Reduced max width and text size */}
              Three core functions working in harmony to drive exceptional results
            </p>
          </div>
        </div>

        {/* Compact Services Grid */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6"> {/* Reduced max width */}
          <div className="grid lg:grid-cols-3 gap-6"> {/* Reduced gap */}
            {services.map((service, index) => (
              <div
                key={index}
                className={`group relative ${service.bgColor} hover:bg-white transition-all duration-500 border border-gray-200 hover:border-blue-200 hover:shadow-xl transform ${visibleElements.has(`service-${index}`) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} rounded-lg`}
                data-animate={`service-${index}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-lg"></div>

                <div className="p-6"> {/* Reduced padding */}
                  {/* Header */}
                  <div className="mb-5"> {/* Reduced margin */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 rounded-lg shadow-lg`}> {/* Reduced sizes */}
                      {service.icon}
                    </div>

                    <div className="mb-3"> {/* Reduced margin */}
                      <span className="text-xs font-bold text-blue-900 tracking-wider uppercase">{service.subtitle}</span> {/* Reduced text size */}
                      <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-900 transition-colors"> {/* Reduced text size */}
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed font-medium mb-5 text-sm"> {/* Reduced text size and margin */}
                    {service.description}
                  </p>

                  {/* CTA */}
                  <button
                    className="bg-blue-900 text-white px-6 py-2.5 hover:bg-blue-800 transition-all duration-300 font-semibold text-xs tracking-wider hover:shadow-lg w-full transform hover:-translate-y-1 rounded-md" // Reduced padding and text size
                    onClick={() => service.isClickable && handleServiceClick(service.modalType)}
                  >
                    View Details
                    <ArrowRight className="inline-block ml-2 w-3 h-3" /> {/* Reduced icon size */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Champions Section - Size reductions */}
      <section id="champions" className="py-12 bg-gradient-to-br from-blue-50 via-white to-gray-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-0 w-56 h-56 bg-blue-900/5 rounded-full blur-3xl"></div> {/* Reduced sizes */}
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-900/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 lg:px-6 relative"> {/* Reduced max width */}
          {/* Section Header */}
          <div
            className={`text-center mb-12 transform transition-all duration-700 ${visibleElements.has('champions-header') ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`} // Reduced margin
            data-animate="champions-header"
          >
            <div className="w-16 h-1 bg-gradient-to-r from-blue-900 to-green-600 mx-auto mb-4"></div> {/* Reduced width and margin */}
            <h2 className="text-2xl lg:text-4xl font-black text-gray-900 mb-4"> {/* Reduced text sizes */}
              {/* OUR */}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-green-600">OUR CHAMPIONS</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto font-medium text-base leading-relaxed"> {/* Reduced max width and text size */}
              Meet the exceptional individuals driving our success through dedication, innovation, and outstanding performance
            </p>
          </div>

          {/* True Infinite Scroll Container */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex space-x-5 animate-infinite-scroll" // Reduced spacing
                style={{
                  width: 'calc(280px * 16)', // Reduced width calculation (was 350px)
                }}
              >
                {/* Champions Cards - Original Set with reduced sizes */}
                {[...ourChampions, ...ourChampions].map((champion, index) => (
                  <div
                    key={`champion-${index}`}
                    className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100 overflow-hidden group relative" // Reduced width from w-80 to w-64, reduced translate
                  >
                    {/* Gradient Border Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${champion.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>

                    {/* Champion Photo with Overlay */}
                    <div className="relative h-56 overflow-hidden"> {/* Reduced height from h-72 to h-56 */}
                      <img
                        src={champion.photo}
                        alt={champion.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Champion Badge */}
                      <div className="absolute top-3 right-3"> {/* Reduced positioning */}
                        <div className={`bg-gradient-to-br ${champion.color} text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center shadow-lg`}> {/* Reduced padding */}
                          <Award className="w-3 h-3 mr-1" /> {/* Reduced icon size */}
                          {champion.badge}
                        </div>
                      </div>

                      {/* Name Overlay */}
                      <div className="absolute bottom-3 left-3 right-3"> {/* Reduced positioning */}
                        <h3 className="text-lg font-black text-white mb-1 drop-shadow-lg"> {/* Reduced text size */}
                          {champion.name}
                        </h3>
                        <p className="text-blue-200 font-semibold text-xs uppercase tracking-wider drop-shadow-md"> {/* Reduced text size */}
                          {champion.designation}
                        </p>
                      </div>
                    </div>

                    {/* Champion Details */}
                    <div className="p-5 relative z-10"> {/* Reduced padding */}
                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed font-medium text-xs mb-5 line-clamp-3"> {/* Reduced text size and margin */}
                        {champion.description}
                      </p>

                      {/* Action Section */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100"> {/* Reduced padding */}
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg font-semibold text-xs flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"> {/* Reduced padding and text size */}
                          <User className="w-3 h-3 mr-2" /> {/* Reduced icon size */}
                          View Profile
                          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Fade edges - Adjusted for smaller cards */}
            <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-blue-50 via-blue-50/50 to-transparent pointer-events-none z-10"></div> {/* Reduced width */}
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-blue-50 via-blue-50/50 to-transparent pointer-events-none z-10"></div>
          </div>
        </div>

        {/* Enhanced CSS for true infinite scroll with adjusted sizes */}
        <style jsx>{`
          @keyframes infiniteScroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-280px * 8)); /* Adjusted for new card width */
            }
          }
          
          .animate-infinite-scroll {
            animation: infiniteScroll 40s linear infinite;
          }
          
          .animate-infinite-scroll:hover {
            animation-play-state: paused;
          }
          
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </section>

      {/* Impact Section - Size reductions */}
      <section id="impact" className="py-10 bg-gray-900 text-white relative overflow-hidden"> {/* Reduced padding */}
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900 to-transparent opacity-20"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 lg:px-6 relative"> {/* Reduced max width */}
          {/* Impact Message */}
          <div
            className={`text-center transform transition-all duration-700 ${visibleElements.has('impact-footer') ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            data-animate="impact-footer"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 shadow-2xl border border-gray-700 rounded-lg"> {/* Reduced padding */}
              <h2 className="text-2xl font-black mb-5 text-white">OUR IMPACT</h2> {/* Reduced text size and margin */}
              <p className="text-base text-gray-300 leading-relaxed font-medium"> {/* Reduced text size */}
                Together, these functions fuel a culture of{' '}
                <strong className="text-white">CONTINUOUS IMPROVEMENT</strong>,{' '}
                <strong className="text-blue-300">EMPLOYEE SUPPORT</strong>, and{' '}
                <strong className="text-gray-100">PROCESS INNOVATION</strong> at{' '}
                <strong className="text-white">VDART</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Size reductions */}
      <section className="py-10 bg-gray-900 text-white"> {/* Reduced padding */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6"> {/* Reduced max width */}
          <div className="text-center mb-8"> {/* Reduced margin */}
            <h3 className="text-xl font-black text-white mb-2">BY THE NUMBERS</h3> {/* Reduced text size and margin */}
            <p className="text-gray-300 font-medium text-sm">Our measurable achievements and impact</p> {/* Reduced text size */}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5"> {/* Reduced gap */}
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-800/50 p-5 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 rounded-lg border border-gray-700"> {/* Reduced padding */}
                <div className="w-10 h-10 bg-blue-900 flex items-center justify-center mx-auto mb-3 rounded-lg"> {/* Reduced sizes */}
                  {stat.icon}
                </div>
                <div className="text-xl lg:text-2xl font-black mb-2 text-blue-300"> {/* Reduced text sizes */}
                  {stat.number}
                </div>
                <p className="text-gray-300 font-medium text-xs uppercase tracking-wider">{stat.label}</p> {/* Reduced text size */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Size reductions */}
      <footer className="bg-gray-800 text-white py-10"> {/* Reduced padding */}
        <div className="max-w-6xl mx-auto px-4 lg:px-6"> {/* Reduced max width */}
          <div className="grid lg:grid-cols-4 gap-6 mb-6"> {/* Reduced gaps and margin */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-5"> {/* Reduced spacing and margin */}
                <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg"> {/* Reduced size */}
                  {/* Logo */}
                  <img src={vdartlogo} alt="VDart Logo" className="w-6 h-6" /> {/* Reduced size */}
                </div>
                <div>
                  <span className="text-lg font-bold text-white">VDart</span> {/* Reduced text size */}
                  <span className="block text-xs text-gray-400 font-medium">Delivery Excellence</span> {/* Reduced text size */}
                </div>
              </div>
              <p className="text-gray-300 max-w-sm leading-relaxed font-medium text-sm"> {/* Reduced max width and text size */}
                Pioneering operational excellence through innovative delivery solutions and data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black mb-5 tracking-wider">SERVICES</h4> {/* Reduced text size and margin */}
              <ul className="space-y-2"> {/* Reduced spacing */}
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Business Unit Engagement</a></li> {/* Reduced text size */}
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Data Analysis</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Tools Management</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black mb-5 tracking-wider">COMPANY</h4> {/* Reduced text size and margin */}
              <ul className="space-y-2"> {/* Reduced spacing */}
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">About VDart</a></li> {/* Reduced text size */}
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Our Impact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">Internal Portal</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 flex flex-col lg:flex-row justify-between items-center"> {/* Reduced padding */}
            <p className="text-gray-400 mb-3 lg:mb-0 font-medium text-sm"> {/* Reduced text size and margin */}
              © 2025 VDart Delivery Team. Internal Showcase Portal.
            </p>
            <div className="text-xs text-gray-500 font-semibold tracking-wider"> {/* Reduced text size */}
              EXCELLENCE IN DELIVERY OPERATIONS
            </div>
          </div>
        </div>
      </footer>

      {/* Tools Management Modal - Size reductions */}
      {showToolsModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl rounded-lg"> {/* Reduced max width */}
            {/* Modal Header */}
            <div className="bg-blue-900 text-white p-5 flex justify-between items-center"> {/* Reduced padding */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 flex items-center justify-center rounded-lg"> {/* Reduced size */}
                  <Settings className="w-5 h-5" /> {/* Reduced icon size */}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-wider">TOOLS MANAGEMENT</h2> {/* Reduced text size */}
                  <p className="text-blue-200 font-medium text-sm">Delivery Excellence Function</p> {/* Reduced text size */}
                </div>
              </div>
              <button
                onClick={() => setShowToolsModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 transition-all duration-200 rounded-md"
              >
                <X className="w-5 h-5" /> {/* Reduced icon size */}
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]"> {/* Adjusted height calculation */}
              <div className="p-6 space-y-6"> {/* Reduced padding and spacing */}
                {/* Purpose & Vision */}
                <div className="bg-gray-50 p-5 rounded-lg"> {/* Reduced padding */}
                  <div className="flex items-center mb-3"> {/* Reduced margin */}
                    <div className="w-10 h-10 bg-blue-900 flex items-center justify-center mr-3 rounded-lg"> {/* Reduced size and margin */}
                      <Target className="w-5 h-5 text-white" /> {/* Reduced icon size */}
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">PURPOSE & VISION</h4> {/* Reduced text size */}
                  </div>
                  <div className="space-y-3 text-gray-700 leading-relaxed font-medium text-sm"> {/* Reduced spacing and text size */}
                    <p>
                      The Delivery Excellence Function at VDart serves as the <strong className="text-blue-900">backbone of operational efficiency</strong>,
                      quality control, and performance monitoring within the recruitment and staffing delivery lifecycle.
                    </p>
                    <div className="bg-white p-3 border-l-4 border-blue-900 rounded-r-lg"> {/* Reduced padding */}
                      <p className="font-bold text-gray-900 text-sm"> {/* Reduced text size */}
                        We act as the <strong className="text-blue-900">CENTRAL HUB</strong> for all delivery tools, reports, processes, audits, and data insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Responsibilities */}
                <div>
                  <div className="flex items-center mb-5"> {/* Reduced margin */}
                    <div className="w-10 h-10 bg-blue-900 flex items-center justify-center mr-3 rounded-lg"> {/* Reduced size and margin */}
                      <Briefcase className="w-5 h-5 text-white" /> {/* Reduced icon size */}
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">CORE RESPONSIBILITIES</h4> {/* Reduced text size */}
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5"> {/* Reduced gap */}
                    {[
                      {
                        title: "TOOL GOVERNANCE",
                        desc: "Seamless access and optimal usage across platforms",
                        icon: <Settings className="w-4 h-4" /> // Reduced icon size
                      },
                      {
                        title: "DATA MANAGEMENT",
                        desc: "Accurate reports for leadership decision-making",
                        icon: <BarChart3 className="w-4 h-4" />
                      },
                      {
                        title: "TRAINING & SUPPORT",
                        desc: "Ongoing training and escalation matrices",
                        icon: <Users className="w-4 h-4" />
                      },
                      {
                        title: "COMPLIANCE CONTROL",
                        desc: "Monitor usage and maintain data security",
                        icon: <Target className="w-4 h-4" />
                      }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-5 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-900 rounded-r-lg"> {/* Reduced padding */}
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-blue-900 flex items-center justify-center mr-3 flex-shrink-0 text-white rounded-lg"> {/* Reduced size and margin */}
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="font-black text-gray-900 mb-2 tracking-wider text-sm">{item.title}</h5> {/* Reduced text size */}
                            <p className="text-gray-600 font-medium text-sm">{item.desc}</p> {/* Reduced text size */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools & Platforms */}
                <div className="bg-gray-50 p-5 rounded-lg"> {/* Reduced padding */}
                  <div className="flex items-center mb-5"> {/* Reduced margin */}
                    <div className="w-10 h-10 bg-blue-900 flex items-center justify-center mr-3 rounded-lg"> {/* Reduced size and margin */}
                      <Settings className="w-5 h-5 text-white" /> {/* Reduced icon size */}
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">TOOLS & PLATFORMS</h4> {/* Reduced text size */}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-5"> {/* Reduced gap */}
                    <div className="bg-white p-5 shadow-lg rounded-lg"> {/* Reduced padding */}
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm"> {/* Reduced text size and margin */}
                        <span className="w-2.5 h-2.5 bg-blue-900 mr-2 rounded-full"></span> {/* Reduced size and margin */}
                        RECRUITMENT PLATFORMS
                      </h5>
                      <div className="grid grid-cols-2 gap-2"> {/* Reduced gap */}
                        {['Ceipal ATS', 'LinkedIn Recruiter', 'Naukri', 'Monster', 'Dice', 'CareerBuilder', 'FoundIT', 'Indeed'].map((platform, i) => (
                          <div key={i} className="flex items-center p-2.5 bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer rounded-md"> {/* Reduced padding */}
                            <div className="w-1.5 h-1.5 bg-blue-900 mr-2 rounded-full"></div> {/* Reduced size and margin */}
                            <span className="font-semibold text-gray-800 text-xs">{platform}</span> {/* Reduced text size */}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-5 shadow-lg rounded-lg"> {/* Reduced padding */}
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm"> {/* Reduced text size and margin */}
                        <span className="w-2.5 h-2.5 bg-blue-900 mr-2 rounded-full"></span> {/* Reduced size and margin */}
                        COMMUNICATION TOOLS
                      </h5>
                      <div className="space-y-2"> {/* Reduced spacing */}
                        {['Zoom Groups', 'Internal Tracker Sheets', 'Candidate Info Page', 'Portal Allocation Sheet'].map((tool, i) => (
                          <div key={i} className="flex items-center p-2.5 bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer rounded-md"> {/* Reduced padding */}
                            <div className="w-1.5 h-1.5 bg-blue-900 mr-2 rounded-full"></div> {/* Reduced size and margin */}
                            <span className="font-semibold text-gray-800 text-xs">{tool}</span> {/* Reduced text size */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Analysis Modal - Similar size reductions */}
      {showDataModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl rounded-lg">
            {/* Modal Header */}
            <div className="bg-slate-700 text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 flex items-center justify-center rounded-lg">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-wider">DATA ANALYSIS</h2>
                  <p className="text-slate-200 font-medium text-sm">Insights & Intelligence Function</p>
                </div>
              </div>
              <button
                onClick={() => setShowDataModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 transition-all duration-200 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Purpose & Vision */}
                <div className="bg-slate-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-slate-700 flex items-center justify-center mr-3 rounded-lg">
                      <PieChart className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">MISSION & APPROACH</h4>
                  </div>
                  <div className="space-y-3 text-gray-700 leading-relaxed font-medium text-sm">
                    <p>
                      The Data Analysis function transforms <strong className="text-slate-700">raw recruitment data</strong> into
                      <strong className="text-blue-900"> actionable business insights</strong>, enabling data-driven decision making
                      across all levels of the organization.
                    </p>
                    <div className="bg-white p-3 border-l-4 border-slate-700 rounded-r-lg">
                      <p className="font-bold text-gray-900 text-sm">
                        We bridge the gap between <strong className="text-slate-700">DATA COMPLEXITY</strong> and
                        <strong className="text-blue-900"> STRATEGIC CLARITY</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Functions */}
                <div>
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 bg-slate-700 flex items-center justify-center mr-3 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">CORE FUNCTIONS</h4>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5">
                    {[
                      {
                        title: "PERFORMANCE ANALYTICS",
                        desc: "Real-time monitoring of recruitment KPIs and metrics",
                        icon: <TrendingUp className="w-4 h-4" />
                      },
                      {
                        title: "PREDICTIVE MODELING",
                        desc: "Forecasting trends and identifying opportunities",
                        icon: <Target className="w-4 h-4" />
                      },
                      {
                        title: "DASHBOARD CREATION",
                        desc: "Interactive visualizations for executive reporting",
                        icon: <Monitor className="w-4 h-4" />
                      },
                      {
                        title: "DATA QUALITY ASSURANCE",
                        desc: "Ensuring accuracy and reliability of all metrics",
                        icon: <CheckCircle className="w-4 h-4" />
                      }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-5 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-slate-700 rounded-r-lg">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-slate-700 flex items-center justify-center mr-3 flex-shrink-0 text-white rounded-lg">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="font-black text-gray-900 mb-2 tracking-wider text-sm">{item.title}</h5>
                            <p className="text-gray-600 font-medium text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Deliverables */}
                <div className="bg-slate-50 p-5 rounded-lg">
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 bg-slate-700 flex items-center justify-center mr-3 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">KEY DELIVERABLES</h4>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-5">
                    <div className="bg-white p-5 shadow-lg rounded-lg">
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm">
                        <span className="w-2.5 h-2.5 bg-slate-700 mr-2 rounded-full"></span>
                        WEEKLY REPORTS
                      </h5>
                      <ul className="space-y-2 text-xs text-gray-600">
                        <li>• Recruitment Pipeline Status</li>
                        <li>• Team Performance Metrics</li>
                        <li>• Client Satisfaction Scores</li>
                        <li>• Resource Utilization</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 shadow-lg rounded-lg">
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm">
                        <span className="w-2.5 h-2.5 bg-slate-700 mr-2 rounded-full"></span>
                        EXECUTIVE DASHBOARDS
                      </h5>
                      <ul className="space-y-2 text-xs text-gray-600">
                        <li>• Real-time KPI Monitoring</li>
                        <li>• Trend Analysis</li>
                        <li>• Comparative Performance</li>
                        <li>• Strategic Insights</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 shadow-lg rounded-lg">
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm">
                        <span className="w-2.5 h-2.5 bg-slate-700 mr-2 rounded-full"></span>
                        AD-HOC ANALYSIS
                      </h5>
                      <ul className="space-y-2 text-xs text-gray-600">
                        <li>• Custom Research Projects</li>
                        <li>• Process Optimization Studies</li>
                        <li>• Market Analysis</li>
                        <li>• ROI Assessments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Unit Engagement Modal - Similar size reductions */}
      {showBUModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl rounded-lg">
            {/* Modal Header */}
            <div className="bg-gray-800 text-white p-5 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 flex items-center justify-center rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-wider">BUSINESS UNIT ENGAGEMENT</h2>
                  <p className="text-gray-200 font-medium text-sm">Strategic Connector Function</p>
                </div>
              </div>
              <button
                onClick={() => setShowBUModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 transition-all duration-200 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Purpose & Vision */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">STRATEGIC MISSION</h4>
                  </div>
                  <div className="space-y-3 text-gray-700 leading-relaxed font-medium text-sm">
                    <p>
                      The Business Unit Engagement function serves as the <strong className="text-gray-800">vital bridge</strong> between
                      leadership vision and operational execution, ensuring seamless communication and
                      <strong className="text-blue-900"> strategic alignment</strong> across all organizational levels.
                    </p>
                    <div className="bg-white p-3 border-l-4 border-gray-800 rounded-r-lg">
                      <p className="font-bold text-gray-900 text-sm">
                        We transform <strong className="text-gray-800">BUSINESS REQUIREMENTS</strong> into
                        <strong className="text-blue-900"> ACTIONABLE STRATEGIES</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Core Engagement Areas */}
                <div>
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">ENGAGEMENT AREAS</h4>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5">
                    {[
                      {
                        title: "STAKEHOLDER ALIGNMENT",
                        desc: "Ensuring all parties share common goals and expectations",
                        icon: <Target className="w-4 h-4" />
                      },
                      {
                        title: "PROCESS OPTIMIZATION",
                        desc: "Identifying and implementing efficiency improvements",
                        icon: <Settings className="w-4 h-4" />
                      },
                      {
                        title: "FEEDBACK INTEGRATION",
                        desc: "Collecting and implementing stakeholder feedback",
                        icon: <MessageSquare className="w-4 h-4" />
                      },
                      {
                        title: "CHANGE MANAGEMENT",
                        desc: "Guiding smooth transitions and adoptions",
                        icon: <TrendingUp className="w-4 h-4" />
                      }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-5 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-gray-800 rounded-r-lg">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-gray-800 flex items-center justify-center mr-3 flex-shrink-0 text-white rounded-lg">
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="font-black text-gray-900 mb-2 tracking-wider text-sm">{item.title}</h5>
                            <p className="text-gray-600 font-medium text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Activities */}
                <div className="bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 bg-gray-800 flex items-center justify-center mr-3 rounded-lg">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-wider">KEY ACTIVITIES</h4>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-5">
                    <div className="bg-white p-5 shadow-lg rounded-lg">
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm">
                        <span className="w-2.5 h-2.5 bg-gray-800 mr-2 rounded-full"></span>
                        REGULAR MEETINGS
                      </h5>
                      <ul className="space-y-2 text-xs text-gray-600">
                        <li>• Weekly Leadership Sync</li>
                        <li>• Monthly Strategy Reviews</li>
                        <li>• Quarterly Business Reviews</li>
                        <li>• Ad-hoc Consultation Sessions</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 shadow-lg rounded-lg">
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm">
                        <span className="w-2.5 h-2.5 bg-gray-800 mr-2 rounded-full"></span>
                        COMMUNICATION
                      </h5>
                      <ul className="space-y-2 text-xs text-gray-600">
                        <li>• Executive Briefings</li>
                        <li>• Team Newsletters</li>
                        <li>• Process Documentation</li>
                        <li>• Training Materials</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 shadow-lg rounded-lg">
                      <h5 className="font-black text-gray-900 mb-3 tracking-wider flex items-center text-sm">
                        <span className="w-2.5 h-2.5 bg-gray-800 mr-2 rounded-full"></span>
                        IMPLEMENTATION
                      </h5>
                      <ul className="space-y-2 text-xs text-gray-600">
                        <li>• Project Coordination</li>
                        <li>• Resource Allocation</li>
                        <li>• Timeline Management</li>
                        <li>• Quality Assurance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VDartDeliveryHomepage;