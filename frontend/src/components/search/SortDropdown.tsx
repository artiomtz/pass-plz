import { SortBy } from '@utils/sortUtil';

type SortDropdownProps = {
    value: SortBy;
    onChange: (_value: SortBy) => void;
};

const SortDropdown: React.FC<SortDropdownProps> = ({ onChange, value }) => (
    <select
        className='flex-1 w-full h-12 p-2 rounded-xl shadow-xl cursor-pointer input-style'
        onChange={(e) => onChange(e.target.value as SortBy)}
        value={value}>
        <option value='name'>Name</option>
        <option value='category'>Category</option>
        <option value='createdDate'>Created Date</option>
        <option value='updatedDate'>Updated Date</option>
    </select>
);

export default SortDropdown;
