// src/components/UserProfilePage.jsx

import { useState, useEffect } from 'react';
import { FaUsers, FaUserPlus, FaSearch, FaTimes, FaEdit } from 'react-icons/fa';

const avatars = [
    'https://api.dicebear.com/8.x/micah/svg?seed=John',
    'https://api.dicebear.com/8.x/micah/svg?seed=Jane',
    'https://api.dicebear.com/8.x/micah/svg?seed=Peter',
    'https://api.dicebear.com/8.x/micah/svg?seed=Susan',
    'https://api.dicebear.com/8.x/micah/svg?seed=Michael',
    'https://api.dicebear.com/8.x/micah/svg?seed=Linda',
];

// --- Reusable User Modal Component (for Create and Edit) ---
const UserModal = ({ onSave, onCancel, user = null }) => {
    const [username, setUsername] = useState(user ? user.user_name : '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(user ? user.user_role : 'user');
    const [avatarUrl, setAvatarUrl] = useState(user ? user.avatar_url : avatars[0]);
    const [error, setError] = useState('');

    const isEditing = !!user;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || (!isEditing && !password)) {
            setError('Username and password are required.');
            return;
        }
        setError('');
        try {
            await onSave({ username, role, password: password || null, avatarUrl, userId: user ? user.user_id : null });
        } catch (err) {
            setError('Operation failed. The username may already exist.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">{isEditing ? 'Edit User' : 'Create New User'}</h2>
                    <button onClick={onCancel} className="text-gray-500 hover:text-gray-800"><FaTimes size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Avatar</label>
                        <div className="flex space-x-2 mt-2">
                            {avatars.map(avatar => (
                                <img 
                                    key={avatar}
                                    src={avatar} 
                                    alt="Avatar" 
                                    onClick={() => setAvatarUrl(avatar)}
                                    className={`w-12 h-12 rounded-full cursor-pointer transition-all ${avatarUrl === avatar ? 'ring-4 ring-blue-500' : 'ring-2 ring-transparent hover:ring-blue-300'}`} 
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg" required />
                    </div>
                    {!isEditing && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg bg-white">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">{isEditing ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Reusable Change Password Form ---
const ChangePasswordForm = ({ userId }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5001/api/users/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, newPassword }),
            });
            if (!response.ok) throw new Error('Failed to update password');
            setMessage('Password updated successfully!');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handlePasswordUpdate} className="pt-4">
             <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
             <div className="space-y-3">
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                {error && <p className="text-sm text-red-600">{error}</p>}
                {message && <p className="text-sm text-green-600">{message}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg">Update Password</button>
             </div>
        </form>
    );
};


// --- Admin View Component ---
const AdminView = ({ currentUser, onProfileUpdate }) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5001/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Fetch users error:", error);
            setError('Could not load user data.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSaveUser = async (userData) => {
        const url = userData.userId 
            ? `http://localhost:5001/api/users/${userData.userId}` 
            : 'http://localhost:5001/api/users';
        const method = userData.userId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        setIsModalOpen(false);
        setEditingUser(null);
        fetchUsers();
    };

    const openModal = (user = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user => 
        user.user_name && user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        if (isLoading) return <p className="text-center text-gray-500">Loading users...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;
        if (users.length === 0) return <p className="text-center text-gray-500">No users found.</p>;

        return (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map(user => (
                        <tr key={user.user_id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                                <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                                {user.user_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.user_role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1">
                                    <FaEdit /> Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <>
            {isModalOpen && <UserModal onSave={handleSaveUser} onCancel={() => setIsModalOpen(false)} user={editingUser} />}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                        <button onClick={() => openModal()} className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 flex items-center gap-2">
                            <FaUserPlus /> Create User
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <FaSearch className="absolute top-3 left-3 text-gray-400" />
                        <input 
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white"
                        />
                    </div>
                    {renderContent()}
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
                     <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <img src={currentUser.avatarUrl} alt="Current User Avatar" className="w-16 h-16 rounded-full" />
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Username</label>
                                <p className="text-lg text-gray-800">{currentUser.username}</p>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-500">Role</label>
                            <p className="text-lg text-gray-800 capitalize">{currentUser.role}</p>
                        </div>
                        <ChangePasswordForm userId={currentUser.userId} />
                     </div>
                </div>
            </div>
        </>
    );
};

// --- Regular User View Component ---
const UserView = ({ currentUser, onProfileUpdate }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatarUrl);
    const [message, setMessage] = useState('');

    const handleAvatarUpdate = async () => {
        setMessage('');
        try {
            const response = await fetch(`http://localhost:5001/api/users/profile/${currentUser.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatarUrl: selectedAvatar }),
            });
            if (!response.ok) throw new Error('Failed to update avatar');
            const updatedUser = await response.json();
            onProfileUpdate(updatedUser); // Update the global user state
            setMessage('Avatar updated successfully!');
        } catch (err) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="p-8">
             <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <img src={selectedAvatar} alt="Current User Avatar" className="w-16 h-16 rounded-full" />
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Username</label>
                            <p className="text-lg text-gray-800">{currentUser.username}</p>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-500">Role</label>
                        <p className="text-lg text-gray-800 capitalize">{currentUser.role}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Choose your avatar</label>
                        <div className="flex space-x-2 mt-2">
                            {avatars.map(avatar => (
                                <img 
                                    key={avatar}
                                    src={avatar} 
                                    alt="Avatar" 
                                    onClick={() => setSelectedAvatar(avatar)}
                                    className={`w-12 h-12 rounded-full cursor-pointer transition-all ${selectedAvatar === avatar ? 'ring-4 ring-blue-500' : 'ring-2 ring-transparent hover:ring-blue-300'}`} 
                                />
                            ))}
                        </div>
                        <button onClick={handleAvatarUpdate} className="w-full mt-4 bg-green-500 text-white font-semibold py-2 rounded-lg">Save Avatar</button>
                    </div>
                    {message && <p className="text-sm text-green-600">{message}</p>}
                    <ChangePasswordForm userId={currentUser.userId} />
                </div>
             </div>
        </div>
    );
};


export default function UserProfilePage({ currentUser, onProfileUpdate }) {
    return currentUser.role === 'admin' 
        ? <AdminView currentUser={currentUser} onProfileUpdate={onProfileUpdate} /> 
        : <UserView currentUser={currentUser} onProfileUpdate={onProfileUpdate} />;
}
