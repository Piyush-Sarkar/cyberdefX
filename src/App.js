import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Threats from './pages/Threats';
import Alerts from './pages/Alerts';
import Vulnerabilities from './pages/Vulnerabilities';
import Assets from './pages/Assets';
import ThreatMap from './pages/ThreatMap';
import Reports from './pages/Reports';
import AIAssistant from './pages/AIAssistant';
import Settings from './pages/Settings';

// Function to get the effective theme based on user preference
const getEffectiveTheme = (theme) => {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#00d4ff';
  });
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      fullName: 'Admin User',
      email: 'admin@hyperdefense.io',
      jobTitle: 'Security Analyst',
      department: 'Security Operations',
      timezone: 'UTC-05:00 Eastern Time',
      avatar: null
    };
  });

  // Save user profile to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Apply theme to document
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(theme);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply accent color to document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', accentColor);
    root.style.setProperty('--accent-cyan', accentColor);
    root.style.setProperty('--gradient-cyber', `linear-gradient(135deg, ${accentColor} 0%, #8b5cf6 100%)`);
    root.style.setProperty('--shadow-glow', `0 0 20px ${accentColor}`);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  // Listen for system theme changes when 'system' is selected
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Function to apply the current system theme
      const applySystemTheme = () => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      };
      
      // Apply immediately
      applySystemTheme();
      
      // Listen for changes via media query
      const handleChange = () => applySystemTheme();
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <Router>
      <div className="app">
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} userProfile={userProfile} />
        <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/vulnerabilities" element={<Vulnerabilities />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/threat-map" element={<ThreatMap />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} accentColor={accentColor} setAccentColor={setAccentColor} userProfile={userProfile} setUserProfile={setUserProfile} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
