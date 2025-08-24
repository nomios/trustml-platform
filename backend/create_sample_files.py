#!/usr/bin/env python3
"""
Create sample PDF files for testing the resource system
"""

from pathlib import Path
import os

# Create sample content for each resource
SAMPLE_FILES = {
    "case-studies/gameverse-case-study.pdf": "GameVerse Marketplace Security Case Study - Sample Content",
    "case-studies/ecommerce-fraud-detection.pdf": "E-commerce Fraud Detection Implementation - Sample Content", 
    "whitepapers/ai-fraud-detection-guide.pdf": "AI-Powered Fraud Detection Guide - Sample Content",
    "guides/marketplace-trust-safety-playbook.pdf": "Marketplace Trust & Safety Playbook - Sample Content",
    "presentations/scaling-trust-safety.pdf": "Scaling Trust & Safety Operations - Sample Content"
}

def create_sample_files():
    """Create sample files for testing"""
    base_path = Path(__file__).parent / "public" / "resources"
    
    for file_path, content in SAMPLE_FILES.items():
        full_path = base_path / file_path
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Create a simple text file with PDF extension for testing
        # In production, these would be actual PDF files
        with open(full_path, 'w') as f:
            f.write(f"SAMPLE RESOURCE FILE\n")
            f.write(f"Title: {content}\n")
            f.write(f"This is a placeholder file for testing the resource management system.\n")
            f.write(f"In production, this would be replaced with actual PDF content.\n")
            f.write(f"File path: {file_path}\n")
        
        print(f"Created: {full_path}")

if __name__ == "__main__":
    create_sample_files()
    print("Sample files created successfully!")