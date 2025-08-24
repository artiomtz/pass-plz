import Button from '@components/Button';
import { ButtonAdd } from '@components/ButtonAdd';
import ButtonCopy from '@components/ButtonCopy';
import ButtonEye from '@components/ButtonEye';
import CircleInitial from '@components/CircleInitial';
import ConfirmModal from '@components/ConfirmModal';
import { InputDate } from '@components/InputDate';
import InputField from '@components/InputField';
import { InputTextbox } from '@components/InputTextbox';
import Label from '@components/Label';
import { Tags } from '@components/Tags';
import { PasswordEntry } from '@models/passwordEntry';
import { formatDisplayDate, formatDisplayDateTime, getIsoDateFromString } from '@utils/dateUtil';
import { normalizeTag, sanitizeInput } from '@utils/inputUtil';
import { ChevronDown, ChevronUp, CircleX, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PasswordCardProps {
    entry: PasswordEntry;
    isNew?: boolean;
    expand?: boolean;
    onCancel: () => void;
    onSave: (entry: PasswordEntry) => void;
    onDelete?: (entry: PasswordEntry) => void;
    onExpandChange?: (expanded: boolean) => void;
}

const PasswordCard: React.FC<PasswordCardProps> = ({
    entry,
    onSave,
    onDelete,
    onCancel,
    isNew = false,
    expand = false,
    onExpandChange,
}) => {
    const CLASS_FIELD =
        'grid grid-cols-1 lg:grid-cols-[120px_1fr] items-center gap-2 lg:gap-10 m-2';
    const CLASS_LANDSCAPE = 'flex items-center gap-6';
    const CLASS_PORTRAIT = 'flex lg:hidden items-center gap-4';
    const CLASS_BUTTONS = 'hidden lg:flex items-center gap-4';
    const TAGS_LIMIT = 5;

    const [expanded, setExpanded] = useState(expand);
    const [formData, setFormData] = useState(entry);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showUsername, setShowUsername] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [tagInput, setTagInput] = useState('');
    // const [localExpanded, setLocalExpanded] = useState(false);

    const circleInitial = formData.name?.[0]?.toUpperCase() ?? 'N';
    const isSaveDisabled = !formData.name || !formData.username || !formData.password;

    const handleChange = (field: keyof PasswordEntry, value: string | string[] | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.username || !formData.password) return;
        setExpanded(false);
        onSave(formData);
    };

    const handleCancel = () => {
        if (isNew) {
            // discard completely
            onCancel();
        } else {
            // reset and collapse
            setExpanded(false);
            setFormData(entry);
        }
    };

    const handleTrashClick = () => {
        if (isNew) {
            onCancel();
        } else {
            setShowConfirm(true);
        }
    };

    const copyToClipboard = (text: string | null) => {
        if (!text) return;
        navigator.clipboard.writeText(text).catch((err) => console.error('Copy failed', err));
    };

    const handleAddTag = () => {
        const tag = normalizeTag(tagInput);
        console.log('Trying to add tag:', tag);

        if (!tag || formData.tags?.includes(tag) || (formData.tags?.length ?? 0) >= TAGS_LIMIT)
            return;
        handleChange('tags', [...(formData.tags ?? []), tag]);
        setTagInput('');

        console.log('tag:', formData.tags);
    };

    useEffect(() => {
        setExpanded(expand);
    }, [expand]);

    const toggleExpand = () => {
        const newVal = !expanded;
        setExpanded(newVal);
        onExpandChange?.(newVal);
    };

    return (
        <div className='bg-white shadow-lg rounded-xl p-4 flex flex-col gap-2 border'>
            {/* Entry Header Row */}
            <div
                // className="flex items-center cursor-pointer"
                className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 w-full cursor-pointer'
                onClick={toggleExpand}
                // onClick={() => setExpanded(!expanded)}
            >
                <div className='flex items-center gap-6 flex-1'>
                    {/* <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2"> */}
                    <CircleInitial initial={circleInitial} />
                    <div className='flex flex-col '>
                        <span className='font-semibold truncate md:max-w-none max-w-[12rem]'>
                            {isNew ? 'New Unsaved Password' : entry.name}
                        </span>
                        {/* truncate max-w-[200px] */}
                        <span className='text-sm text-gray-500 min-h-[1.25rem]'>
                            {entry.category || ''}
                        </span>
                    </div>
                </div>
                <div className='flex sm:flex-row sm:items-start justify-between w-full sm:w-auto gap-4 p-1'>
                    <div className='flex flex-col text-xs text-gray-400 w-full sm:w-auto items-end'>
                        <span>Created: {formatDisplayDateTime(entry.createdDate)}</span>
                        <span>Updated: {formatDisplayDateTime(entry.updatedDate)}</span>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button
                            className='cursor-pointer'
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand();
                            }}
                            // onClick={() => setExpanded((prev) => !prev)}
                            // className='cursor-pointer'
                        >
                            {expanded ? <ChevronUp size={26} /> : <ChevronDown size={26} />}
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTrashClick();
                            }}
                            // onClick={() => onDelete?.(entry)}
                            //
                            // onClick={() => onDelete(entry)}
                            // onClick={(e) => {
                            //     e.stopPropagation();     // ✅ prevent collapse on delete
                            //     onDelete(entry);
                            //   }}
                            // className='cursor-pointer'
                            className='cursor-pointer ml-auto text-red-500 hover:text-red-700'>
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {expanded && (
                <div className='flex flex-col gap-2 mt-4'>
                    {/* Name */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Name' bold />
                            <div className={CLASS_PORTRAIT}>
                                <ButtonCopy textToCopy={formData.name ?? ''} />
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputField
                                maxLength={32}
                                value={formData.name ?? ''}
                                placeholder='i.e Google, Banking'
                                onChange={(value) => handleChange('name', value)}
                                className={!formData.name ? 'border-red-500' : 'border-gray-300'}
                            />
                            <div className={CLASS_BUTTONS}>
                                <ButtonCopy textToCopy={formData.name ?? ''} />
                            </div>
                        </div>
                    </div>

                    {/* Username */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Username' bold />
                            <div className={CLASS_PORTRAIT}>
                                <ButtonCopy textToCopy={formData.username ?? ''} />
                                <ButtonEye
                                    isVisible={showUsername}
                                    onToggle={() => setShowUsername((prev) => !prev)}
                                />
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputField
                                maxLength={32}
                                placeholder='Your username'
                                value={formData.username ?? ''}
                                type={showUsername ? 'text' : 'password'}
                                onChange={(value) => handleChange('username', value)}
                                className={
                                    !formData.username ? 'border-red-500' : 'border-gray-300'
                                }
                            />
                            <div className={CLASS_BUTTONS}>
                                <ButtonCopy textToCopy={formData.username ?? ''} />
                                <ButtonEye
                                    isVisible={showUsername}
                                    onToggle={() => setShowUsername((prev) => !prev)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Password' bold />
                            <div className={CLASS_PORTRAIT}>
                                <ButtonCopy textToCopy={formData.password} />
                                <ButtonEye
                                    isVisible={showPassword}
                                    onToggle={() => setShowPassword((prev) => !prev)}
                                />
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputField
                                maxLength={64}
                                placeholder='Your password'
                                value={formData.password ?? ''}
                                type={showPassword ? 'text' : 'password'}
                                onChange={(value) => handleChange('password', value)}
                                className={
                                    !formData.password ? 'border-red-500' : 'border-gray-300'
                                }
                            />
                            <div className={CLASS_BUTTONS}>
                                <ButtonCopy textToCopy={formData.password} />
                                <ButtonEye
                                    isVisible={showPassword}
                                    onToggle={() => setShowPassword((prev) => !prev)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Expiration Date */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Expires' />
                            <div className={CLASS_PORTRAIT}>
                                <ButtonCopy
                                    textToCopy={formatDisplayDate(formData.expirationDate) ?? ''}
                                />
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputDate
                                value={formData.expirationDate}
                                onChange={(value) =>
                                    handleChange('expirationDate', getIsoDateFromString(value))
                                }
                            />
                            <div className={CLASS_BUTTONS}>
                                <ButtonCopy
                                    textToCopy={formatDisplayDate(formData.expirationDate) ?? ''}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Category' />
                            <div className={CLASS_PORTRAIT}>
                                <ButtonCopy textToCopy={formData.category ?? ''} />
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputField
                                maxLength={16}
                                value={formData.category ?? ''}
                                placeholder='i.e. Work, Travel'
                                onChange={(value) => handleChange('category', value)}
                            />
                            <div className={CLASS_BUTTONS}>
                                <ButtonCopy textToCopy={formData.category ?? ''} />
                            </div>
                        </div>
                    </div>

                    {/* Link */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Link' />
                            <div className={CLASS_PORTRAIT}>
                                <ButtonCopy textToCopy={formData.link ?? ''} />
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputField
                                maxLength={128}
                                value={formData.link ?? ''}
                                placeholder='The service URL'
                                onChange={(value) => handleChange('link', value)}
                            />
                            <div className={CLASS_BUTTONS}>
                                <ButtonCopy textToCopy={formData.link ?? ''} />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Tags' />
                            <div className={CLASS_PORTRAIT}>
                                {(formData.tags?.length ?? 0) < TAGS_LIMIT && (
                                    <ButtonAdd onClick={handleAddTag} />
                                )}
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputField
                                maxLength={16}
                                value={tagInput}
                                placeholder={`Add up to ${TAGS_LIMIT} tags`}
                                onChange={(value) => setTagInput(sanitizeInput(value))}
                                // onChange={(value) => sanitizeInput(value, setTagInput)}
                            />
                            <div className={CLASS_BUTTONS}>
                                {(formData.tags?.length ?? 0) < TAGS_LIMIT && (
                                    <ButtonAdd onClick={handleAddTag} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='lg:col-start-2 col-span-1 w-full pl-2'>
                        <Tags
                            tags={formData.tags ?? []}
                            onRemove={(tag: string) =>
                                handleChange(
                                    'tags',
                                    (formData.tags ?? []).filter((t) => t !== tag)
                                )
                            }
                        />
                    </div>

                    {/* Note */}
                    <div className={CLASS_FIELD}>
                        <div className='flex items-center justify-between'>
                            <Label text='Note' />
                            <div className={CLASS_PORTRAIT}>
                                <ButtonCopy textToCopy={formData.note ?? ''} />
                            </div>
                        </div>
                        <div className={CLASS_LANDSCAPE}>
                            <InputTextbox
                                minRows={4}
                                maxLength={1024}
                                value={formData.note ?? ''}
                                placeholder='Any other information'
                                onChange={(value) => handleChange('note', value)}
                            />
                            <div className={CLASS_BUTTONS}>
                                <ButtonCopy textToCopy={formData.note ?? ''} />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex justify-center gap-8 flex-wrap p-4'>
                        <Button
                            onClick={handleSave}
                            disabled={!formData.name || !formData.username || !formData.password}
                            // onClick={() => onSave(formData)}
                        >
                            <Save size={18} />
                            Save
                        </Button>
                        <Button
                            variant='secondary'
                            onClick={handleCancel}
                            // onClick={() => {
                            //     setFormData(entry);
                            //     setExpanded(false);
                            // }}
                        >
                            <CircleX size={18} />
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {showConfirm && (
                <ConfirmModal
                    title='Delete Entry'
                    message={`Are you sure you want to delete "${entry.name}"?`}
                    onConfirm={() => {
                        setShowConfirm(false);
                        onDelete?.(entry);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    );
};

export default PasswordCard;

// import { Edit3, Save, Trash2, X } from 'lucide-react';
// import { useState } from 'react';

// interface PasswordCardProps {
//     name: string;
//     username: string;
//     createdDate: string;
//     onDelete: () => void;
//     onSave: (updatedData: { name: string; username: string; password: string }) => void;
//     initialPassword?: string;
// }

// export default function PasswordCard({
//     name,
//     username,
//     createdDate,
//     onDelete,
//     onSave,
//     initialPassword = '',
// }: PasswordCardProps) {
//     const [isOpen, setIsOpen] = useState(false);
//     const [editData, setEditData] = useState({
//         name,
//         username,
//         password: initialPassword,
//     });

//     const handleSave = () => {
//         onSave(editData);
//         setIsOpen(false);
//     };

//     return (
//         <div className='w-full bg-white shadow-md rounded-lg p-4 flex flex-col gap-2 border border-gray-200'>
//             {/* Top row */}
//             <div className='flex items-center justify-between'>
//                 {/* Circle with first letter */}
//                 <div className='flex items-center gap-4'>
//                     <div className='w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-lg text-gray-700'>
//                         {name.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                         <h3 className='text-lg font-semibold'>{name}</h3>
//                         <p className='text-sm text-gray-500'>
//                             {username} • {createdDate}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Action buttons */}
//                 <div className='flex gap-2'>
//                     <button
//                         onClick={() => setIsOpen(!isOpen)}
//                         className='text-gray-500 hover:text-blue-500'>
//                         <Edit3 size={18} />
//                     </button>
//                     <button onClick={onDelete} className='text-gray-500 hover:text-red-500'>
//                         <Trash2 size={18} />
//                     </button>
//                 </div>
//             </div>

//             {/* Dropdown */}
//             {isOpen && (
//                 <div className='mt-3 bg-gray-50 p-3 rounded-lg space-y-3 border border-gray-200'>
//                     <input
//                         type='text'
//                         value={editData.name}
//                         onChange={(e) => setEditData({ ...editData, name: e.target.value })}
//                         className='w-full p-2 rounded border border-gray-300'
//                         placeholder='Service name'
//                     />
//                     <input
//                         type='text'
//                         value={editData.username}
//                         onChange={(e) => setEditData({ ...editData, username: e.target.value })}
//                         className='w-full p-2 rounded border border-gray-300'
//                         placeholder='Username'
//                     />
//                     <input
//                         type='password'
//                         value={editData.password}
//                         onChange={(e) => setEditData({ ...editData, password: e.target.value })}
//                         className='w-full p-2 rounded border border-gray-300'
//                         placeholder='Password'
//                     />

//                     {/* Save / Cancel */}
//                     <div className='flex justify-end gap-3'>
//                         <button
//                             onClick={handleSave}
//                             className='flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'>
//                             <Save size={18} /> Save
//                         </button>
//                         <button
//                             onClick={() => setIsOpen(false)}
//                             className='flex items-center gap-1 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400'>
//                             <X size={18} /> Cancel
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// interface PasswordCardProps {
//     title: string;
//     onEdit: () => void;
// }

// const PasswordCard: React.FC<PasswordCardProps> = ({ title, onEdit }) => (
//     <div className='password-card'>
//         <h3>{title}</h3>
//         <button onClick={onEdit}>Edit</button>
//     </div>
// );

// export default PasswordCard;
