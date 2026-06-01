import React from 'react';
import { Download } from 'lucide-react';
import API from '../services/api';
import { toast } from 'react-toastify';

const TestFeed = () => {
  const handleDownload = () => {
    try {
      // Get the current API base URL
      const baseUrl = API.defaults.baseURL || 'http://localhost:8000';
      const downloadUrl = `${baseUrl}/product.csv`;
      
      // Native browser download (most reliable way)
      window.open(downloadUrl, '_blank');
      
      toast.success("Downloading CSV Feed...");
    } catch (error) {
      console.error("Error downloading feed:", error);
      toast.error("Failed to trigger download. Please try again.");
    }
  };

  return (
    <div className="animate-fade-in p-6 lg:p-10">
      <div className="mb-12">
        <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Diagnostics & Testing</span>
        <h2 className="text-4xl lg:text-5xl font-serif font-black text-gray-900 tracking-tighter mb-4">Meta Catalog <span className="italic text-gray-400">Feed</span></h2>
        <p className="text-gray-600 text-lg font-medium leading-relaxed max-w-2xl">
          Use this page to verify and download the product catalog feed tailored for Meta/Facebook Commerce Manager.
        </p>
      </div>

      <div className="bg-[#F2EDE7] p-10 border border-gray-100 mt-8 max-w-2xl">
        <h3 className="text-2xl font-serif font-black text-gray-900 mb-4">Export Feed</h3>
        <p className="text-gray-600 mb-8 font-medium">Click the button below to generate and download the latest product inventory in CSV format.</p>
        
        <button 
          onClick={handleDownload}
          className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#D7282F] transition-all"
        >
          <Download className="w-4 h-4" />
          Download product.csv
        </button>
      </div>
    </div>
  );
};

export default TestFeed;
