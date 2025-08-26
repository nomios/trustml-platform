import React from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Lock, Eye, Database, UserCheck, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Container = ({ children, className = "" }) => (
  <div className={`max-w-4xl mx-auto px-6 ${className}`}>{children}</div>
);

const Section = ({ title, children, icon: Icon }) => (
  <div className="mb-8">
    <div className="flex items-center space-x-3 mb-4">
      {Icon && (
        <div className="w-8 h-8 bg-indigo-600/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-indigo-700/30">
          <Icon className="w-4 h-4 text-indigo-400" />
        </div>
      )}
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    <div className="text-slate-300 leading-relaxed space-y-4">
      {children}
    </div>
  </div>
);

const PrivacyPolicy = () => {
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
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
              <p className="text-slate-300">TrustML.Studio Data Protection & Privacy</p>
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
            <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">Our Commitment to Privacy</h3>
              <p className="text-slate-300">
                As a consulting practice specializing in trust & safety and fraud prevention, TrustML.Studio understands 
                the critical importance of data privacy and security. We are committed to protecting your personal information 
                and being transparent about our data practices.
              </p>
            </div>

            <Section title="1. Information We Collect" icon={Database}>
              <p>
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Contact us through our website or email</li>
                <li>Schedule a consultation or meeting</li>
                <li>Subscribe to our newsletter or updates</li>
                <li>Engage our consulting services</li>
                <li>Download resources or case studies</li>
              </ul>
              
              <p><strong>Types of information collected may include:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Name and contact information (email, phone, address)</li>
                <li>Company information and job title</li>
                <li>Project requirements and business needs</li>
                <li>Communication preferences</li>
                <li>Technical information about your systems (when relevant to consulting)</li>
              </ul>
            </Section>

            <Section title="2. How We Use Your Information" icon={UserCheck}>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Provide, maintain, and improve our consulting services</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Schedule and conduct consultations and meetings</li>
                <li>Send you technical updates, security alerts, and administrative messages</li>
                <li>Communicate about services, features, surveys, news, updates, and events</li>
                <li>Develop and deliver targeted marketing and advertising</li>
                <li>Analyze usage patterns and improve our website and services</li>
              </ul>
              
              <p>
                <strong>For consulting engagements:</strong> We use your information to understand your business needs, 
                develop appropriate solutions, and deliver consulting services as outlined in our consulting agreements.
              </p>
            </Section>

            <Section title="3. Information Sharing and Disclosure" icon={Eye}>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy:
              </p>
              
              <p><strong>We may share information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>With your consent or at your direction</li>
                <li>With service providers who assist in our operations (subject to confidentiality agreements)</li>
                <li>To comply with legal obligations or respond to lawful requests</li>
                <li>To protect our rights, property, or safety, or that of others</li>
                <li>In connection with a business transaction (merger, acquisition, etc.)</li>
              </ul>
              
              <p>
                <strong>Client Confidentiality:</strong> Information shared during consulting engagements is treated as confidential 
                and is not disclosed to third parties without explicit written consent, except as required by law.
              </p>
            </Section>

            <Section title="4. Data Security" icon={Lock}>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security assessments and updates</li>
                <li>Employee training on data protection practices</li>
                <li>Secure communication channels for sensitive information</li>
              </ul>
              
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to use commercially acceptable means to protect your information, 
                we cannot guarantee its absolute security.
              </p>
            </Section>

            <Section title="5. Data Retention">
              <p>
                We retain personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, 
                unless a longer retention period is required or permitted by law.
              </p>
              
              <p><strong>Retention periods:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Contact inquiries: 2 years from last contact</li>
                <li>Newsletter subscriptions: Until you unsubscribe</li>
                <li>Consulting engagement data: 7 years after engagement completion</li>
                <li>Website analytics: 26 months</li>
              </ul>
            </Section>

            <Section title="6. Your Rights and Choices">
              <p>
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              
              <p>
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
            </Section>

            <Section title="7. Cookies and Tracking Technologies">
              <p>
                We use cookies and similar tracking technologies to collect information about your browsing activities. 
                This helps us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our website performance and user experience</li>
                <li>Provide relevant content and advertisements</li>
              </ul>
              
              <p>
                You can control cookies through your browser settings. However, disabling cookies may affect 
                the functionality of our website.
              </p>
            </Section>

            <Section title="8. Third-Party Services">
              <p>
                Our website may contain links to third-party websites or integrate with third-party services 
                (such as scheduling platforms, analytics tools, or social media). This privacy policy does not apply 
                to these third-party services.
              </p>
              
              <p><strong>Third-party services we may use include:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-slate-300">
                <li>Calendly for appointment scheduling</li>
                <li>Google Analytics for website analytics</li>
                <li>Email marketing platforms for newsletters</li>
                <li>Social media platforms for content sharing</li>
              </ul>
            </Section>

            <Section title="9. International Data Transfers">
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure that such transfers comply with applicable data protection laws and implement 
                appropriate safeguards to protect your information.
              </p>
            </Section>

            <Section title="10. Children's Privacy">
              <p>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect 
                personal information from children under 18. If we become aware that we have collected personal 
                information from a child under 18, we will take steps to delete such information.
              </p>
            </Section>

            <Section title="11. Changes to This Privacy Policy">
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or for other 
                operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
                new privacy policy on this page and updating the "Last updated" date.
              </p>
            </Section>

            <Section title="12. Contact Us">
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-slate-800/70 backdrop-blur-sm border border-slate-700/70 p-4 rounded-lg">
                <p className="text-white"><strong>TrustML.Studio</strong></p>
                <p className="text-slate-300">Email: <a href="mailto:michael@trustml.studio" className="text-indigo-400 hover:text-cyan-400 transition-colors">michael@trustml.studio</a></p>
                <p className="text-slate-300 flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-indigo-400" />
                  <a href="https://linkedin.com/in/mpezely" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-cyan-400 transition-colors">linkedin.com/in/mpezely</a>
                </p>
                <p className="text-slate-300">Location: Seattle, WA</p>
              </div>
              
              <p className="mt-4">
                <strong>Data Protection Officer:</strong> For privacy-related inquiries, you can reach us directly at the email above 
                with "Privacy Inquiry" in the subject line.
              </p>
            </Section>
          </motion.div>
        </Container>
      </main>
    </div>
  );
};

export default PrivacyPolicy;