import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Helper functions
const getSteamId = (steamProfileUrl) => steamProfileUrl || null;

const App = () => {
  const [serverInfo, setServerInfo] = useState({});
  const [players, setPlayers] = useState([]);
  const [visiblePlayers, setVisiblePlayers] = useState([]);
  const [openDetails, setOpenDetails] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAvatarUrl, setModalAvatarUrl] = useState(null);
  const [isCardOpen, setIsCardOpen] = useState(true); // State for card visibility

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

  // Fetch player data
  const fetchPlayerData = useCallback(async () => {
    try {
      const response = await fetch("https://backend-fivem.vercel.app/playerlist");
      const data = await response.json();
      setPlayers(data.playerlist);
    } catch (error) {
      console.error("Error fetching player data:", error);
    }
  }, []);

  useEffect(() => {
    fetchServerData();
    fetchPlayerData();
  }, [fetchServerData, fetchPlayerData]);

  // Update visible players based on search term and items per page
  useEffect(() => {
    const filteredPlayers = players.filter((player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVisiblePlayers(filteredPlayers.slice(0, itemsPerPage));
  }, [itemsPerPage, players, searchTerm]);

  // Handle player detail toggle
  const handlePlayerClick = (id) => {
    setOpenDetails((prevState) => ({ ...prevState, [id]: !prevState[id] }));
  };

  // Handle filter change (items per page)
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setItemsPerPage(value === 'all' ? players.length : parseInt(value, 10));
  };

  // Handle search term change
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  // Open avatar modal
  const openAvatarModal = (url) => setModalAvatarUrl(`${url}?size=512`);

  // Close avatar modal
  const closeModal = () => setModalAvatarUrl(null);

  // Toggle floating card visibility
  const toggleCard = () => setIsCardOpen((prevState) => !prevState);

  // Player Card Component
  const PlayerCard = ({ player, avatarUrl, steamProfileUrl, discordUsername }) => (
    <div
      key={player.id}
      className="bg-white p-4 rounded-lg shadow-lg relative flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => handlePlayerClick(player.id)}
    >
      <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
        <span>ID: {player.id}</span> | <span>Ping: {player.ping} ms</span>
      </div>
      <img
        src={avatarUrl}
        alt="Discord Avatar"
        className="rounded-full w-16 h-16 mb-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          openAvatarModal(avatarUrl);
        }}
      />
      <p className="font-semibold text-lg">{player.name}</p>
      <p className="text-gray-500 text-sm">
        <i className="fab fa-discord mr-2"></i>@{discordUsername || "-"}
      </p>

      {openDetails[player.id] && (
        <div className="mt-4 text-left w-full bg-gray-50 p-3 rounded-lg shadow-inner transition-all duration-500 ease-in-out">
          <p className="font-semibold">Steam:</p>
          <a
            href={steamProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            {steamProfileUrl ? "View Steam Profile" : "No Steam Profile"}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="container mx-auto">
        {/* Floating Card */}
        <div
          className={`fixed bottom-8 left-8 bg-white p-6 rounded-lg shadow-lg z-50 transition-transform transform ${isCardOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="relative flex justify-between items-center">
            <div className="text-2xl">
              <h4>Total Players</h4> {serverInfo.totalplayer || 0} / {serverInfo.maxplayer}
            </div>
            <div className="absolute top-1/2 right-[-48px]">
              <button
                onClick={toggleCard}
                className="bg-gray-800 text-white p-3 focus:outline-none shadow-md flex justify-center items-center"
                style={{ width: "42px", height: "42px", borderRadius: "50px" }}
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
            <p className="text-1xl">
              <h5>Join the City ►</h5>
            </p>
            {serverInfo.discord && (
              <a
                href={serverInfo.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 ml-2"
              >
                Discord
              </a>
            )}
          </div>
        </div>

        {/* Server Banner */}
        <div id="server-info" className="mb-8 shadow-xl">
          <img
            src={serverInfo.banner?.url || ""}
            alt="Connecting Banner"
            className="w-full h-auto rounded-lg"
          />
        </div>

        {/* Filters and Search */}
        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <label htmlFor="items-per-page" className="mr-2 text-lg">
              Show Player:
            </label>
            <select
              id="items-per-page"
              className="p-2 border border-gray-300 rounded-lg"
              onChange={handleFilterChange}
              value={itemsPerPage === players.length ? "all" : itemsPerPage}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="search-box" className="mr-2 text-lg">
              Search:
            </label>
            <input
              id="search-box"
              type="text"
              className="p-2 border border-gray-300 rounded-lg"
              placeholder="Search by player name"
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

            return (
              <PlayerCard
                key={player.id}
                player={player}
                avatarUrl={avatarUrl}
                steamProfileUrl={steamProfileUrl}
                discordUsername={discordUsername}
              />
            );
          })}
        </div>
      </div>

      {/* Avatar Modal */}
      {modalAvatarUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <img
            src={modalAvatarUrl}
            alt="Avatar"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default App;
