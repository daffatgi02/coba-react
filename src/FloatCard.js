import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';

const FloatCard = ({ isCardOpen, toggleCard, serverInfo }) => (
  <div
    className={`fixed bottom-8 left-3 bg-slate-100 p-6 rounded-lg shadow-2xl z-50 transition-transform transform ${
      isCardOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <div className="relative flex justify-between items-center">
      <div className="text-2xl">
        <h4>Total Players</h4> {serverInfo.totalplayer || 0} / {serverInfo.maxplayer}
      </div>
      <div className="absolute top-1/2 right-[-48px]">
        <button
          onClick={toggleCard}
          className="bg-gray-800 text-white p-3 focus:outline-none shadow-md flex justify-center items-center"
          style={{ width: '42px', height: '42px', borderRadius: '50px' }}
        >
          {isCardOpen ? (
            <ChevronLeft className="text-white" size={52} />
          ) : (
            <ChevronRight className="text-white" size={52} />
          )}
        </button>
      </div>
    </div>
    <div className="flex items-center mb-4">
    </div>
    <p>Stay Connected with Us!</p>
    {/* Social Media Links and Footer Content */}
    <div className="mt-2 text-center">
      <div className="flex justify-center gap-6 mb-4">
        <a
          href="https://www.instagram.com/primerp.id"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-pink-500 transform transition-all duration-300 hover:scale-110"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://www.youtube.com/@primerp.indonesia"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-red-600 transform transition-all duration-300 hover:scale-110"
        >
          <FaYoutube size={24} />
        </a>
        <a
          href="https://discord.com/invite/primeindonesia"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-indigo-600 transform transition-all duration-300 hover:scale-110"
        >
          <FaDiscord size={24} />
        </a>
      </div>
    </div>
  </div>
);

export default FloatCard;
