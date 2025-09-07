// // src/App.jsx

// import { useState, useEffect } from 'react';
// import LoginPage from './components/LoginPage';
// import HomePage from './components/HomePage';
// import PayrollPage from './components/PayrollPage';
// import UserProfilePage from './components/UserProfilePage';
// import PositionReqPage from './components/PositionReq'; // Make sure this is imported

// const API_URL = 'http://localhost:5001/api';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [page, setPage] = useState('home');
//   const [payrollData, setPayrollData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Check auth status on initial load
//   useEffect(() => {
//     const checkAuth = async () => {
//         try {
//             const response = await fetch(`${API_URL}/check-auth`, { credentials: 'include' });
//             if (response.ok) {
//                 const userData = await response.json();
//                 setUser({ ...userData, company: 'Revolve LLC' });
//             }
//         } catch (error) {
//             console.error("Auth check failed:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     checkAuth();
//   }, []);

//   useEffect(() => {
//     if (!user) {
//       setPayrollData([]);
//       return;
//     }
//     fetchData();
//   }, [user]);

//   const fetchData = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`${API_URL}/payroll`);
//       if (!response.ok) throw new Error('Network response was not ok');
//       const data = await response.json();
//       setPayrollData(data);
//     } catch (error) {
//       console.error("Failed to fetch payroll data:", error);
//       setError('Could not load data from the server.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogin = async (username, password) => {
//     const response = await fetch(`${API_URL}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password }),
//     });

//     if (!response.ok) {
//       throw new Error('Login failed');
//     }
    
//     const userData = await response.json();
//     setUser({ ...userData, company: 'Revolve LLC' });
//   };

//   const handleLogout = () => {
//     setUser(null);
//     setPage('home');
//   };

//   const handleAddData = async (newEntry) => {
//     try {
//       const response = await fetch(`${API_URL}/payroll`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newEntry),
//       });
//       await response.json();
//       fetchData();
//     } catch (error) {
//       console.error("Failed to add data:", error);
//       setError('Failed to save the new entry.');
//     }
//   };

//   const handleUpdateData = async (updatedEntry) => {
//     try {
//       const response = await fetch(`${API_URL}/payroll/${updatedEntry.entity_id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedEntry),
//       });
//       await response.json();
//       fetchData(); 
//     } catch (error) {
//       console.error("Failed to update data:", error);
//       setError('Failed to update the entry.');
//     }
//   };
  
//   const handleProfileUpdate = (updatedUser) => {
//     setUser(prevUser => ({
//       ...prevUser,
//       avatarUrl: updatedUser.avatar_url,
//     }));
//   };

//   const navigate = (targetPage) => {
//     setError('');
//     setPage(targetPage);
//   };

//   if (isLoading) {
//       return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
//   }

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
//         <LoginPage onLogin={handleLogin} />
//       </div>
//     );
//   }
  
//   const renderPage = () => {
//     if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
//     if (isLoading && !['user-profile', 'position-req'].includes(page)) return <div className="p-8 text-center text-gray-500">Loading data...</div>;
    
//     switch (page) {
//       case 'payroll':
//         return <PayrollPage data={payrollData} onAdd={handleAddData} onUpdate={handleUpdateData} />;
//       case 'user-profile':
//         return <UserProfilePage currentUser={user} onProfileUpdate={handleProfileUpdate} />;
//       case 'position-req':
//         return <PositionReqPage navigate={navigate} />;
//       case 'home':
//       default:
//         return <HomePage navigate={navigate} />;
//     }
//   };

//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col font-sans">
//       <nav className="bg-white/80 backdrop-blur-sm shadow-sm flex-shrink-0">
//         <div className="max-w-full mx-auto px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20">
//             <div className="flex items-center">
//               <span className="font-bold text-2xl text-gray-800">{user.company}</span>
//             </div>
//             <div className="flex items-center space-x-2">
//                <button onClick={() => navigate('home')} className={`font-semibold px-4 py-2 rounded-md text-sm ${page === 'home' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Home</button>
//                {/* <button onClick={() => navigate('user-profile')} className={`font-semibold px-4 py-2 rounded-md text-sm ${page === 'user-profile' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>User Profile</button> */}
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className="text-gray-600 text-sm">Hi, {user.username}</span>
//               <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
//               <button onClick={handleLogout} className="font-semibold text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</button>
//             </div>
//           </div>
//         </div>
//       </nav>
//       <main className="flex-grow overflow-y-auto">
//         {renderPage()}
//       </main>
//     </div>
//   );
// }



//Production //

// src/App.jsx

import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import PayrollPage from './components/PayrollPage';
import UserProfilePage from './components/UserProfilePage';
import PositionReqPage from './components/PositionReq';

// The API URL is now read from an environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [payrollData, setPayrollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
        try {
            const response = await fetch(`${API_URL}/check-auth`, { credentials: 'include' });
            if (response.ok) {
                const userData = await response.json();
                setUser({ ...userData, company: 'Revolve LLC' });
            }
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setIsLoading(false);
        }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setPayrollData([]);
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/payroll`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setPayrollData(data);
    } catch (error) {
      console.error("Failed to fetch payroll data:", error);
      setError('Could not load data from the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const userData = await response.json();
    setUser({ ...userData, company: 'Revolve LLC' });
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
  };

  const handleAddData = async (newEntry) => {
    try {
      const response = await fetch(`${API_URL}/payroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      await response.json();
      fetchData();
    } catch (error) {
      console.error("Failed to add data:", error);
      setError('Failed to save the new entry.');
    }
  };

  const handleUpdateData = async (updatedEntry) => {
    try {
      const response = await fetch(`${API_URL}/payroll/${updatedEntry.entity_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry),
      });
      await response.json();
      fetchData(); 
    } catch (error) {
      console.error("Failed to update data:", error);
      setError('Failed to update the entry.');
    }
  };
  
  const handleProfileUpdate = (updatedUser) => {
    setUser(prevUser => ({
      ...prevUser,
      avatarUrl: updatedUser.avatar_url,
    }));
  };

  const navigate = (targetPage) => {
    setError('');
    setPage(targetPage);
  };

  if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }
  
  const renderPage = () => {
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (isLoading && !['user-profile', 'position-req'].includes(page)) return <div className="p-8 text-center text-gray-500">Loading data...</div>;
    
    switch (page) {
      case 'payroll':
        return <PayrollPage data={payrollData} onAdd={handleAddData} onUpdate={handleUpdateData} />;
      case 'user-profile':
        return <UserProfilePage currentUser={user} onProfileUpdate={handleProfileUpdate} />;
      case 'position-req':
        return <PositionReqPage navigate={navigate} />;
      case 'home':
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col font-sans">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm flex-shrink-0">
        <div className="max-w-full mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <span className="font-bold text-2xl text-gray-800">{user.company}</span>
            </div>
            <div className="flex items-center space-x-2">
               <button onClick={() => navigate('home')} className={`font-semibold px-4 py-2 rounded-md text-sm ${page === 'home' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>Home</button>
               {/* <button onClick={() => navigate('user-profile')} className={`font-semibold px-4 py-2 rounded-md text-sm ${page === 'user-profile' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-200'}`}>User Profile</button> */}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm">Hi, {user.username}</span>
              <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full" />
              <button onClick={handleLogout} className="font-semibold text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
