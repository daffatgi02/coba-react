import React, { useEffect, useState, useCallback } from "react";
import './App.css';
import FloatCard from "./FloatCard";
import ImageCarousel from "./ImageCarousel";

const getSteamId = (steamProfileUrl) => steamProfileUrl || null;

const App = () => {
  const [serverInfo, setServerInfo] = useState({});
  const [players, setPlayers] = useState([]);
  const [visiblePlayers, setVisiblePlayers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAvatarUrl, setModalAvatarUrl] = useState(null);
  const [isCardOpen, setIsCardOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const images = [
    'https://storage.googleapis.com/prime-rp-indonesia/image1.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image2.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image3.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image4.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image5.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image6.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image7.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image8.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image9.png',
    'https://storage.googleapis.com/prime-rp-indonesia/image10.png'
  ];

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  // Fetch server data
  const fetchServerData = useCallback(async () => {
    try {
      const response = await fetch("https://backend-fivem.vercel.app/serverdetail");
      const data = await response.json();
      setServerInfo(data);
    } catch (error) {
      console.error("Error fetching server data:", error);
    }
  }, []);

  // Fetch player data with additional 3-second delay
  const fetchPlayerData = useCallback(async () => {
    try {
      const response = await fetch("https://backend-fivem.vercel.app/playerlist");
      const data = await response.json();
      setPlayers(data.playerlist);

      // Add a 3-second delay before setting isLoading to false
      setTimeout(() => {
        setIsLoading(false);  
      }, 3000);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  }, []);

  useEffect(() => {
    fetchServerData();
    fetchPlayerData();
  }, [fetchServerData, fetchPlayerData]);

  useEffect(() => {
    const filteredPlayers = players.filter((player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVisiblePlayers(filteredPlayers.slice(0, itemsPerPage));
  }, [itemsPerPage, players, searchTerm]);

  const handleFilterChange = (value) => {
    setItemsPerPage(value === "all" ? players.length : parseInt(value, 10));
    setDropdownOpen(false);
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const openAvatarModal = (url) => setModalAvatarUrl(`${url}?size=512`);
  const closeModal = () => setModalAvatarUrl(null);
  const toggleCard = () => setIsCardOpen((prevState) => !prevState);

  const PlayerCard = ({ player, avatarUrl, steamProfileUrl, discordUsername }) => (
    <div key={player.id} className="bg-white p-4 rounded-lg shadow-lg relative flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer">
      <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
        <span>ID: {player.id}</span> | <span>Ping: {player.ping} ms</span>
      </div>
      <img src={avatarUrl} alt="Discord Avatar" className="rounded-full w-16 h-16 mb-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); openAvatarModal(avatarUrl); }} />
      <p className="font-semibold text-lg">{player.name}</p>
      <p className="text-gray-500 text-sm flex items-center">
        <img src="https://upload.wikimedia.org/wikipedia/fr/4/4f/Discord_Logo_sans_texte.svg" alt="Discord Logo" className="w-5 h-5 mr-2" />
        @{discordUsername || "-"}
        {steamProfileUrl && (
          <a href={steamProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center ml-4 text-gray-500">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/1200px-Steam_icon_logo.svg.png" alt="Steam Logo" className="w-5 h-5 mr-2" />
            Steam Profile
          </a>
        )}
      </p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen p-5 pb-20">
      {/* Loading overlay */}
      {isLoading && (
        <div className={`loading-overlay ${isLoading ? 'visible' : ''}`}>
          <img src="https://storage.googleapis.com/prime-rp-indonesia/prime-logo.gif" alt="Loading" className="loading-logo" />
        </div>
      )}
      <div className={`container mx-auto ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        <FloatCard isCardOpen={isCardOpen} toggleCard={toggleCard} serverInfo={serverInfo} />
        <div id="server-info" className="mb-8 shadow-2xl">
          <a href="https://discord.com/invite/primeindonesia" target="_blank" rel="noopener noreferrer">
            <img src="https://storage.googleapis.com/prime-rp-indonesia/banner.gif" alt="Connecting Banner" className="w-full h-auto rounded-lg" />
          </a>
        </div>
        <ImageCarousel images={images} />
        
        {/* Dropdown for itemsPerPage */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={toggleDropdown}
            >
              Show Player: {itemsPerPage === players.length ? "All" : itemsPerPage}
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <button onClick={() => handleFilterChange(5)} className="block w-full px-4 py-2 text-sm text-gray-700">5</button>
                  <button onClick={() => handleFilterChange(10)} className="block w-full px-4 py-2 text-sm text-gray-700">10</button>
                  <button onClick={() => handleFilterChange(15)} className="block w-full px-4 py-2 text-sm text-gray-700">15</button>
                  <button onClick={() => handleFilterChange("all")} className="block w-full px-4 py-2 text-sm text-gray-700">All</button>
                </div>
              </div>
            )}
          </div>

          {/* Styled Search Bar */}
          <div className="flex items-center w-full sm:w-auto relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <img src="/favicon.ico" alt="Search Icon" className="h-5 w-5 text-gray-500" />
            </span>
            <input
              id="search-box"
              type="text"
              className="p-3 pl-10 pr-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 text-sm"
              placeholder="Search by steam name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Player List</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePlayers.map((player) => {
            const avatarUrl = player.discordDetails?.discordPhoto || "https://via.placeholder.com/64";
            const discordUsername = player.discordDetails?.usernameDiscord;
            const steamProfileUrl = getSteamId(player.steamProfileUrl);
            return <PlayerCard key={player.id} player={player} avatarUrl={avatarUrl} steamProfileUrl={steamProfileUrl} discordUsername={discordUsername} />;
          })}
        </div>
      </div>
      {modalAvatarUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={closeModal}>
          <img src={modalAvatarUrl} alt="Avatar" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
};

export default App;
