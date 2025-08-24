import { SortBy } from '@utils/sortUtil';

type SortDropdownProps = {
    value: SortBy;
    onChange: (value: SortBy) => void;
};

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortBy)}
        className='border rounded p-2 flex-1 w-full shadow-lg'>
        <option value='name'>Name</option>
        <option value='category'>Category</option>
        <option value='createdDate'>Created Date</option>
        <option value='updatedDate'>Updated Date</option>
    </select>
);

// import React from 'react';

// type SortBy = 'name' | 'category' | 'createdDate' | 'updatedDate';
// type SortOrder = 'asc' | 'desc';

// interface SortDropdownProps {
//     sortBy: SortBy;
//     sortOrder: SortOrder;
//     onSortByChange: (value: SortBy) => void;
//     onSortOrderChange: (value: SortOrder) => void;
// }

// export const SortDropdown: React.FC<SortDropdownProps> = ({
//     sortBy,
//     sortOrder,
//     onSortByChange,
//     onSortOrderChange,
// }) => {
//     return (
//         <div className='flex items-center gap-2'>
//             <select
//                 value={sortBy}
//                 onChange={(e) => onSortByChange(e.target.value as SortBy)}
//                 className='border rounded p-2'>
//                 <option value='name'>Name</option>
//                 <option value='category'>Category</option>
//                 <option value='createdDate'>Created Date</option>
//                 <option value='updatedDate'>Updated Date</option>
//             </select>

//             <select
//                 value={sortOrder}
//                 onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
//                 className='border rounded p-2'>
//                 <option value='asc'>Ascending</option>
//                 <option value='desc'>Descending</option>
//             </select>
//         </div>
//     );
// };
