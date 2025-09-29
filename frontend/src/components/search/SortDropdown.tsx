import { SortBy } from '@utils/sortUtil';

type SortDropdownProps = {
    value: SortBy;
    onChange: (_value: SortBy) => void;
};

const SortDropdown: React.FC<SortDropdownProps> = ({ onChange, value }) => {
    return (
        <select
            className='border rounded p-2 flex-1 w-full shadow-lg'
            onChange={(e) => {
                return onChange(e.target.value as SortBy);
            }}
            value={value}>
            <option value='name'>Name</option>
            <option value='category'>Category</option>
            <option value='createdDate'>Created Date</option>
            <option value='updatedDate'>Updated Date</option>
        </select>
    );
};

export default SortDropdown;
