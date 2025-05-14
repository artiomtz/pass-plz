// import PasswordList from '@components/PasswordList';
import { api } from '@api/axiosInstance';
import { getPasswords } from '@api/passwordApi'; // Your API call here
// import Spinner from '@components/Spinner'; // Reusable loading spinner component
import { useAuth } from '@contexts/AuthContext';
import { PasswordEntry } from '@models/passwordEntry';
import { formatDisplayDate, getIsoDate } from '@utils/dateUtil';
import { useEffect, useState } from 'react';

const DashboardPage = () => {
    const { user, logout } = useAuth();

    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPasswords = async () => {
            if (!user) return;

            try {
                const data = await getPasswords(user.id);
                setPasswords(data);
            } catch (err) {
                setError('Failed to load passwords');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPasswords();
    }, [user]);

    const handleAdd = async () => {
        const name = prompt('Enter name') ?? '';
        const username = prompt('Enter username') ?? '';
        const password = prompt('Enter password') ?? '';

        console.log(`handleAdd ${user?.id}`);
        const newEntry: Partial<PasswordEntry> = {
            id: 1,
            userId: user?.id ?? 1,
            name,
            username,
            password,
            createdDate: getIsoDate(),
            updatedDate: getIsoDate(),
            expirationDate: null,
            category: null,
            link: null,
            note: null,
            tags: null,
        };

        try {
            const response = await api.post('/api/passwords', newEntry);
            setPasswords((prev) => [...prev, response.data]);
        } catch (err) {
            console.error('Add failed:', err);
        }
    };

    const handleEdit = async (entry: PasswordEntry) => {
        const newPassword = prompt('Enter new password', entry.password) ?? entry.password;

        const updatedEntry = {
            ...entry,
            password: newPassword,
            updatedDate: getIsoDate(),
        };

        try {
            const response = await api.put(`/api/passwords/${entry.id}`, updatedEntry);
            setPasswords((prev) => prev.map((e) => (e.id === entry.id ? response.data : e)));
        } catch (err) {
            console.error('Edit failed:', err);
        }
    };

    const handleDelete = async (entry: PasswordEntry) => {
        if (!confirm(`Delete "${entry.name}"?`)) return;

        try {
            await api.delete(`/api/passwords/${entry.id}`);
            setPasswords((prev) => prev.filter((e) => e.id !== entry.id));
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    if (loading) return <div className='p-4'>Loading...</div>;
    if (error) return <div className='p-4 text-red-500'>{error}</div>;

    return (
        <div className='p-4'>
            <h1 className='text-2xl font-bold mb-4'>Your Passwords</h1>

            <button
                onClick={handleAdd}
                className='mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
                Add Password
            </button>

            {passwords.length === 0 ? (
                <p>No passwords found.</p>
            ) : (
                <ul className='space-y-4'>
                    {passwords.map((entry) => (
                        <li key={entry.id} className='border p-4 rounded shadow-sm'>
                            <div>
                                <strong>{entry.name}</strong>
                            </div>
                            <div className='text-sm text-gray-700'>Id: {entry.id}</div>
                            <div className='text-sm text-gray-700'>Username: {entry.username}</div>
                            <div className='text-sm text-gray-700'>Password: {entry.password}</div>
                            <div className='text-sm text-gray-700'>
                                Created: {formatDisplayDate(entry.createdDate)}
                            </div>
                            <div className='text-sm text-gray-700'>
                                Updated: {formatDisplayDate(entry.updatedDate)}
                            </div>
                            <div className='text-sm text-gray-700'>
                                Expires: {formatDisplayDate(entry.expirationDate)}
                            </div>
                            <div className='text-sm text-gray-700'>Category: {entry.category}</div>
                            <div className='text-sm text-gray-700'>
                                Link:{' '}
                                <a
                                    href={entry.link}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-blue-600 underline'>
                                    {entry.link}
                                </a>
                            </div>
                            <div className='text-sm text-gray-700'>Note: {entry.note}</div>
                            <div className='text-sm text-gray-700'>
                                Tags: {entry.tags.join(', ')}
                            </div>

                            <div className='flex gap-2 mt-3'>
                                <button
                                    onClick={() => handleEdit(entry)}
                                    className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600'>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(entry)}
                                    className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600'>
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={logout} className='mt-6 text-sm underline text-blue-700'>
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;
