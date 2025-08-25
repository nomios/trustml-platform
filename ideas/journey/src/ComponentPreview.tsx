import React, { Component } from 'react';
import { ProfessionalJourney } from './src/ProfessionalJourney';
import { Icon1 } from './src/Icon1';
import { Icon2 } from './src/Icon2';
import { Icon3 } from './src/Icon3';
export function ComponentPreview() {
  const unifiedJourney = [{
    icon: <Icon1 className="w-6 h-6" />,
    company: 'Fravity (Agentic AI Copilot)',
    role: 'AI Fraud Intelligence Consultant',
    period: 'July 2025 – Present',
    description: 'Leading architecture design for next-generation agentic fraud detection platform, implementing cutting-edge AI models to prevent financial crimes in real-time',
    isCurrent: true
  }, {
    icon: <Icon2 className="w-6 h-6" />,
    company: 'Signifyd',
    role: 'Senior Director Risk Intelligence',
    period: 'Feb 2023 - June 2025',
    description: 'Built and scaled AI-powered risk intelligence team of 15+ engineers, deployed machine learning models that improved fraud detection accuracy by 50% and reduced false positives by 35%'
  }, {
    icon: <Icon3 className="w-6 h-6" />,
    company: 'Signifyd',
    role: 'Director Risk Intelligence',
    period: 'Sept 2021 - Jan 2023',
    description: 'Established comprehensive KPI frameworks for fraud prevention, accelerated threat detection speed by 60% through automated AI-driven risk assessment systems'
  }, {
    icon: <Icon2 className="w-6 h-6" />,
    company: 'eBay',
    role: 'Senior Risk Platform Engineer',
    period: 'Jan 2019 - Aug 2021',
    description: 'Built foundational fraud detection infrastructure processing millions of transactions daily, establishing the scalable architecture that would later evolve into modern AI-powered risk systems'
  }, {
    icon: <Icon3 className="w-6 h-6" />,
    company: 'Early Career Foundation',
    role: 'Risk Systems Developer',
    period: '2017 - 2018',
    description: 'Developed core competencies in financial risk modeling and fraud pattern recognition, laying the groundwork for future AI and machine learning expertise'
  }];
  return <div className="min-h-screen bg-gray-100">
      <ProfessionalJourney title="AI-Powered Fraud & Risk Intelligence Journey" subtitle="A comprehensive evolution from foundational risk systems to cutting-edge agentic AI fraud prevention. Transforming financial security through intelligent automation, predictive modeling, and autonomous threat detection across enterprise-scale platforms." items={unifiedJourney} />
    </div>;
}