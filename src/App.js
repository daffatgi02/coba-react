import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

const getSteamId = identifiers => {
  const steamIdentifier = identifiers.find(id => id.startsWith('steam:'));
  return steamIdentifier ? steamIdentifier : null;
};

const getDiscordId = identifiers => {
  const discordIdentifier = identifiers.find(id => id.startsWith('discord:'));
  return discordIdentifier ? discordIdentifier.split(':')[1] : null;
};

const fetchDiscordData = async discordId => {
  const response = await fetch(`https://discordlookup.mesalytic.moe/v1/user/${discordId}`);
  return response.json();
};

const App = () => {
  const [serverInfo, setServerInfo] = useState({});
  const [players, setPlayers] = useState([]);
  const [visiblePlayers, setVisiblePlayers] = useState([]);
  const [discordData, setDiscordData] = useState({});
  const [openDetails, setOpenDetails] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalAvatarUrl, setModalAvatarUrl] = useState(null);

  const fetchServerData = useCallback(async () => {
    try {
      const response = await fetch('https://servers-frontend.fivem.net/api/servers/single/4ylb3o');
      const data = await response.json();
      setServerInfo(data.Data || {});
      setPlayers(data.Data?.players || []);
    } catch (error) {
      console.error('Error fetching FiveM data:', error);
    }
  }, []);

  const fetchPlayersDiscordData = useCallback(async players => {
    const discordInfo = {};
    await Promise.all(
      players.map(async player => {
        const discordId = getDiscordId(player.identifiers);
        if (discordId) {
          try {
            const data = await fetchDiscordData(discordId);
            discordInfo[discordId] = data;
          } catch (error) {
            console.error(`Error fetching Discord data for ID ${discordId}:`, error);
          }
        }
      })
    );
    setDiscordData(discordInfo);
  }, []);

  useEffect(() => {
    fetchServerData();
  }, [fetchServerData]);

  useEffect(() => {
    if (players.length) {
      fetchPlayersDiscordData(players);
    }
  }, [players, fetchPlayersDiscordData]);

  useEffect(() => {
    const filteredPlayers = players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVisiblePlayers(filteredPlayers.slice(0, itemsPerPage));
  }, [itemsPerPage, players, searchTerm]);

  const handlePlayerClick = id => {
    setOpenDetails(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleFilterChange = event => {
    const value = event.target.value;
    setItemsPerPage(value === 'all' ? players.length : parseInt(value, 10));
  };

  const handleSearchChange = event => setSearchTerm(event.target.value);

  const openAvatarModal = url => {
    setModalAvatarUrl(`${url}?size=512`);
  };

  const closeModal = () => {
    setModalAvatarUrl(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="container mx-auto">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">SERVER STATUS</h1>

        <div id="server-info" className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg">
            <strong>Total Players ►</strong> {serverInfo.clients || 0} / {serverInfo.svMaxclients}
          </p>
          <div className="flex items-center mb-4">
            <p className="text-lg"><strong>Join the City ►</strong></p>
            {serverInfo.vars?.Discord && (
              <a href={serverInfo.vars.Discord} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2">
                Join Discord
              </a>
            )}
          </div>
          <img src={serverInfo.vars?.banner_connecting || ''} alt="Connecting Banner" className="w-full h-auto rounded-lg" />
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <label htmlFor="items-per-page" className="mr-2 text-lg">Show:</label>
            <select id="items-per-page" className="p-2 border border-gray-300 rounded-lg" onChange={handleFilterChange} value={itemsPerPage === players.length ? 'all' : itemsPerPage}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="search-box" className="mr-2 text-lg">Search:</label>
            <input id="search-box" type="text" className="p-2 border border-gray-300 rounded-lg" placeholder="Search by player name" value={searchTerm} onChange={handleSearchChange} />
          </div>
        </div>

        <h3 className="mb-4 text-xl font-semibold text-gray-700">Player List</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePlayers.map(player => {
            const discordId = getDiscordId(player.identifiers);
            const discordUser = discordData[discordId] || {};
            const avatarUrl = discordUser.avatar?.link || 'https://via.placeholder.com/64';
            const steamId = getSteamId(player.identifiers);

            return (
              <div key={player.id} className="bg-white p-4 rounded-lg shadow-lg relative flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer" onClick={() => handlePlayerClick(player.id)}>
                <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">
                  <span>ID: {player.id}</span> | <span>Ping: {player.ping} ms</span>
                </div>
                <img src={avatarUrl} alt="Discord Avatar" className="rounded-full w-16 h-16 mb-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); openAvatarModal(avatarUrl); }} />
                <p className="font-semibold text-lg">{player.name}</p>
                <p className="text-gray-500 text-sm">@{discordUser.username || 'Unknown'}</p>

                {openDetails[player.id] && (
                  <div className="mt-4 text-left w-full bg-gray-50 p-3 rounded-lg shadow-inner transition-all duration-500 ease-in-out">
                    <p className="font-semibold">Identifier:</p>
                    {steamId ? (
                      <p className="text-gray-700">{steamId}</p>
                    ) : (
                      <p className="text-gray-500">No Steam ID available</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {modalAvatarUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative bg-white p-5 rounded-lg shadow-lg max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeModal}
              className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transform translate-x-1/2 -translate-y-1/2 transition-colors duration-200"
              aria-label="Close modal"
            >
              ×
            </button>
            <img src={modalAvatarUrl} alt="Large Avatar" className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
