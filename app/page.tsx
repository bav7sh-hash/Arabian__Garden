import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f8f9fa] selection:bg-[#d4af37] selection:text-[#050505]">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo.jpg" alt="Madurai Military Hotel" className="h-12 rounded-lg shadow-lg border border-white/10" />
            <span className="font-serif text-2xl font-bold tracking-tight">Savoria</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard/kitchen"
              className="text-sm font-medium text-gray-400 hover:text-[#d4af37] transition-all"
            >
              Kitchen Dashboard
            </Link>
            <Link
              href="/menu?table=1"
              className="text-sm font-medium text-gray-400 hover:text-[#d4af37] transition-all"
            >
              Customer Menu
            </Link>
            <Link
              href="/dashboard/login"
              className="text-sm font-medium text-gray-400 hover:text-[#d4af37] transition-all"
            >
              Staff login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-24 relative">
        <div className="text-center mb-20">
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-8 tracking-tight">
            Savoria
            <span className="block text-[#d4af37] mt-2">Restaurant System</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A premium, end-to-end digital solution for modern dining. 
            Real-time synchronization across kitchen, menu, and admin.
          </p>
        </div>

        {/* Interface Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Kitchen Dashboard */}
          <Link
            href="/dashboard/kitchen"
            className="group relative bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 hover:border-[#d4af37]/50 transition-all hover:-translate-y-2 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-[#3b82f6]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#3b82f6]/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h3 className="font-serif text-3xl font-bold mb-4">Kitchen Dashboard</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Tablet-optimized control center for staff with instant order updates and status workflow.
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                Real-time order cards
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                Kitchen workflow automation
              </li>
            </ul>
            <div className="absolute bottom-10 right-10 text-[#d4af37] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Customer Menu */}
          <Link
            href="/menu?table=1"
            className="group relative bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 hover:border-[#d4af37]/50 transition-all hover:-translate-y-2 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#d4af37]/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                <path d="M3 3h18v18H3z" />
                <path d="M3 9h18" />
                <path d="M9 3v18" />
              </svg>
            </div>
            <h3 className="font-serif text-3xl font-bold mb-4">Customer Menu</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Mobile-first experience with smart table detection, category filters, and smooth cart system.
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                Smart QR Table detection
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#d4af37]/10 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                Animated cart functionality
              </li>
            </ul>
            <div className="absolute bottom-10 right-10 text-[#d4af37] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Admin Panel */}
          <Link
            href="/dashboard/admin"
            className="group relative bg-[#0f0f0f] border border-white/5 rounded-[2rem] p-10 hover:border-[#d4af37]/50 transition-all hover:-translate-y-2 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center mb-8 border border-[#22c55e]/20">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <h3 className="font-serif text-3xl font-bold mb-4">Admin Panel</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Comprehensive dashboard for managing menu, offers, and advanced sales analytics.
            </p>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                Menu & Offer management
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                CSV Sales Reports
              </li>
            </ul>
            <div className="absolute bottom-10 right-10 text-[#d4af37] translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="border-t border-white/5 pt-20">
          <h2 className="font-serif text-4xl font-bold text-center mb-16">System Features</h2>
          <div className="grid md:grid-cols-4 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Responsive Design</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Seamless experience across mobile, tablet, and desktop devices.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Cloud Ready</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Firebase Firestore and Realtime Database for secure, scalable sync.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Real-time Sync</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Instant order synchronization across all interfaces via websockets.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#d4af37]/20 group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Analytics</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Detailed sales reports and automated analytics for business growth.</p>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-24 bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4af37]/5 to-transparent"></div>
          <div className="relative">
            <h3 className="font-serif text-2xl font-bold mb-6">Staff demo credentials</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="bg-[#050505] border border-white/5 px-6 py-4 rounded-2xl">
                <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">Username</span>
                <code className="text-[#d4af37] font-medium">admin</code>
              </div>
              <div className="bg-[#050505] border border-white/5 px-6 py-4 rounded-2xl">
                <span className="text-gray-500 text-xs uppercase tracking-widest block mb-1">Password</span>
                <code className="text-[#d4af37] font-medium">1234</code>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Kitchen login: username <code className="text-[#d4af37]">kitchen</code>, same password until changed in Firebase.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <img src="/images/logo.jpg" alt="Madurai Military Hotel" className="h-8 rounded-lg shadow-lg" />
            <p className="text-gray-500 text-sm font-medium">
              Savoria - Premium Restaurant Management Solution
            </p>
          </div>
          <div className="flex gap-8 text-gray-500 text-sm">
            <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Support</span>
            <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
