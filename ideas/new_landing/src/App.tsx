import React from 'react';
import { ShieldIcon, ZapIcon, BrainCircuitIcon, BarChartIcon, CheckCircleIcon, ArrowRightIcon, TrendingUpIcon, ShieldAlertIcon, ShieldCheckIcon, LineChartIcon, UserCheckIcon } from 'lucide-react';
export function App() {
  return <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white text-base leading-[25.6px] font-[Inter,-apple-system,system-ui,Segoe_UI,Roboto,sans-serif] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="transform-none">
              <div className="mb-6 inline-flex items-center bg-indigo-900/40 text-sm leading-5 font-medium text-indigo-300 rounded-full px-4 py-2 border border-indigo-700/50 backdrop-blur-sm">
                <ZapIcon className="h-4 w-4" />
                <span className="ml-2">
                  AI-Powered Fraud Defense | Real-Time Protection
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white m-0 mb-6">
                Outpace Fraud with
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent block mt-2">
                  Adaptive AI Defense
                </span>
              </h1>
              <p className="text-xl leading-[32.5px] text-slate-300 m-0 mb-8">
                In today's rapidly evolving threat landscape, traditional fraud
                prevention falls behind. Our AI systems adapt in real-time to
                adversarial challenges, providing continuous protection that
                scales from startup to enterprise.
              </p>
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center transition-all duration-200 rounded-lg py-4 px-8 text-lg font-medium leading-7 text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 shadow-lg shadow-indigo-500/30 group">
                  Schedule AI Risk Assessment
                  <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="flex items-center justify-center transition-all duration-200 rounded-lg py-4 px-8 text-lg font-medium leading-7 text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-700/50 backdrop-blur-sm">
                  <BrainCircuitIcon className="mr-2 h-5 w-5" />
                  Explore ML Solutions
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm leading-5">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-cyan-400" />
                  <span className="ml-2 text-slate-200">
                    Adaptive ML algorithms
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-cyan-400" />
                  <span className="ml-2 text-slate-200">
                    Real-time threat detection
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-cyan-400" />
                  <span className="ml-2 text-slate-200">
                    95% faster response time
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-cyan-400" />
                  <span className="ml-2 text-slate-200">
                    Continuous model training
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative transform-none">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-cyan-600/20 rounded-full filter blur-3xl"></div>
            <div className="relative bg-slate-800/70 backdrop-blur-sm shadow-2xl border border-slate-700/70 rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/30 to-transparent rounded-full filter blur-xl transform translate-x-10 -translate-y-10"></div>
              <div className="grid grid-cols-2 gap-5 my-2">
                <div className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 rounded-lg p-5 border border-indigo-700/30 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 opacity-10">
                    <ShieldCheckIcon className="h-20 w-20" />
                  </div>
                  <div className="text-xl leading-7 font-bold text-indigo-300 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    Trust & Safety
                  </div>
                  <div className="text-sm leading-5 text-indigo-200 mt-2">
                    End-to-end program design and execution at scale
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 rounded-lg p-5 border border-cyan-700/30 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 opacity-10">
                    <LineChartIcon className="h-20 w-20" />
                  </div>
                  <div className="text-xl leading-7 font-bold text-cyan-300 flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2" />
                    Risk Intelligence
                  </div>
                  <div className="text-sm leading-5 text-cyan-200 mt-2">
                    Data-driven approaches across global platforms
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-lg p-5 border border-blue-700/30 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 opacity-10">
                    <UserCheckIcon className="h-20 w-20" />
                  </div>
                  <div className="text-xl leading-7 font-bold text-blue-300 flex items-center">
                    <UserCheckIcon className="h-5 w-5 mr-2" />
                    Identity Systems
                  </div>
                  <div className="text-sm leading-5 text-blue-200 mt-2">
                    Advanced authentication and verification
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-lg p-5 border border-purple-700/30 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 opacity-10">
                    <BrainCircuitIcon className="h-20 w-20" />
                  </div>
                  <div className="text-xl leading-7 font-bold text-purple-300 flex items-center">
                    <BrainCircuitIcon className="h-5 w-5 mr-2" />
                    AI & ML
                  </div>
                  <div className="text-sm leading-5 text-purple-200 mt-2">
                    From rule-based to agentic AI systems
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}