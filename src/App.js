import React, { useEffect, useState, useCallback } from 'react';
import './App.css';

const App = () => {
  const [serverInfo, setServerInfo] = useState({});
  const [players, setPlayers] = useState([]);
  const [visiblePlayers, setVisiblePlayers] = useState([]);
  const [openDetails, setOpenDetails] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const fetchServerData = useCallback(async () => {
    try {
      const response = await fetch('https://servers-frontend.fivem.net/api/servers/single/4ylb3o');
      const data = await response.json();
      const serverData = data.Data || {};
      console.log(serverData);
      setServerInfo(serverData);
      setPlayers(serverData.players || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchServerData();
  }, [fetchServerData]);

  useEffect(() => {
    const filteredPlayers = players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPlayers = [...filteredPlayers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setVisiblePlayers(sortedPlayers.slice(0, itemsPerPage));
  }, [itemsPerPage, players, searchTerm, sortConfig]);

  const handlePlayerClick = id => setOpenDetails(prevId => (prevId === id ? null : id));

  const handleFilterChange = event => {
    const value = event.target.value;
    setItemsPerPage(value === 'all' ? players.length : parseInt(value, 10));
  };

  const handleSearchChange = event => setSearchTerm(event.target.value);

  const handleSort = key => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      <div className="container mx-auto">
        <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
          SERVER STATUS
        </h1>

        <div id="server-info" className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg">
            <strong>Total Warga ► </strong> {serverInfo.clients || 0} / {serverInfo.svMaxclients}
          </p>
          <div className="flex items-center mb-4">
          <p className="text-lg">
            <strong>Masuk Kota ► </strong> 
          </p>
            {serverInfo.vars?.Discord && (
              <a
                href={serverInfo.vars.Discord}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 flex items-center"
              >
                <i className="fab fa-discord mr-2 text-xl"></i>
                Join Discord
              </a>
            )}
          </div>
          <div className="mt-4">
            <img 
              src={serverInfo.vars?.banner_connecting || ''} 
              alt="Connecting Banner" 
              className="w-full h-auto rounded-lg" 
            />
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <label htmlFor="items-per-page" className="mr-2 text-lg">Show:</label>
            <select
              id="items-per-page"
              className="p-2 border border-gray-300 rounded-lg"
              onChange={handleFilterChange}
              value={itemsPerPage === players.length ? 'all' : itemsPerPage}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex items-center">
            <label htmlFor="search-box" className="mr-2 text-lg">Search:</label>
            <input
              id="search-box"
              type="text"
              className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
              placeholder="Search by player name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <h3 className="mb-4 text-xl font-semibold text-gray-700">Player List</h3>
        <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('id')}>
                  ID {getSortIcon('id')}
                </th>
                <th className="p-3 text-left">Ping</th>
              </tr>
            </thead>
            <tbody>
              {visiblePlayers.map((player, index) => (
                <React.Fragment key={player.id}>
                  <tr className="hover:bg-gray-100 cursor-pointer" onClick={() => handlePlayerClick(player.id)}>
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 text-blue-600 hover:underline">{player.name}</td>
                    <td className="p-3">{player.id}</td>
                    <td className="p-3">{player.ping}</td>
                  </tr>
                  {openDetails === player.id && (
                    <tr>
                      <td colSpan="4" className="bg-gray-50">
                        <div className="p-4">
                          <p className="text-lg font-semibold">Identifiers:</p>
                          <ul className="list-disc list-inside mt-2 text-gray-700">
                            {player.identifiers?.map(id => (
                              <li key={id}>{id}</li>
                            ))}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
