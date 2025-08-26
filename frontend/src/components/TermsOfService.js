import React from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-4xl mx-auto px-6 ${className}`}>{children}</div>
);

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    <div className="text-slate-300 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const TermsOfService = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 1, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/70 backdrop-blur-sm border-b border-slate-700/70">
        <Container className="py-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-indigo-400 hover:text-cyan-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
              <p className="text-slate-300">TrustML.Studio Consulting Services</p>
            </div>
          </div>
          
          <p className="text-sm text-slate-400">Last updated: {lastUpdated}</p>
        </Container>
      </header>

      {/* Content */}
      <main className="py-12">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Section title="1. Agreement to Terms">
              <p>
                By accessing and using TrustML.Studio's consulting services ("Services"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, then you may not access the Services.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use the Services provided by TrustML.Studio, 
                a consulting practice specializing in AI fraud risk and trust & safety systems.
              </p>
            </Section>

            <Section title="2. Description of Services">
              <p>
                TrustML.Studio provides consulting services in the following areas:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>AI fraud risk strategy and assessment</li>
                <li>Trust & safety program development</li>
                <li>Machine learning risk intelligence systems</li>
                <li>Fractional leadership and advisory services</li>
                <li>Risk management consulting and implementation</li>
              </ul>
              <p>
                Services are provided on a consulting basis and may include strategy development, system design, 
                implementation guidance, and ongoing advisory support.
              </p>
            </Section>

            <Section title="3. Consulting Engagement">
              <p>
                All consulting engagements are subject to separate written agreements that will specify:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Scope of work and deliverables</li>
                <li>Timeline and milestones</li>
                <li>Compensation and payment terms</li>
                <li>Confidentiality and intellectual property provisions</li>
                <li>Termination conditions</li>
              </ul>
              <p>
                These Terms of Service govern the general relationship, while specific project terms will be outlined in individual consulting agreements.
              </p>
            </Section>

            <Section title="4. Intellectual Property Rights">
              <p>
                The Services and their original content, features, and functionality are and will remain the exclusive property of TrustML.Studio. 
                The Services are protected by copyright, trademark, and other laws.
              </p>
              <p>
                Client-specific work products and deliverables created during consulting engagements will be governed by the intellectual property 
                provisions specified in the individual consulting agreement.
              </p>
            </Section>

            <Section title="5. Confidentiality">
              <p>
                TrustML.Studio acknowledges that during the course of providing Services, confidential information may be disclosed. 
                We commit to maintaining the confidentiality of all client information and will not disclose such information to third parties 
                without explicit written consent.
              </p>
              <p>
                Detailed confidentiality terms, including definitions of confidential information and permitted disclosures, 
                will be specified in individual consulting agreements.
              </p>
            </Section>

            <Section title="6. Limitation of Liability">
              <p>
                In no event shall TrustML.Studio, nor its principals, be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from your use of the Services.
              </p>
              <p>
                Our total liability for any claims arising from or related to the Services shall not exceed the amount paid by you 
                for the specific Services giving rise to the claim during the twelve (12) months preceding the claim.
              </p>
            </Section>

            <Section title="7. Professional Standards">
              <p>
                TrustML.Studio maintains high professional standards and will provide Services with the care and skill ordinarily 
                exercised by members of the consulting profession. However, we do not guarantee specific outcomes or results from our consulting services.
              </p>
              <p>
                All recommendations and advice are based on information provided by the client and industry best practices at the time of engagement. 
                Implementation of recommendations remains the client's responsibility.
              </p>
            </Section>

            <Section title="8. Termination">
              <p>
                Either party may terminate consulting engagements in accordance with the terms specified in the individual consulting agreement. 
                These Terms of Service remain in effect until terminated by either party.
              </p>
              <p>
                Upon termination, all obligations of confidentiality and intellectual property protection shall survive and continue in effect.
              </p>
            </Section>

            <Section title="9. Governing Law">
              <p>
                These Terms shall be interpreted and governed by the laws of the State of California, without regard to its conflict of law provisions. 
                Any disputes arising from these Terms or the Services shall be resolved through binding arbitration in Seattle, California.
              </p>
            </Section>

            <Section title="10. Changes to Terms">
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p>
                What constitutes a material change will be determined at our sole discretion. 
                By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </Section>

            <Section title="11. Contact Information">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/70 p-4 rounded-lg">
                <p className="text-white"><strong>TrustML.Studio</strong></p>
                <p className="text-slate-300">Email: <a href="mailto:michael@trustml.studio" className="text-indigo-400 hover:text-cyan-400 transition-colors">michael@trustml.studio</a></p>
                <p className="text-slate-300">Location: Seattle, WA</p>
              </div>
            </Section>
          </motion.div>
        </Container>
      </main>
    </div>
  );
};

export default TermsOfService;