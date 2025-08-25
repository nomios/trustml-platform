import React from 'react';
import { Heart, Briefcase, Target, Flower, TrendingUp, Shield, Globe, Users, Star, ArrowRight } from 'lucide-react';
export function TrustMLStudio() {
  return <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white font-['Inter',_-apple-system,_'system-ui',_'Segoe_UI',_Roboto,_sans-serif] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* About Section */}
        <div className="mb-20 text-center">
          <div>
            <div className="mb-6 inline-flex items-center bg-indigo-700/50 text-sm leading-5 font-medium text-indigo-300 rounded-full py-2 px-4">
              <Heart className="w-4 h-4" />
              <span className="ml-2">About TrustML.Studio</span>
            </div>
            <h2 className="text-5xl font-bold leading-[48px] text-white m-0 mb-6">
              25+ Years Building
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent ml-2">
                Trusted Systems
              </span>
            </h2>
            <p className="max-w-[768px] text-xl leading-7 text-slate-300 mx-auto my-0">
              TrustML.Studio is an AI fraud risk consulting firm led by Michael
              Pezely, a senior Trust & Safety and Risk Strategy Leader with 25+
              years architecting global fraud prevention, policy enforcement,
              and platform integrity programs at companies like eBay, OfferUp,
              and Signifyd.
            </p>
          </div>
        </div>
        {/* What Drives My Work Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="text-4xl leading-9 font-bold text-white mb-4">
              What Drives My Work
            </h3>
            <p className="max-w-[672px] text-slate-300 mx-auto my-0">
              The principles and experiences that guide my approach to building
              trust and safety systems.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/70 text-center shadow-2xl backdrop-blur-sm transition-all duration-300 border border-slate-700/70 rounded-xl p-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl leading-7 font-bold text-white mb-3">
                Proven Results
              </h3>
              <p className="leading-[26px] text-slate-300 m-0">
                Track record of building systems that scale to billions of
                decisions and achieve measurable impact on platform safety.
              </p>
            </div>
            <div className="bg-slate-800/70 text-center shadow-2xl backdrop-blur-sm transition-all duration-300 border border-slate-700/70 rounded-xl p-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full">
                <Flower className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl leading-7 font-bold text-white mb-3">
                Innovation Leader
              </h3>
              <p className="leading-[26px] text-slate-300 m-0">
                Early adopter of AI/ML in risk detection, staying ahead of
                emerging threats with cutting-edge technology.
              </p>
            </div>
            <div className="bg-slate-800/70 text-center shadow-2xl backdrop-blur-sm transition-all duration-300 border border-slate-700/70 rounded-xl p-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl leading-7 font-bold text-white mb-3">
                Team Builder
              </h3>
              <p className="leading-[26px] text-slate-300 m-0">
                Experience scaling teams from individual contributor to 50+
                person organizations with clear operational frameworks.
              </p>
            </div>
            <div className="bg-slate-800/70 text-center shadow-2xl backdrop-blur-sm transition-all duration-300 border border-slate-700/70 rounded-xl p-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-full">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl leading-7 font-bold text-white mb-3">
                Enterprise Scale
              </h3>
              <p className="leading-[26px] text-slate-300 m-0">
                Built and operated trust systems for global platforms serving
                millions of users across diverse markets.
              </p>
            </div>
          </div>
        </div>
        {/* Career Milestones Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="text-4xl leading-9 font-bold text-white mb-4">
              Career Milestones
            </h3>
            <p className="max-w-[672px] text-slate-300 mx-auto my-0">
              Key moments that shaped my expertise in trust, safety, and risk
              intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-indigo-600 rounded-full">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="mb-2 flex items-center">
                  <span className="bg-indigo-700/50 text-sm leading-5 font-bold text-indigo-300 rounded-full px-3 py-1">
                    1999
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Joined eBay Risk Management
                </h3>
                <p className="text-sm leading-5 text-slate-400 m-0">
                  Started building foundational trust enforcement systems for
                  global marketplace.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-indigo-600 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="mb-2 flex items-center">
                  <span className="bg-indigo-700/50 text-sm leading-5 font-bold text-indigo-300 rounded-full px-3 py-1">
                    2015
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Led OfferUp Trust & Safety
                </h3>
                <p className="text-sm leading-5 text-slate-400 m-0">
                  Built comprehensive T&S program from ground up for
                  fast-growing C2C marketplace.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-indigo-600 rounded-full">
                <Flower className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="mb-2 flex items-center">
                  <span className="bg-indigo-700/50 text-sm leading-5 font-bold text-indigo-300 rounded-full px-3 py-1">
                    2021
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Signifyd Risk Intelligence
                </h3>
                <p className="text-sm leading-5 text-slate-400 m-0">
                  Led transformation to AI-powered risk intelligence supporting
                  10,000+ merchants.
                </p>
              </div>
            </div>
            <div className="flex items-start bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-indigo-600 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <div className="mb-2 flex items-center">
                  <span className="bg-indigo-700/50 text-sm leading-5 font-bold text-indigo-300 rounded-full px-3 py-1">
                    2025
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  Independent Consulting
                </h3>
                <p className="text-sm leading-5 text-slate-400 m-0">
                  Started consulting practice focused on agentic AI and risk
                  intelligence systems.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Professional Journey Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h3 className="text-4xl leading-9 font-bold text-white mb-4">
              Professional Journey
            </h3>
            <p className="max-w-[672px] text-slate-300 mx-auto my-0">
              Career progression from building foundational systems at eBay to
              leading AI-powered risk intelligence and now consulting on
              cutting-edge agentic systems.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start bg-slate-800/70 border border-indigo-700/50 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-indigo-600 rounded-full">
                <Flower className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow flex-shrink basis-0 ml-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg leading-7 font-bold text-white m-0">
                    Fravity (Agentic Copilot)
                  </h3>
                  <span className="text-sm leading-5 text-slate-400">
                    July 2025 – Present
                  </span>
                </div>
                <div className="mb-2 font-medium text-indigo-300">
                  Independent Consultant{' '}
                  <span className="ml-2 bg-indigo-700/50 text-xs leading-4 text-indigo-300 rounded-full px-2 py-1">
                    Current
                  </span>
                </div>
                <p className="text-sm leading-5 text-slate-300 m-0">
                  Advising early-stage startup on agentic fraud intelligence
                  platform architecture
                </p>
              </div>
            </div>
            <div className="flex items-start bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-indigo-600 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow flex-shrink basis-0 ml-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg leading-7 font-bold text-white m-0">
                    Signifyd
                  </h3>
                  <span className="text-sm leading-5 text-slate-400">
                    Feb 2023 - June 2025
                  </span>
                </div>
                <div className="mb-2 font-medium text-slate-300">
                  Senior Director Risk Intelligence{' '}
                </div>
                <p className="text-sm leading-5 text-slate-300 m-0">
                  Built and scaled AI-powered risk intelligence team, improved
                  productivity 50%
                </p>
              </div>
            </div>
            <div className="flex items-start bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center bg-indigo-600 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="flex-grow flex-shrink basis-0 ml-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg leading-7 font-bold text-white m-0">
                    Signifyd
                  </h3>
                  <span className="text-sm leading-5 text-slate-400">
                    Sept 2021 - Jan 2023
                  </span>
                </div>
                <div className="mb-2 font-medium text-slate-300">
                  Director Risk Intelligence{' '}
                </div>
                <p className="text-sm leading-5 text-slate-300 m-0">
                  Established KPI frameworks, accelerated fraud detection speed
                  by 60%
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Our Approach Section */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center bg-indigo-600 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl leading-8 font-bold text-white mb-4">
              Our Approach
            </h3>
            <p className="leading-[26px] text-slate-300 mb-4">
              At TrustML.Studio, we believe that effective trust and safety is
              built on three pillars: deep technical expertise, strategic
              business alignment, and human-centered design. Our approach
              combines cutting-edge AI with practical operational frameworks.
            </p>
            <p className="leading-[26px] text-slate-300 m-0">
              Whether building from scratch or optimizing existing systems, we
              focus on scalable solutions that grow with your business while
              maintaining the human oversight necessary for complex trust
              decisions.
            </p>
          </div>
          <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center bg-indigo-600 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl leading-8 font-bold text-white mb-4">
              Current Focus
            </h3>
            <p className="leading-[26px] text-slate-300 mb-4">
              TrustML.Studio is particularly excited about agentic AI systems
              that empower analysts and operators with autonomous agents for
              risk detection and policy enforcement. These systems represent the
              next evolution in trust and safety technology.
            </p>
            <p className="leading-[26px] text-slate-300 m-0">
              Our recent work includes designing AI-native fraud intelligence
              platforms and developing Model Context Protocols that enable
              non-technical users to leverage powerful AI capabilities.
            </p>
          </div>
        </div>
        {/* Stats Section */}
        <div className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-2 text-4xl leading-[48px] font-bold text-white">
              1999
            </div>
            <div className="text-slate-300">Started at eBay</div>
          </div>
          <div className="text-center bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-2 text-4xl leading-[48px] font-bold text-white">
              25+
            </div>
            <div className="text-slate-300">Years Experience</div>
          </div>
          <div className="text-center bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-2 text-4xl leading-[48px] font-bold text-white">
              4
            </div>
            <div className="text-slate-300">Major Platforms</div>
          </div>
          <div className="text-center bg-slate-800/70 border border-slate-700/70 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
            <div className="mb-2 text-4xl leading-[48px] font-bold text-white">
              1B+
            </div>
            <div className="text-slate-300">Decisions Built</div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-center text-white rounded-2xl p-12 shadow-lg shadow-indigo-500/30">
          <h3 className="text-3xl leading-9 font-bold mb-4">
            Let's Work Together
          </h3>
          <p className="max-w-[672px] text-white mx-auto mb-8 my-0">
            Ready to discuss how TrustML.Studio's 25+ years of experience can
            help accelerate your trust and safety initiatives? We'd love to hear
            about your challenges and explore how we can work together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="flex items-center justify-center text-white bg-slate-900 shadow-lg shadow-indigo-500/30 transition-all duration-200 rounded-lg px-8 py-4 text-lg font-medium">
              Schedule Consultation
            </button>
            <button className="flex items-center justify-center text-white bg-transparent border-2 border-white transition-all duration-200 rounded-lg px-8 py-4 text-lg font-medium">
              Download Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}