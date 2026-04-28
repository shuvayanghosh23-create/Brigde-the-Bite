import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Heart, Users, Store, MapPin, ArrowRight, TrendingUp, Clock, Menu, X,
  Leaf, Shield, Zap, Globe, Phone, Mail, CheckCircle, Star, Target, Eye,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { platformStats, mockDonations } from '../data/mockData';
import { getDonations } from '../utils/storage';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import Logo from '../components/Logo';
import DemoCredentials from '../components/DemoCredentials';

export default function Landing() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState(mockDonations);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const storedDonations = getDonations();
    if (storedDonations.length > 0) {
      setDonations(storedDonations);
    }

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation Bar */}
      <motion.nav
        className={`sticky top-0 z-50 transition-all ${
          scrollY > 50
            ? 'bg-white/95 backdrop-blur-lg shadow-md'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo size="md" />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-slate-700 hover:text-green-600 transition-colors">
                Home
              </a>
              <a href="#about" className="text-slate-700 hover:text-green-600 transition-colors">
                Who We Are
              </a>
              <a href="#how-it-works" className="text-slate-700 hover:text-green-600 transition-colors">
                How It Works
              </a>
              <a href="#contact" className="text-slate-700 hover:text-green-600 transition-colors">
                Contact
              </a>
              <div className="relative group">
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  Login
                </Button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/login?role=restaurant"
                    className="block px-4 py-3 hover:bg-green-50 rounded-t-lg transition-colors"
                  >
                    Restaurant Login
                  </Link>
                  <Link
                    to="/login?role=ngo"
                    className="block px-4 py-3 hover:bg-green-50 transition-colors"
                  >
                    NGO Login
                  </Link>
                  <Link
                    to="/login?role=admin"
                    className="block px-4 py-3 hover:bg-green-50 rounded-b-lg transition-colors"
                  >
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col gap-4">
                <a href="#home" className="text-slate-700">Home</a>
                <a href="#about" className="text-slate-700">Who We Are</a>
                <a href="#how-it-works" className="text-slate-700">How It Works</a>
                <a href="#contact" className="text-slate-700">Contact</a>
                <Link to="/login?role=restaurant" className="text-slate-700">Restaurant Login</Link>
                <Link to="/login?role=ngo" className="text-slate-700">NGO Login</Link>
                <Link to="/login?role=admin" className="text-slate-700">Admin Login</Link>
              </div>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-orange-50 to-white opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm mb-6">
                <Leaf size={16} />
                Zero Food Waste Initiative • Bangalore, India
              </div>
              <h1 className="text-5xl lg:text-6xl mb-6 text-slate-900">
                Connecting Extra Food to{' '}
                <span className="text-green-600">Those Who Need It</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                BridgeTheBite matches restaurants with surplus food to nearby NGOs within a 5 km radius,
                ensuring no meal goes to waste while feeding those in need.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-lg px-8"
                  onClick={() => navigate('/signup?role=restaurant')}
                >
                  Donate Food <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 text-lg px-8"
                  onClick={() => navigate('/signup?role=ngo')}
                >
                  Request Food
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="NGOs feeding people"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl text-slate-900">{platformStats.totalMeals.toLocaleString()}</p>
                    <p className="text-slate-600 text-sm">Meals Donated</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Donation Feed */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-orange-600 overflow-hidden">
        <div className="mb-4 text-center">
          <h3 className="text-2xl text-white inline-flex items-center gap-2">
            <Clock size={24} /> Live Donations
          </h3>
        </div>
        <div className="relative">
          <motion.div
            className="flex gap-6"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...donations, ...donations, ...donations].map((donation, index) => (
              <div
                key={`${donation.id}-${index}`}
                className="flex-shrink-0 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg min-w-[300px]"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Store className="text-green-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900">
                      <span className="font-semibold">{donation.restaurantName}</span> donated
                    </p>
                    <p className="text-green-600">{donation.foodName}</p>
                    {donation.ngoName && (
                      <p className="text-sm text-slate-600">to {donation.ngoName}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(donation.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Impact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4 text-slate-900">
              Making a Real <span className="text-green-600">Social Impact</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Together, we're building a sustainable future where no food goes to waste
              and every person has access to nutritious meals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Heart, value: platformStats.totalMeals.toLocaleString(), label: 'Meals Donated', color: 'text-green-600', bg: 'bg-green-100' },
              { icon: Users, value: platformStats.activeNGOs, label: 'Active NGOs', color: 'text-orange-600', bg: 'bg-orange-100' },
              { icon: Store, value: platformStats.restaurantsJoined, label: 'Restaurants Joined', color: 'text-blue-600', bg: 'bg-blue-100' },
              { icon: TrendingUp, value: platformStats.mealsThisMonth.toLocaleString(), label: 'This Month', color: 'text-purple-600', bg: 'bg-purple-100' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`${stat.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <stat.icon className={stat.color} size={32} />
                    </div>
                    <p className="text-3xl text-slate-900 mb-2">{stat.value}</p>
                    <p className="text-slate-600">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO WE ARE ─────────────────────────────────── */}
      <section id="about" className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm mb-4">
              <Heart size={16} />
              Our Story
            </div>
            <h2 className="text-4xl mb-6">
              Who We Are
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              BridgeTheBite is a social impact technology platform born out of the urgency to tackle
              two of India's most pressing challenges — food waste and hunger — simultaneously.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Target size={24} className="text-green-400" />
                  </div>
                  <h3 className="text-xl text-white">Our Mission</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  To create a seamless, real-time bridge between food surplus and food scarcity — enabling
                  restaurants, hotels, and catering services to donate perishable food to verified NGOs and
                  community kitchens within a 5 km radius before it goes to waste.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <Eye size={24} className="text-orange-400" />
                  </div>
                  <h3 className="text-xl text-white">Our Vision</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  A hunger-free India where every surplus meal reaches a needy plate. We envision a
                  nationwide network of 10,000+ restaurants and 2,000+ NGOs working in harmony,
                  eliminating preventable food waste by 2028.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Globe size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl text-white">Our Impact</h3>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Since our launch, we have facilitated over 15,420 meal donations across Bangalore,
                  partnered with 127 active NGOs serving homeless shelters, orphanages, and old-age homes,
                  and helped 89 restaurants reduce their environmental footprint significantly.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {[
                {
                  icon: Zap,
                  color: 'text-yellow-400',
                  bg: 'bg-yellow-500/20',
                  title: 'Real-Time Matching',
                  desc: 'Our AI-powered location matching instantly connects your surplus food with the nearest eligible NGO within 5 km, reducing pickup time to under 30 minutes.',
                },
                {
                  icon: Shield,
                  color: 'text-green-400',
                  bg: 'bg-green-500/20',
                  title: 'Verified Network',
                  desc: 'Every restaurant is FSSAI-verified and every NGO holds a valid Darpan registration. Our admin team manually verifies each partner before approval.',
                },
                {
                  icon: CheckCircle,
                  color: 'text-blue-400',
                  bg: 'bg-blue-500/20',
                  title: 'Full Transparency',
                  desc: 'Track every donation from listing to delivery with photo confirmation, chat logs, and completion proofs — full accountability for all parties.',
                },
                {
                  icon: Star,
                  color: 'text-orange-400',
                  bg: 'bg-orange-500/20',
                  title: 'Community Ratings',
                  desc: 'A two-way rating system ensures accountability. Restaurants and NGOs rate each other, creating trust and encouraging responsible participation.',
                },
                {
                  icon: Leaf,
                  color: 'text-emerald-400',
                  bg: 'bg-emerald-500/20',
                  title: 'Environmental Commitment',
                  desc: 'Every donation prevents methane emissions from food decomposition. We estimate each kg of food saved prevents 2.5 kg of CO₂ equivalent emissions.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className={`${item.bg} p-2 rounded-lg flex-shrink-0`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div>
                    <h4 className="text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Team / Why Us */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Food Waste Problem',
                stat: '40%',
                desc: 'of all food produced in India is wasted, worth ₹92,000 crore annually — while 190 million Indians remain undernourished.',
                color: 'from-red-500 to-orange-500',
              },
              {
                name: 'Our Solution',
                stat: '5 km',
                desc: 'hyper-local radius matching ensures food reaches beneficiaries while still fresh, hot, and nutritious — within the safety window.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                name: 'Our Goal by 2028',
                stat: '1M+',
                desc: 'meals donated annually through our platform, reducing urban food waste by 15% across 10 major Indian cities.',
                color: 'from-blue-500 to-purple-500',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className={`text-4xl mb-2 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.stat}
                </div>
                <h4 className="text-white mb-2">{card.name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4 text-slate-900">
              How <span className="text-green-600">BridgeTheBite</span> Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A simple three-step process that connects surplus food to hungry plates in under 30 minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Store,
                color: 'green',
                title: 'Restaurant Lists Surplus',
                desc: 'Restaurants post available surplus food with quantity, expiry time, and pickup location. Takes less than 2 minutes.',
                detail: 'FSSAI-registered | Real-time listing | Photo upload',
              },
              {
                step: '02',
                icon: MapPin,
                color: 'orange',
                title: 'NGO Gets Matched',
                desc: 'Nearby verified NGOs within 5 km receive instant notifications and can browse, accept, and coordinate pickup.',
                detail: 'GPS matching | Instant alerts | Chat coordination',
              },
              {
                step: '03',
                icon: Heart,
                color: 'blue',
                title: 'Food Reaches Beneficiaries',
                desc: 'NGO picks up food, marks collection complete with a photo, and the donation is logged with full transparency.',
                detail: 'Photo proof | Rating system | Impact tracking',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <Card className="h-full hover:shadow-2xl transition-all group">
                  <CardContent className="pt-8 pb-6">
                    <div className="text-6xl text-slate-100 mb-4 leading-none">{item.step}</div>
                    <div className={`w-14 h-14 rounded-2xl bg-${item.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className={`text-${item.color}-600`} size={28} />
                    </div>
                    <h3 className="text-xl mb-3 text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
                    <div className="text-xs text-slate-400 border-t border-slate-100 pt-3">{item.detail}</div>
                  </CardContent>
                </Card>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 z-10 text-slate-300">
                    <ArrowRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started / Login Entry */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl text-center mb-12 text-slate-900">Get Started Today</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Restaurant',
                description: 'Donate surplus food and track your social impact',
                icon: Store,
                color: 'green',
                role: 'restaurant',
                features: ['Post donations in 2 min', 'Track in real-time', 'Build community trust'],
              },
              {
                title: 'NGO',
                description: 'Request food donations for those in need',
                icon: Users,
                color: 'orange',
                role: 'ngo',
                features: ['Browse nearby food', 'Accept with one click', 'Coordinate via chat'],
              },
              {
                title: 'Admin',
                description: 'Manage the platform and monitor activities',
                icon: Shield,
                color: 'blue',
                role: 'admin',
                features: ['Verify partners', 'Monitor donations', 'Resolve support tickets'],
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer group h-full">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className={`bg-${card.color}-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <card.icon className={`text-${card.color}-600`} size={40} />
                    </div>
                    <h3 className="text-2xl mb-3 text-slate-900">{card.title}</h3>
                    <p className="text-slate-600 mb-4">{card.description}</p>
                    <ul className="space-y-2 mb-6 text-left">
                      {card.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle size={14} className={`text-${card.color}-600 flex-shrink-0`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full bg-${card.color}-600 hover:bg-${card.color}-700`}
                      onClick={() => navigate(`/login?role=${card.role}`)}
                    >
                      Login / Sign Up
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <DemoCredentials />
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Logo size="md" inverted />
              <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                India's leading surplus food redistribution platform, connecting restaurants with NGOs
                to eliminate food waste and fight hunger — one meal at a time.
              </p>
              <div className="flex gap-3 mt-4">
                {['F', 'T', 'I', 'L'].map((s, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs hover:bg-green-600 transition-colors cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white mb-4 font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#home" className="hover:text-green-400 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-green-400 transition-colors">Who We Are</a></li>
                <li><a href="#how-it-works" className="hover:text-green-400 transition-colors">How It Works</a></li>
                <li><Link to="/login?role=restaurant" className="hover:text-green-400 transition-colors">Restaurant Portal</Link></li>
                <li><Link to="/login?role=ngo" className="hover:text-green-400 transition-colors">NGO Portal</Link></li>
                <li><Link to="/login?role=admin" className="hover:text-green-400 transition-colors">Admin Panel</Link></li>
              </ul>
            </div>

            {/* Legal & Compliance */}
            <div>
              <h4 className="text-white mb-4 font-semibold">Legal & Compliance</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Food Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">NGO Verification Policy</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">FSSAI Compliance</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Contact Support */}
            <div>
              <h4 className="text-white mb-4 font-semibold">Contact & Support</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-slate-400">
                  <Mail size={14} className="text-green-400" />
                  <span>support@bridgethebite.org</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <Phone size={14} className="text-green-400" />
                  <span>+91 1800 123 4567 (Toll Free)</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <MapPin size={14} className="text-green-400" />
                  <span>BridgeTheBite HQ, Koramangala, Bangalore — 560095</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-xs text-green-400 mb-1 font-semibold">Support Hours</p>
                <p className="text-xs text-slate-400">Mon – Sat: 8:00 AM – 8:00 PM IST</p>
                <p className="text-xs text-slate-400">Emergency Food Hotline: 24 × 7</p>
              </div>
            </div>
          </div>

          {/* Partners / Certifications */}
          <div className="border-t border-slate-800 pt-8 pb-6">
            <p className="text-center text-xs text-slate-500 mb-4">Registered With & Recognised By</p>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
              {[
                'FSSAI Certified Platform',
                'Niti Aayog NGO Darpan Partner',
                'Ministry of Food Processing Industries',
                'Startup India Recognised',
                'ISO 27001 Certified',
              ].map((cert, i) => (
                <span key={i} className="flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>&copy; 2026 BridgeTheBite Technologies Pvt. Ltd. All rights reserved.</p>
            <p>Made with ❤️ for social good in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
