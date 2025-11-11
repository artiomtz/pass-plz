import { createPasswordApi, deletePasswordApi, getPasswordsApi, updatePasswordApi } from '@api/passwordApi';
import Button from '@components/buttons/Button';
import PasswordCard from '@components/PasswordCard';
import SearchBar from '@components/search/SearchBar';
import SortDropdown from '@components/search/SortDropdown';
import Spinner from '@components/Spinner';
import TagsBox from '@components/tags/TagsBox';
import SuggestionsProvider from '@contexts/SuggestionsContext';
import useAuth from '@hooks/useAuth';
import GlobalLayout from '@layouts/GlobalLayout';
import PasswordEntry from '@models/passwordEntry';
import { getUserDisplayName } from '@models/user';
import { getUtcIsoDate } from '@utils/dateUtil';
import { getUniqueName } from '@utils/inputUtil';
import logger from '@utils/loggerUtil';
import { filterAndSortEntries, SortBy, SortOrder } from '@utils/sortUtil';
import { DRAFT_PREFIX_NEW, draftStorage, getDraftKey } from '@utils/storageUtil';
import { ArrowDownAz, ArrowDownZa, ChevronsDownUp, ChevronsUpDown, CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [savingIds, setSavingIds] = useState<number[]>([]);
    const [expandedIds, setExpandedIds] = useState<number[]>([]);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [newEntry, setNewEntry] = useState<PasswordEntry | null>(null);
    const [drafts, setDrafts] = useState<Record<string, PasswordEntry>>({});

    const [sortBy, setSortBy] = useState<SortBy>('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const filteredEntries = filterAndSortEntries(passwords, searchTerm, selectedTags, sortBy, sortOrder);

    const NEW_ENTRY_NAME = 'New Unsaved Password';
    const anyExpanded = expandedIds.length > 0;

    const handleToggleAll = (): void => {
        if (anyExpanded) {
            setExpandedIds([]);
        } else {
            const ids = filteredEntries.map((e) => e.id);

            if (newEntry?.id != null && !ids.includes(newEntry.id)) {
                ids.push(newEntry.id);
            }

            setExpandedIds(ids);
        }
    };

    const handleExpandChange = (isExpanded: boolean, id: number): void => {
        setExpandedIds((expanded) => (isExpanded ? [...expanded, id] : expanded.filter((i) => i !== id)));
    };

    const handleCancelNew = (): void => {
        setNewEntry(null);
    };

    const handleAdd = (): void => {
        const nowUtc = getUtcIsoDate();
        setNewEntry({
            category: null,
            createdDate: nowUtc,
            expirationDate: null,
            id: 0,
            link: null,
            name: '',
            note: null,
            password: '',
            tags: [],
            updatedDate: nowUtc,
            userId: user?.id ?? 0,
            username: '',
        });
        setExpandedIds([]);
    };

    const handleCreate = async (entry: PasswordEntry): Promise<void> => {
        const baseName = entry.name?.trim() || NEW_ENTRY_NAME;
        const uniqueName = getUniqueName(
            baseName,
            passwords.filter((e) => e.id !== entry.id)
        );

        const newEntryWithName = { ...entry, name: uniqueName };
        setSavingIds((prev) => [...prev, entry.id]);

        const response = await createPasswordApi(newEntryWithName);
        setSavingIds((prev) => prev.filter((id) => id !== entry.id));

        if (!response.ok) {
            toast.error(response.error);

            return;
        }

        setPasswords((prev) => [response.data, ...prev]);

        setNewEntry(null);
        toast.success('New password created');
    };

    const handleSave = async (entry: PasswordEntry): Promise<void> => {
        const uniqueName = getUniqueName(
            entry.name,
            passwords.filter((e) => e.id !== entry.id)
        );

        const updatedEntry = { ...entry, name: uniqueName, updatedDate: getUtcIsoDate() };
        setSavingIds((prev) => [...prev, entry.id]);

        const response = await updatePasswordApi(updatedEntry);
        setSavingIds((prev) => prev.filter((id) => id !== entry.id));

        if (!response.ok) {
            toast.error(response.error);

            return;
        }

        setPasswords((prev) => prev.map((e) => (e.id === entry.id ? response.data : e)));

        toast.success('Password updated');
        setNewEntry(null);
    };

    const handleDelete = async (entry: PasswordEntry): Promise<void> => {
        setDeletingIds((prev) => [...prev, entry.id]);

        const response = await deletePasswordApi(entry);
        setDeletingIds((prev) => prev.filter((id) => id !== entry.id));

        if (!response.ok) {
            toast.error(response.error);

            return;
        }

        setPasswords((prev) => prev.filter((e) => e.id !== entry.id));

        draftStorage.clear(entry.id);
        toast.success(response.data);
    };

    useEffect(() => {
        const fetchPasswords = async (): Promise<void> => {
            if (!user) {
                logger.error('failed to get passwords. user not found');
                toast.error('User not found');

                return;
            }

            const response = await getPasswordsApi(user);
            setLoading(false);

            if (!response.ok) {
                toast.error(response.error);
                setPasswords([]);

                return;
            }

            setPasswords(response.data);
        };

        fetchPasswords();
        const loadedDrafts = draftStorage.getAll();
        const newDraft = loadedDrafts[DRAFT_PREFIX_NEW];
        if (newDraft) {
            setNewEntry(newDraft);
        }

        setDrafts(loadedDrafts);
    }, []);

    return (
        <SuggestionsProvider passwords={passwords}>
            <GlobalLayout title={`${user ? getUserDisplayName(user.email) : 'Your'}'s Passwords`}>
                <div className='flex flex-col w-full max-w-3xl mx-auto min-h-[75vh]'>
                    <div className='grid grid-cols-1 md:grid-cols-[50%_25%_15%] gap-8 p-4 md:p-6 rounded-xl shadow-xl border mb-8 items-stretch menu-style'>
                        {/* Sort Section */}
                        <div className='flex flex-col gap-4'>
                            <span className='font-semibold'>Sort</span>
                            <div className='grid grid-cols-[1fr_auto] gap-4'>
                                <SortDropdown
                                    onChange={setSortBy}
                                    value={sortBy}
                                />
                                <button
                                    className='border rounded-xl p-2 w-12 shadow-xl button-info-style cursor-pointer'
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                                    {sortOrder === 'asc' ? <ArrowDownAz size={24} /> : <ArrowDownZa size={24} />}
                                </button>
                            </div>
                            <div>
                                <SearchBar
                                    onChange={setSearchTerm}
                                    placeholder='Search in passwords'
                                    value={searchTerm}
                                />
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className='flex flex-col gap-4 h-full'>
                            <span className='font-semibold'>Tags</span>
                            <TagsBox
                                onChange={setSelectedTags}
                                selectedTags={selectedTags}
                            />
                        </div>

                        {/* Buttons */}
                        <div className='flex flex-col items-center justify-end'>
                            <div className='flex flex-col gap-4 sm:gap-3'>
                                <Button
                                    className='w-full text-sm font-semibold'
                                    onClick={handleToggleAll}
                                    variant='info'>
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
                                <Button
                                    className='min-w-80 max-w-100 w-90'
                                    disabled={!!newEntry}
                                    onClick={handleAdd}
                                    variant='secondary'>
                                    <CirclePlus size={18} /> Create
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Passwords */}
                    {loading ? (
                        <div className='flex justify-center items-center h-100'>
                            <Spinner size={60} />
                        </div>
                    ) : filteredEntries.length === 0 && !newEntry ? (
                        passwords.length === 0 ? (
                            <div className='flex flex-col items-center justify-center h-64 gap-2'>
                                <CirclePlus className='w-8 h-8' />
                                <span>Click Create to add your first password</span>
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center h-50 gap-2'>
                                <span>No Matches</span>
                            </div>
                        )
                    ) : (
                        <div className='space-y-1 p-4 flex flex-col gap-4'>
                            {newEntry && (
                                <PasswordCard
                                    entry={newEntry}
                                    expand={expandedIds.includes(newEntry.id)}
                                    isDraft
                                    isNew
                                    isSaving={savingIds.includes(newEntry.id)}
                                    onCancel={handleCancelNew}
                                    onSave={handleCreate}
                                    setExpand={(isExpanded) => handleExpandChange(isExpanded, newEntry.id)}
                                />
                            )}
                            {filteredEntries.map((entry) => {
                                const draftKey = getDraftKey(entry.id);
                                const draft = drafts[draftKey];
                                const formData = draft ?? entry;

                                return (
                                    <PasswordCard
                                        draft={draft}
                                        entry={formData}
                                        expand={expandedIds.includes(entry.id)}
                                        isDeleting={deletingIds.includes(entry.id)}
                                        isDraft={!!draft}
                                        isSaving={savingIds.includes(entry.id)}
                                        key={entry.id}
                                        onCancel={() => {}}
                                        onDelete={handleDelete}
                                        onSave={handleSave}
                                        setExpand={(isExpanded) => handleExpandChange(isExpanded, entry.id)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </GlobalLayout>
        </SuggestionsProvider>
    );
};

export default DashboardPage;
