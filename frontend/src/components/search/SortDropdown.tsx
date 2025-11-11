import { SortBy } from '@utils/sortUtil';

type SortDropdownProps = {
    value: SortBy;
    onChange: (_value: SortBy) => void;
};

const SortDropdown: React.FC<SortDropdownProps> = ({ onChange, value }) => (
    <select
        className='input-style rounded-xl p-2 flex-1 w-full shadow-xl cursor-pointer'
        onChange={(e) => onChange(e.target.value as SortBy)}
        value={value}>
        <option value='name'>Name</option>
        <option value='category'>Category</option>
        <option value='createdDate'>Created Date</option>
        <option value='updatedDate'>Updated Date</option>
    </select>
);

export default SortDropdown;
