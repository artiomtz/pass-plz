import Button from '@components/buttons/Button';
import ButtonAdd from '@components/buttons/ButtonAdd';
import ButtonCopy from '@components/buttons/ButtonCopy';
import ButtonEye from '@components/buttons/ButtonEye';
import CircleInitial from '@components/CircleInitial';
import InputCategory from '@components/inputs/InputCategory';
import InputDate from '@components/inputs/InputDate';
import InputField from '@components/inputs/InputField';
import InputTag from '@components/inputs/InputTag';
import InputTextbox from '@components/inputs/InputTextbox';
import Label from '@components/labels/Label';
import ModalConfirmation from '@components/ModalConfirmation';
import Spinner from '@components/Spinner';
import Tags from '@components/tags/Tags';
import useSuggestions from '@hooks/useSuggestions';
import PasswordEntry from '@models/passwordEntry';
import { formatDisplayDate, formatDisplayDateTime } from '@utils/dateUtil';
import { normalizeTag, sanitizeFormData, sanitizeInput, saveFormDataDraft } from '@utils/inputUtil';
import logger from '@utils/loggerUtil';
import { descendMotionProps, scaleMotionProps } from '@utils/motionUtil';
import { sanitizeBadCharacters } from '@utils/passwordUtil';
import { draftStorage } from '@utils/storageUtil';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, CircleX, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface PasswordCardProps {
    draft?: PasswordEntry;
    entry: PasswordEntry;
    expand?: boolean;
    isDeleting?: boolean;
    isDraft?: boolean;
    isNew?: boolean;
    isSaving?: boolean;
    onCancel: () => void;
    onDelete?: (_entry: PasswordEntry) => void;
    onSave: (_entry: PasswordEntry) => void;
    setExpand: (_toggleExpand: boolean) => void;
}

const PasswordCard: React.FC<PasswordCardProps> = ({
    draft,
    entry,
    expand = false,
    isDeleting = false,
    isDraft = false,
    isNew = false,
    isSaving = false,
    onCancel,
    onDelete,
    onSave,
    setExpand,
}) => {
    const [tagInput, setTagInput] = useState('');
    const [formData, setFormData] = useState(entry);
    const [hasDraft, setHasDraft] = useState(isDraft);
    const [showUsername, setShowUsername] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const TAGS_LIMIT = 5;
    const { categories, tags } = useSuggestions();
    const circleInitial = formData.name?.trim()[0]?.toUpperCase();

    const handleChange = (field: keyof PasswordEntry, value: string | string[] | null): void => {
        setHasDraft(true);
        setFormData((prev) => {
            const updated = { ...prev, [field]: value };
            saveFormDataDraft(updated);

            return updated;
        });
    };

    const handleSave = (): void => {
        if (!formData.name?.trim() || !formData.username?.trim() || !formData.password?.trim()) {
            logger.warn('failed to save. required fields must be filled');
            toast.error('Required fields must be filled');

            return;
        }

        draftStorage.clear(entry.id);
        onSave(sanitizeFormData(formData));
        setShowUsername(false);
        setShowPassword(false);
        setHasDraft(false);
        setTagInput('');
    };

    const handleCancel = (): void => {
        if (isNew) {
            onCancel();
            toast.success('New password cancelled');
        } else {
            setExpand(false);
            setFormData(entry);
            if (hasDraft) {
                toast.success('Draft cancelled');
            }
        }
        draftStorage.clear(entry.id);
        setShowUsername(false);
        setShowPassword(false);
        setHasDraft(false);
        setTagInput('');
    };

    const handleTrashClick = (): void => {
        if (isNew) {
            onCancel();
            setHasDraft(false);
            draftStorage.clear(entry.id);
            toast.success('New password cancelled');
        } else {
            setShowConfirmDelete(true);
        }
    };

    const handleAddTag = (): void => {
        const tag = normalizeTag(tagInput);

        if (!tag || formData.tags?.includes(tag) || (formData.tags?.length ?? 0) >= TAGS_LIMIT) {
            logger.warn(`failed to add tag. must be a unique tag and password can have up to ${TAGS_LIMIT} tags`);
            toast.error('Tag must be unique within limits');

            return;
        }

        handleChange('tags', [...(formData.tags ?? []), tag]);
        setTagInput('');
        logger.info('successfully added tag: ', tag);
    };

    const toggleExpand = (): void => {
        setExpand(!expand);
        if (expand) {
            setShowUsername(false);
            setShowPassword(false);
            if (hasDraft) {
                toast.success('Draft saved');
            }
        }
    };

    useEffect(() => {
        setFormData(draft ?? entry);
    }, [entry]);

    useEffect(() => {
        if (draft) {
            toast.success(`Draft loaded for ${draft.name}`);
        }
    }, []);

    useEffect(() => {
        if (!isSaving) {
            setExpand(false);
        }
    }, [isSaving]);

    const CLASS_LANDSCAPE = 'flex items-center gap-6';
    const CLASS_PORTRAIT = 'flex lg:hidden items-center gap-4';
    const CLASS_BUTTONS = 'hidden lg:flex items-center gap-4';
    const CLASS_FIELD = 'grid grid-cols-1 lg:grid-cols-[120px_1fr] items-center gap-2 lg:gap-10 m-2';

    return (
        <div
            className={`flex flex-col gap-2 border shadow-xl rounded-xl p-4 ${hasDraft ? 'card-style-draft' : 'card-style'}`}>
            <div
                className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 w-full cursor-pointer'
                onClick={toggleExpand}>
                <div className='flex flex-1 items-center gap-6'>
                    <CircleInitial initial={circleInitial} />
                    <div className='flex flex-col '>
                        <span className='font-semibold truncate md:max-w-[22rem] max-w-[12rem]'>
                            {isNew ? (
                                <span className='bold-style'>New Unsaved Password</span>
                            ) : hasDraft ? (
                                <>
                                    <span className='bold-style'>DRAFT: </span>
                                    {formData.name}
                                </>
                            ) : (
                                formData.name
                            )}
                        </span>
                        <span className='text-sm min-h-[1.25rem]'>{formData.category || ''}</span>
                    </div>
                </div>
                <div className='flex sm:flex-row sm:items-start justify-between w-full sm:w-auto gap-4 p-1'>
                    <div className='flex flex-col text-xs w-full sm:w-auto items-end'>
                        <span>Created: {formatDisplayDateTime(formData.createdDate)}</span>
                        <span>Updated: {formatDisplayDateTime(formData.updatedDate)}</span>
                    </div>
                    <div className='flex items-center gap-4'>
                        <button
                            className='icon-style hover-style'
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand();
                            }}>
                            <AnimatePresence
                                initial={false}
                                mode='wait'>
                                {expand ? (
                                    <motion.div
                                        key='button-chevron-up'
                                        {...scaleMotionProps}>
                                        <ChevronUp size={26} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key='button-chevron-down'
                                        {...scaleMotionProps}>
                                        <ChevronDown size={26} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                        <button
                            className='ml-auto icon-style hover-style'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTrashClick();
                            }}>
                            {isDeleting ? <Spinner /> : <Trash2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {expand && (
                    <motion.div
                        key={'password-card-' + entry.id}
                        {...descendMotionProps}>
                        <div className='flex flex-col gap-2 mt-4'>
                            {/* Name */}
                            <div className={CLASS_FIELD}>
                                <div className='flex items-center justify-between'>
                                    <Label
                                        bold
                                        text='Name'
                                    />
                                    <div className={CLASS_PORTRAIT}>
                                        <ButtonCopy textToCopy={formData.name ?? ''} />
                                    </div>
                                </div>
                                <div className={CLASS_LANDSCAPE}>
                                    <InputField
                                        className={!formData.name?.trim() ? 'warning-style' : ''}
                                        maxLength={32}
                                        onChange={(value) => handleChange('name', value)}
                                        placeholder='i.e Google, Banking'
                                        value={formData.name ?? ''}
                                    />
                                    <div className={CLASS_BUTTONS}>
                                        <ButtonCopy textToCopy={formData.name ?? ''} />
                                    </div>
                                </div>
                            </div>

                            {/* Username */}
                            <div className={CLASS_FIELD}>
                                <div className='flex items-center justify-between'>
                                    <Label
                                        bold
                                        text='Username'
                                    />
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
                                        className={!formData.username ? 'warning-style' : ''}
                                        maxLength={32}
                                        onChange={(value) => handleChange('username', sanitizeBadCharacters(value))}
                                        placeholder='Your username'
                                        type={showUsername ? 'text' : 'password'}
                                        value={formData.username ?? ''}
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
                                    <Label
                                        bold
                                        text='Password'
                                    />
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
                                        className={!formData.password ? 'warning-style' : ''}
                                        maxLength={64}
                                        onChange={(value) => handleChange('password', sanitizeBadCharacters(value))}
                                        placeholder='Your password'
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password ?? ''}
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
                                        <ButtonCopy textToCopy={formatDisplayDate(formData.expirationDate) ?? ''} />
                                    </div>
                                </div>
                                <div className={CLASS_LANDSCAPE}>
                                    <InputDate
                                        onChange={(value) => handleChange('expirationDate', value)}
                                        placeholder='Expiry date'
                                        value={formData.expirationDate}
                                    />
                                    <div className={CLASS_BUTTONS}>
                                        <ButtonCopy textToCopy={formatDisplayDate(formData.expirationDate) ?? ''} />
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
                                    <InputCategory
                                        onChange={(value) => handleChange('category', value)}
                                        suggestions={categories}
                                        value={formData.category ?? ''}
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
                                        onChange={(value) => handleChange('link', sanitizeBadCharacters(value))}
                                        placeholder='The service URL'
                                        value={formData.link ?? ''}
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
                                        <ButtonAdd
                                            disabled={
                                                !tagInput ||
                                                (formData.tags?.length ?? 0) >= TAGS_LIMIT ||
                                                (formData.tags?.includes(tagInput) ?? false)
                                            }
                                            onClick={handleAddTag}
                                        />
                                    </div>
                                </div>
                                <div className={CLASS_LANDSCAPE}>
                                    <InputTag
                                        limit={TAGS_LIMIT}
                                        onChange={(value) => setTagInput(sanitizeInput(value))}
                                        suggestions={tags}
                                        value={tagInput}
                                    />
                                    <div className={CLASS_BUTTONS}>
                                        <ButtonAdd
                                            disabled={
                                                !tagInput ||
                                                (formData.tags?.length ?? 0) >= TAGS_LIMIT ||
                                                (formData.tags?.includes(tagInput) ?? false)
                                            }
                                            onClick={handleAddTag}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='lg:col-start-2 col-span-1 w-full pl-2'>
                                <Tags
                                    onRemove={(tag: string) =>
                                        handleChange(
                                            'tags',
                                            (formData.tags ?? []).filter((t) => t !== tag)
                                        )
                                    }
                                    tags={formData.tags ?? []}
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
                                        maxLength={1024}
                                        minRows={4}
                                        onChange={(value) => handleChange('note', value)}
                                        placeholder='Any other information'
                                        value={formData.note ?? ''}
                                    />
                                    <div className={CLASS_BUTTONS}>
                                        <ButtonCopy textToCopy={formData.note ?? ''} />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className='flex flex-wrap justify-center gap-8 p-4'>
                                <Button
                                    disabled={
                                        !formData.name?.trim() ||
                                        !formData.username?.trim() ||
                                        !formData.password?.trim()
                                    }
                                    onClick={handleSave}>
                                    <>
                                        {isSaving ? <Spinner /> : <Save size={18} />}
                                        Save
                                    </>
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant='info'>
                                    <CircleX size={18} />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ModalConfirmation
                message={`Are you sure you want to delete "${formData.name}"?`}
                onCancel={() => setShowConfirmDelete(false)}
                onConfirm={() => {
                    setShowConfirmDelete(false);
                    onDelete?.(entry);
                }}
                show={showConfirmDelete}
                title='Delete Entry'
            />
        </div>
    );
};

export default PasswordCard;
