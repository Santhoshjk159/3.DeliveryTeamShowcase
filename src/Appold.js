import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Users, BarChart3, Settings, TrendingUp, ArrowRight, Menu, X, Target, Award, Briefcase, Play, Star, CheckCircle } from 'lucide-react';
import vdartlogo from './assets/logo.png'; // Placeholder for VDart logo
const VDartDeliveryHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasAnimated, setHasAnimated] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementId = entry.target.dataset.animate;
          if (entry.isIntersecting && !hasAnimated.has(elementId)) {
            setVisibleElements(prev => new Set(prev).add(elementId));
            setHasAnimated(prev => new Set(prev).add(elementId));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [hasAnimated]);

  const services = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "Business Unit Engagement",
      description: "Acts as a strategic connector between <strong className='text-blue-600 font-bold'>business leaders</strong> and <strong className='text-blue-600 font-bold'>delivery teams</strong>—gathering <strong className='text-blue-600 font-bold'>expectations</strong>, implementing <strong className='text-blue-600 font-bold'>feedback</strong>, and enhancing team <strong className='text-blue-600 font-bold'>productivity</strong>.",
      gradient: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Data Analysis",
      description: "Partners with <strong className='text-blue-600 font-bold'>Recruitment</strong> and <strong className='text-blue-600 font-bold'>Leadership</strong> to deliver <strong className='text-blue-600 font-bold'>accurate, actionable insights</strong> that enable <strong className='text-blue-600 font-bold'>data-driven decisions</strong> and <strong className='text-blue-600 font-bold'>performance tracking</strong>.",
      gradient: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
    {
      icon: <Settings className="w-7 h-7" />,
      title: "Tools Management",
      description: "Monitors <strong className='text-blue-600 font-bold'>tool adoption</strong>, provides <strong className='text-blue-600 font-bold'>training</strong>, optimizes <strong className='text-blue-600 font-bold'>tool efficiency</strong>, and identifies <strong className='text-blue-600 font-bold'>new solutions</strong>—ensuring resources directly support <strong className='text-blue-600 font-bold'>team goals</strong> and improve overall <strong className='text-blue-600 font-bold'>productivity</strong>.",
      gradient: "from-blue-600 to-blue-800",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      isClickable: true
    }
  ];

  const stats = [
    { number: "98%", label: "SLA Compliance", icon: <Target className="w-6 h-6" /> },
    { number: "500+", label: "Employees Supported", icon: <Users className="w-6 h-6" /> },
    { number: "25+", label: "Business Tools Managed", icon: <Settings className="w-6 h-6" /> },
    { number: "35%", label: "Efficiency Increase", icon: <TrendingUp className="w-6 h-6" /> }
  ];

  const features = [
    {
      title: "OPERATIONAL EXCELLENCE",
      subtitle: "Streamlined processes driving success",
      icon: <Target className="w-8 h-8" />,
      color: "text-blue-600"
    },
    {
      title: "EMPLOYEE SUCCESS",
      subtitle: "Empowering teams to achieve more",
      icon: <Users className="w-8 h-8" />,
      color: "text-gray-600"
    },
    {
      title: "PERFORMANCE OPTIMIZATION",
      subtitle: "Data-driven continuous improvement",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "text-blue-700"
    }
  ];

  const CountUpNumber = ({ end, duration = 2000, isVisible = false }) => {
    const [count, setCount] = useState('0');
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (isVisible && !hasStarted) {
        setHasStarted(true);
        const isPercentage = end.includes('%');
        const isPlus = end.includes('+');
        const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));

        let start = 0;
        const increment = numericEnd / (duration / 30);

        const counter = setInterval(() => {
          start += increment;
          if (start >= numericEnd) {
            setCount(end);
            clearInterval(counter);
          } else {
            const current = Math.floor(start);
            setCount(isPercentage ? `${current}%` : isPlus ? `${current}+` : current.toString());
          }
        }, 30);
      }
    }, [end, duration, isVisible, hasStarted]);

    return <span>{count}</span>;
  };

  return (
    <div className="min-h-screen bg-white font-[Inter] overflow-x-hidden">
      {/* Enhanced mouse follower effect */}
      <div
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-500 to-gray-600 opacity-30 pointer-events-none z-40 transition-all duration-500 ease-out rounded-full blur-sm"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${scrollY > 100 ? 1.8 : 1}) rotate(${scrollY * 0.5}deg)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${scrollY > 50
        ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200'
        : 'bg-white/90 backdrop-blur-md'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* VDart Logo Placeholder */}
              <div className="relative group cursor-pointer">
                <div className="h-12 w-32 bg-gradient-to-r from-gray-800 to-blue-600 flex items-center justify-center text-white font-black text-lg tracking-wider transition-all duration-300 group-hover:scale-105 shadow-lg">
                  VDART
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              <a href="#home" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group text-sm tracking-wide">
                Home
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-gray-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#services" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group text-sm tracking-wide">
                Services
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-gray-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#impact" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group text-sm tracking-wide">
                Our Impact
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-gray-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <button className="bg-gradient-to-r from-blue-600 to-gray-700 text-white px-8 py-3 hover:from-blue-700 hover:to-gray-800 transition-all duration-300 font-bold text-sm shadow-xl hover:shadow-2xl transform hover:-translate-y-1 tracking-wide">
                LEARN MORE
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 hover:bg-gray-100 transition-colors rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
            <div className="px-6 py-8 space-y-6">
              <a href="#home" className="block text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg">Home</a>
              <a href="#services" className="block text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg">Services</a>
              <a href="#impact" className="block text-gray-700 hover:text-blue-600 transition-colors font-semibold text-lg">Our Impact</a>
              <button className="w-full bg-gradient-to-r from-blue-600 to-gray-700 text-white px-8 py-4 font-bold text-sm tracking-wide shadow-xl">
                LEARN MORE
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Enhanced Hero Section */}
      <section id="home" className="pt-24 pb-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100 to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-t from-gray-200 to-transparent opacity-40"></div>

          {/* Enhanced floating elements */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute ${i % 2 === 0 ? 'bg-blue-400' : 'bg-gray-400'} opacity-10 rounded-full`}
              style={{
                width: `${15 + i * 8}px`,
                height: `${15 + i * 8}px`,
                left: `${10 + i * 12}%`,
                top: `${5 + i * 15}%`,
                animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}

          {/* Geometric patterns */}
          <div className="absolute top-20 right-20 w-32 h-32 border-4 border-blue-200 opacity-20 rotate-45"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 border-4 border-gray-300 opacity-15 rotate-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Enhanced Badge */}
              <div
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900 to-blue-900 text-white font-bold text-xs tracking-wider transform transition-all duration-1000 rounded-full shadow-xl ${visibleElements.has('hero-badge') ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-95'
                  }`}
                data-animate="hero-badge"
              >
                <Award className="w-4 h-4 mr-3" />
                INTERNAL DELIVERY TEAM SHOWCASE
              </div>

              <div
                className={`transform transition-all duration-1000 delay-200 ${visibleElements.has('hero-title') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                data-animate="hero-title"
              >
                <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
                  DELIVERY
                  <span className="block bg-gradient-to-r from-blue-600 to-gray-700 bg-clip-text text-transparent">
                    EXCELLENCE
                  </span>
                </h1>
              </div>

              <div
                className={`transform transition-all duration-1000 delay-400 ${visibleElements.has('hero-desc') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                data-animate="hero-desc"
              >
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-gray-600 mb-8"></div>
                <p className="text-xl text-gray-700 leading-relaxed font-medium max-w-xl">
                  The <strong className="text-blue-600">Delivery Team</strong> is a core pillar driving{' '}
                  <strong className="text-gray-900">operational excellence</strong> and{' '}
                  <strong className="text-blue-600">employee success</strong>.
                  Structured into three specialized entities, ensuring seamless alignment.
                </p>
              </div>

              <div
                className={`transform transition-all duration-1000 delay-600 ${visibleElements.has('hero-cta') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                data-animate="hero-cta"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  <button className="group bg-gradient-to-r from-blue-600 to-gray-700 text-white px-10 py-4 hover:from-blue-700 hover:to-gray-800 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 rounded-lg">
                    EXPLORE SERVICES
                    <ArrowRight className="inline-block ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button className="group border-2 border-gray-700 text-gray-700 px-10 py-4 hover:bg-gray-700 hover:text-white transition-all duration-300 font-bold flex items-center justify-center rounded-lg shadow-lg hover:shadow-xl">
                    <Play className="w-5 h-5 mr-3" />
                    WATCH DEMO
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Interactive Feature Showcase */}
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-lg shadow-2xl p-10 transform hover:scale-105 transition-all duration-500 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gray-900 tracking-wide">KEY FEATURES</h3>
                  <div className="flex space-x-3">
                    {features.map((_, i) => (
                      <button
                        key={i}
                        className={`w-4 h-4 rounded-full transition-all duration-500 ${activeFeature === i
                          ? 'bg-gradient-to-r from-blue-500 to-gray-600 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        onClick={() => setActiveFeature(i)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white flex items-center justify-center mb-6 rounded-xl shadow-lg">
                    {features[activeFeature].icon}
                  </div>
                  <h4 className={`text-3xl font-black ${features[activeFeature].color} tracking-wide`}>
                    {features[activeFeature].title}
                  </h4>
                  <p className="text-gray-600 font-medium text-lg leading-relaxed">
                    {features[activeFeature].subtitle}
                  </p>
                  <div className="flex items-center text-sm text-green-600 bg-green-50 px-4 py-3 rounded-lg">
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span className="font-semibold">Active & Optimized</span>
                  </div>
                </div>
              </div>

              {/* Enhanced achievement badges */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-600 to-gray-700 text-white p-4 shadow-2xl rounded-xl">
                <Star className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-gray-700 to-blue-600 text-white p-3 shadow-xl rounded-lg">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Quick Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-gray-900/20"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-blue-400 group-hover:text-white transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    <CountUpNumber
                      end={stat.number}
                      isVisible={visibleElements.has('stats')}
                    />
                  </div>
                  <p className="text-gray-300 font-semibold text-sm uppercase tracking-wider group-hover:text-blue-200 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div data-animate="stats" className="opacity-0"></div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <div
            className={`text-center transform transition-all duration-1000 ${visibleElements.has('services-header') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            data-animate="services-header"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-gray-600 mx-auto mb-8"></div>
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              OUR SPECIALIZED
              <span className="block bg-gradient-to-r from-blue-600 to-gray-700 bg-clip-text text-transparent">
                ENTITIES
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Three core functions working in perfect harmony to drive exceptional results
            </p>
          </div>
        </div>

        {/* Enhanced Services Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group relative ${service.bgColor} hover:bg-white transition-all duration-700 border-2 ${service.borderColor} hover:border-blue-300 hover:shadow-2xl transform hover:-translate-y-4 rounded-2xl overflow-hidden ${visibleElements.has(`service-${index}`) ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                data-animate={`service-${index}`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                {/* Enhanced progress bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>

                <div className="p-10 h-full relative">
                  {/* Enhanced Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-all duration-500 rounded-xl shadow-lg`}>
                    {service.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300 tracking-wide">
                    {service.title.toUpperCase()}
                  </h3>

                  <div
                    className="text-gray-600 leading-relaxed font-medium mb-8 text-base"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />

                  {/* Enhanced CTA */}
                  <button
                    className="group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-gray-700 group-hover:text-white text-gray-700 border-2 border-gray-700 group-hover:border-transparent px-8 py-3 transition-all duration-500 font-bold text-sm tracking-wider hover:shadow-xl rounded-lg transform group-hover:-translate-y-1"
                    onClick={() => service.isClickable && setShowToolsModal(true)}
                  >
                    {service.isClickable ? 'VIEW DETAILS' : 'LEARN MORE'}
                    <ArrowRight className="inline-block ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </button>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-4 right-4 w-8 h-8 border-2 border-gray-300 group-hover:border-blue-400 transition-colors duration-300 rounded-full opacity-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Impact Section */}
      <section id="impact" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-gray-900/30"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-800/20 to-transparent"></div>

          {/* Geometric patterns */}
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-blue-400/20 rotate-45"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-2 border-gray-400/20 rotate-12"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          {/* Enhanced Header */}
          <div
            className={`text-center mb-16 transform transition-all duration-1000 ${visibleElements.has('impact-header') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            data-animate="impact-header"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-white mx-auto mb-8"></div>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight">
              OUR <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">IMPACT</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
              Measurable results demonstrating our commitment to excellence
            </p>
          </div>

          {/* Enhanced Impact Message */}
          <div
            className={`text-center transform transition-all duration-1000 delay-300 ${visibleElements.has('impact-footer') ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            data-animate="impact-footer"
          >
            <div className="bg-white/10 backdrop-blur-lg p-12 max-w-4xl mx-auto shadow-2xl rounded-2xl border border-white/20">
              <p className="text-2xl text-gray-200 leading-relaxed font-medium">
                Together, these functions fuel a culture of{' '}
                <strong className="text-blue-400">CONTINUOUS IMPROVEMENT</strong>,{' '}
                <strong className="text-white">EMPLOYEE SUPPORT</strong>, and{' '}
                <strong className="text-blue-300">PROCESS INNOVATION</strong> at{' '}
                <strong className="text-white">VDART</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <div
            className={`bg-white/80 backdrop-blur-lg shadow-2xl p-16 transform transition-all duration-1000 rounded-3xl border border-gray-200 ${visibleElements.has('cta-section') ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
              }`}
            data-animate="cta-section"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-900 to-blue-900 text-white font-bold text-xs tracking-wider mb-8 rounded-full shadow-xl">
              <Briefcase className="w-4 h-4 mr-3" />
              EXPLORE OUR WORK
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-8 tracking-tight">
              LEARN MORE ABOUT
              <span className="block bg-gradient-to-r from-blue-600 to-gray-700 bg-clip-text text-transparent">
                OUR SERVICES
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Discover detailed insights into our specialized approaches and transformative impact
            </p>

            <div className="flex flex-col lg:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-gray-700 text-white px-12 py-4 hover:from-blue-700 hover:to-gray-800 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 group rounded-xl">
                EXPLORE PROJECTS
                <ArrowRight className="inline-block ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="border-2 border-gray-700 text-gray-700 px-12 py-4 hover:bg-gray-700 hover:text-white transition-all duration-300 font-bold rounded-xl shadow-lg hover:shadow-xl">
                VIEW ALL SERVICES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-12 w-32 bg-gradient-to-r from-white to-blue-200 flex items-center justify-center text-gray-900 font-black text-lg tracking-wider">
                  VDART
                </div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed font-medium text-lg">
                Pioneering operational excellence through innovative delivery solutions and data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-black mb-6 tracking-wider text-blue-400">SERVICES</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Business Unit Engagement</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Data Analysis</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Tools Management</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-black mb-6 tracking-wider text-blue-400">COMPANY</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">About VDart</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Our Impact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Internal Portal</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 lg:mb-0 font-medium">
              © 2025 VDart Delivery Team. Internal Showcase Portal.
            </p>
            <div className="text-sm text-blue-400 font-semibold tracking-wider">
              EXCELLENCE IN DELIVERY OPERATIONS
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Tools Management Modal */}
      {showToolsModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl rounded-2xl">
            {/* Enhanced Modal Header */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white p-8 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded-xl">
                  <Settings className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-wider">TOOLS MANAGEMENT</h2>
                  <p className="text-blue-200 font-medium">Delivery Excellence Function</p>
                </div>
              </div>
              <button
                onClick={() => setShowToolsModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-3 transition-all duration-200 rounded-lg"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="p-10 space-y-16">
                {/* Enhanced Purpose & Vision */}
                <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-10 rounded-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-gray-900 to-blue-900 flex items-center justify-center mr-5 rounded-xl">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-3xl font-black text-gray-900 tracking-wider">PURPOSE & VISION</h4>
                  </div>
                  <div className="space-y-6 text-gray-700 leading-relaxed font-medium text-lg">
                    <p>
                      The Delivery Excellence Function at VDart serves as the <strong className="text-blue-600">backbone of operational efficiency</strong>,
                      quality control, and performance monitoring within the recruitment and staffing delivery lifecycle.
                    </p>
                    <div className="bg-white p-8 border-l-4 border-blue-600 rounded-lg shadow-lg">
                      <p className="font-bold text-gray-900 text-xl">
                        We act as the <strong className="text-blue-600">CENTRAL HUB</strong> for all delivery tools, reports, processes, audits, and data insights.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Core Responsibilities */}
                <div>
                  <div className="flex items-center mb-10">
                    <div className="w-14 h-14 bg-gradient-to-r from-gray-900 to-blue-900 flex items-center justify-center mr-5 rounded-xl">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-3xl font-black text-gray-900 tracking-wider">CORE RESPONSIBILITIES</h4>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    {[
                      {
                        title: "TOOL GOVERNANCE",
                        desc: "Seamless access and optimal usage across platforms",
                        icon: <Settings className="w-6 h-6" />,
                        color: "blue"
                      },
                      {
                        title: "DATA MANAGEMENT",
                        desc: "Accurate reports for leadership decision-making",
                        icon: <BarChart3 className="w-6 h-6" />,
                        color: "gray"
                      },
                      {
                        title: "TRAINING & SUPPORT",
                        desc: "Ongoing training and escalation matrices",
                        icon: <Users className="w-6 h-6" />,
                        color: "blue"
                      },
                      {
                        title: "COMPLIANCE CONTROL",
                        desc: "Monitor usage and maintain data security",
                        icon: <Target className="w-6 h-6" />,
                        color: "gray"
                      }
                    ].map((item, i) => (
                      <div key={i} className={`bg-white p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 ${item.color === 'blue' ? 'border-blue-600' : 'border-gray-600'} rounded-xl hover:-translate-y-2`}>
                        <div className="flex items-start">
                          <div className={`w-12 h-12 ${item.color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-gray-600 to-gray-700'} flex items-center justify-center mr-4 flex-shrink-0 text-white rounded-lg`}>
                            {item.icon}
                          </div>
                          <div>
                            <h5 className="font-black text-gray-900 mb-3 tracking-wider text-lg">{item.title}</h5>
                            <p className="text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Tools & Platforms */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-10 rounded-2xl">
                  <div className="flex items-center mb-10">
                    <div className="w-14 h-14 bg-gradient-to-r from-gray-900 to-blue-900 flex items-center justify-center mr-5 rounded-xl">
                      <Settings className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-3xl font-black text-gray-900 tracking-wider">TOOLS & PLATFORMS</h4>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-10">
                    <div className="bg-white p-8 shadow-xl rounded-xl">
                      <h5 className="font-black text-gray-900 mb-6 tracking-wider flex items-center text-xl">
                        <span className="w-4 h-4 bg-blue-600 mr-4 rounded-full"></span>
                        RECRUITMENT PLATFORMS
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        {['Ceipal ATS', 'LinkedIn Recruiter', 'Naukri', 'Monster', 'Dice', 'CareerBuilder', 'FoundIT', 'Indeed'].map((platform, i) => (
                          <div key={i} className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-gray-50 hover:from-blue-100 hover:to-gray-100 transition-all duration-300 cursor-pointer rounded-lg shadow-sm hover:shadow-md">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-gray-600 mr-3 rounded-full"></div>
                            <span className="font-bold text-gray-800">{platform}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-8 shadow-xl rounded-xl">
                      <h5 className="font-black text-gray-900 mb-6 tracking-wider flex items-center text-xl">
                        <span className="w-4 h-4 bg-gray-600 mr-4 rounded-full"></span>
                        COMMUNICATION TOOLS
                      </h5>
                      <div className="space-y-4">
                        {['Zoom Groups', 'Internal Tracker Sheets', 'Candidate Info Page', 'Portal Allocation Sheet'].map((tool, i) => (
                          <div key={i} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 transition-all duration-300 cursor-pointer rounded-lg shadow-sm hover:shadow-md">
                            <div className="w-3 h-3 bg-gradient-to-r from-gray-500 to-blue-600 mr-3 rounded-full"></div>
                            <span className="font-bold text-gray-800">{tool}</span>
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default VDartDeliveryHomepage;