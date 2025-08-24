// import PasswordList from '@components/PasswordList';
import { logoutApi } from '@api/authApi';
import {
    createPasswordApi,
    deletePasswordApi,
    getPasswordsApi,
    updatePasswordApi,
} from '@api/passwordApi'; // Your API call here
import { requestCancellation } from '@api/userApi';
import Button from '@components/Button';
import { PasswordEntry } from '@models/passwordEntry';
// import Spinner from '@components/Spinner'; // Reusable loading spinner component
import PasswordCard from '@components/PasswordCard';
import { SearchBar } from '@components/SearchBar';
import { SortDropdown } from '@components/SortDropdown';
import Spinner from '@components/Spinner';
import { TagsBox } from '@components/TagsBox';
import { useAuth } from '@hooks/useAuth';
import PageLayout from '@layouts/GlobalLayout';
import { getUserDisplayName } from '@models/user';
import { ROUTES } from '@routes/constants';
import { getIsoDate } from '@utils/dateUtil';
import { getUniqueName } from '@utils/inputUtil';
import { filterAndSortEntries, SortBy, SortOrder } from '@utils/sortUtil';
import { ArrowDownAz, ArrowDownZA, ChevronsDownUp, ChevronsUpDown, CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// const Spinner = () => (
//     // separate into component
//     <Disc3 className='w-6 h-6 animate-spin text-gray-500' />
// );

const DashboardPage = () => {
    const NEW_ENTRY_NAME = 'New Unsaved Password';
    const { user, logout } = useAuth();

    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<SortBy>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    // const [allExpanded, setAllExpanded] = useState(false);

    const availableTags = Array.from(
        new Set((passwords ?? []).flatMap((password) => password.tags ?? []))
    );

    const filteredEntries = filterAndSortEntries(
        passwords,
        searchTerm,
        selectedTags,
        sortBy,
        sortOrder
    );

    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    // const allExpanded = expandedIds.length === filteredEntries.length;
    const anyExpanded = expandedIds.length > 0;

    const handleToggleAll = () => {
        if (anyExpanded) {
            setExpandedIds([]);
        } else {
            setExpandedIds(filteredEntries.map((e) => e.id));
        }
    };

    useEffect(() => {
        const fetchPasswords = async () => {
            if (!user) return;

            // try {
            const response = await getPasswordsApi(user);
            if (!response) {
                // toast
                console.error('get failed...');
                setPasswords([]); // ensure safe default
                return;
            }

            setPasswords(response);
            // } catch (err) {
            //     setError('Failed to load passwords');
            //     console.error(err);
            //     navigate(ROUTES.SIGN_IN, { replace: true });
            // } finally {
            // }
            setLoading(false);
        };

        fetchPasswords();
    }, []);

    const [newEntry, setNewEntry] = useState<PasswordEntry | null>(null);

    const handleAdd = () => {
        setNewEntry({
            id: 1,
            userId: user?.id ?? 1,
            name: '',
            username: '',
            password: '',
            createdDate: getIsoDate(),
            updatedDate: getIsoDate(),
            expirationDate: null,
            category: null,
            link: null,
            note: null,
            tags: [],
        });
    };

    const handleCreate = async (entry: PasswordEntry) => {
        // Ensure unique name
        let baseName = entry.name.trim() || NEW_ENTRY_NAME;
        // let uniqueName = baseName;
        const uniqueName = getUniqueName(
            baseName,
            passwords.filter((e) => e.id !== entry.id)
        );
        // let counter = 1;
        // while (passwords.some((p) => p.name === uniqueName)) {
        //     uniqueName = `${baseName} (${counter++})`;
        // }

        const newEntryWithName = { ...entry, name: uniqueName };

        // toast
        // try {
        const response = await createPasswordApi(newEntryWithName);
        if (!response) {
            console.error('create failed');
            // toast
            return;
        }
        setPasswords((prev) => [response, ...prev]);
        setNewEntry(null); // remove unsaved card
        // } catch (err) {
        //     console.error('handleCreate failed:', err);
        // }
        // success toast - no
    };

    const handleCancelNew = () => {
        setNewEntry(null);
    };

    // const handleCreate = async () => {
    //     const name = prompt('Enter name') ?? '';
    //     const username = prompt('Enter username') ?? '';
    //     const password = prompt('Enter password') ?? '';

    //     console.log(`handleCreate ${user?.id}`);
    //     const newEntry: PasswordEntry = {
    //         id: 1,
    //         userId: user?.id ?? 1,
    //         name,
    //         username,
    //         password,
    //         createdDate: getIsoDate(),
    //         updatedDate: getIsoDate(),
    //         expirationDate: null,
    //         category: null,
    //         link: null,
    //         note: null,
    //         tags: null,
    //     };

    //     try {
    //         const data = await createPasswordApi(newEntry); // if null/error - toast
    //         if (!data) {
    //             console.error('create failed... toast');
    //         }
    //         // success toast
    //         // const response = await api.post('/api/passwords', newEntry);
    //         setPasswords((prev) => [...prev, data]);
    //     } catch (err) {
    //         console.error('handleCreate failed:', err);
    //     }
    // };

    const handleSave = async (entry: PasswordEntry) => {
        // const newPassword = prompt('Enter new password', entry.password) ?? entry.password;
        const uniqueName = getUniqueName(
            entry.name,
            passwords.filter((e) => e.id !== entry.id)
        );
        const updatedEntry = { ...entry, name: uniqueName, updatedDate: getIsoDate() };

        // const updatedEntry = {
        //     ...entry,
        //     password: newPassword,
        //     updatedDate: getIsoDate(),
        // };

        // try {
        const response = await updatePasswordApi(updatedEntry);
        //toast
        if (!response) {
            // toast
            console.error('update failed... toast');
            return;
        }
        // success toast - no
        // const response = await api.put(`/api/passwords/${entry.id}`, updatedEntry);
        setPasswords((prev) => prev.map((e) => (e.id === entry.id ? response : e)));
        // } catch (err) {
        //     console.error('Edit failed:', err);
        // }
        setNewEntry(null);
    };

    const handleDelete = async (entry: PasswordEntry) => {
        // if (!confirm(`Delete "${entry.name}"?`)) return;

        // try {
        // toast
        const response = await deletePasswordApi(entry);
        if (!response) {
            // toast
            console.error('delete failed... toast');
            return;
        }
        setPasswords((prev) => prev.filter((e) => e.id !== entry.id));
        // } catch (err) {
        //     console.error('Delete failed:', err);
        // }
    };

    const handleLogout = async () => {
        // try {
        console.log(`logging out...`);
        const response = await logoutApi();
        // loading?
        if (!response) {
            console.error('get failed... toast');
            // toast
            // return null;
        }
        // } catch (err) {
        //     console.error('logout failed:', err);
        // } finally {
        // }

        // navigate(ROUTES.WELCOME,{ replace: true });
        // success toast
        // loading? done
        logout();
    };

    const handleRequestCancellation = async () => {
        // try {
        if (!user) {
            return;
        }
        //toast
        console.log(`requesting cancellation...`);
        const response = await requestCancellation(user);
        // loading
        if (!response) {
            console.error('logout failed... toast');
            //toast
        }
        // } catch (err) {
        //     console.error('logout failed:', err);
        // } finally {
        logout();
        // success toast - no
        navigate(ROUTES.WELCOME, { replace: true });
        // loading done
        // }
    };

    // if (loading) return <div className='p-4'>Loading........</div>;
    if (error) return <div className='p-4 text-red-500'>{error}</div>; // redirect to welcome / 404 ?

    return (
        <PageLayout title={`${user ? getUserDisplayName(user.email) : 'Your'}'s Passwords`}>
            {/* <div className='w-full flex justify-center'>
                <div className='w-full max-w-3xl'> */}

            <div className='flex flex-col justify-center w-full max-w-3xl mx-auto h-full pt-0 mt-0'>
                {/* Top Menu */}
                {/* <div className='top-[15vh] z-10 bg-white pt-0 mt-0'> */}
                <div className='grid grid-cols-1 md:grid-cols-[50%_25%_15%] gap-8 p-4 md:p-6 bg-gray-50 rounded-lg shadow-xl border mb-8 items-stretch'>
                    {/* Sort Section */}
                    <div className='flex flex-col gap-4'>
                        <span className='font-semibold'>Sort</span>
                        {/* <div className='flex justify-between gap-4 pb-2'> */}
                        <div className='grid grid-cols-[1fr_auto] gap-4'>
                            <SortDropdown value={sortBy} onChange={setSortBy} />
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className='border rounded p-2 w-12 shadow-lg'>
                                {sortOrder === 'asc' ? (
                                    <ArrowDownAz size={24} />
                                ) : (
                                    <ArrowDownZA size={24} />
                                )}
                            </button>
                        </div>
                        <div>
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder='Search in passwords'
                            />
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div className='flex flex-col gap-4 h-full'>
                        <span className='font-semibold'>Tags</span>
                        <TagsBox
                            availableTags={availableTags}
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </div>

                    {/* Buttons */}
                    <div className='flex flex-col items-center justify-end'>
                        <div className='flex flex-col gap-4 sm:gap-3'>
                            {/* <div className='items-center justify-center'> */}
                            {/* <div className=''> */}
                            {/* <div className='items-center justify-center'> */}
                            <Button
                                onClick={handleToggleAll}
                                variant='secondary'
                                className='w-full text-sm font-semibold'>
                                {anyExpanded ? (
                                    <>
                                        <ChevronsDownUp size={18} /> Collapse
                                    </>
                                ) : (
                                    <>
                                        <ChevronsUpDown size={18} /> Expand
                                    </>
                                )}
                            </Button>
                            {/* </div> */}
                            <Button onClick={handleAdd} disabled={!!newEntry} variant='primary'>
                                {/* <Spinner /> Create */}
                                <CirclePlus size={18} /> Create
                            </Button>
                        </div>
                    </div>
                </div>
                {/* </div> */}

                {/* Passwords */}
                {/* <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-4'> */}
                {/* <div className='p-4 flex flex-col gap-4'> */}
                {loading ? (
                    <div className='flex justify-center items-center h-100'>
                        <Spinner size={60} />
                    </div>
                ) : filteredEntries.length === 0 && !newEntry ? (
                    passwords.length === 0 ? (
                        <div className='flex flex-col items-center justify-center h-64 text-gray-500 gap-2'>
                            <CirclePlus className='w-8 h-8' />
                            <span>Click Create to add your first password</span>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center h-64 text-gray-500 gap-2'>
                            <span>No Matches</span>
                        </div>
                    )
                ) : (
                    <div className='space-y-1 p-4 flex flex-col gap-4'>
                        {/* mx-auto */}
                        {newEntry && (
                            <PasswordCard
                                isNew
                                entry={newEntry}
                                onSave={handleCreate}
                                onCancel={handleCancelNew}
                                expand={true}
                            />
                        )}
                        {filteredEntries.map((entry) => (
                            <PasswordCard
                                key={entry.id}
                                entry={entry}
                                onSave={handleSave}
                                onDelete={handleDelete}
                                onCancel={() => {}}
                                expand={expandedIds.includes(entry.id)}
                                onExpandChange={(expanded) => {
                                    setExpandedIds((prev) =>
                                        expanded
                                            ? [...prev, entry.id]
                                            : prev.filter((id) => id !== entry.id)
                                    );
                                }}
                            />
                        ))}
                    </div>
                )}
                {/* </div> */}
            </div>
            {/* </div>
            </div> */}
        </PageLayout>
    );
};

export default DashboardPage;
