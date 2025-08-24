import { InputHTMLAttributes } from 'react';

interface InputFieldWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
}

const InputFieldWithLabel: React.FC<InputFieldWithLabelProps> = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className='mb-2 block text-gray-900'>
            {label}
        </label>
        <input
            id={id}
            className='block w-full rounded-2xl border border-gray-300 bg-gray-50 p-3 text-gray-500 shadow-lg focus:outline-zinc-400'
            {...props}
        />
    </div>
);

export default InputFieldWithLabel;

// import React from 'react';

// interface InputFieldProps {
//     id: string;
//     label: string;
//     type?: string;
//     placeholder?: string;
//     value?: string;
//     onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const InputField: React.FC<InputFieldProps> = ({
//     id,
//     label,
//     type = 'text',
//     placeholder,
//     value,
//     onChange,
// }) => {
//     return (
//         <div className='w-full'>
//             <label htmlFor={id} className='mb-2 block text-gray-900'>
//                 {label}
//             </label>
//             <input
//                 id={id}
//                 type={type}
//                 placeholder={placeholder}
//                 value={value}
//                 onChange={onChange}
//                 className='block w-full rounded-2xl border border-gray-300 bg-gray-50 p-3 text-gray-500 shadow-lg focus:outline-zinc-400'
//             />
//         </div>
//     );
// };

// export default InputField;

/////////////////////////////////////////////

// import { ReactNode } from 'react';

// interface InputFieldProps {
//     children: ReactNode;
//     onClick: (...args: any[]) => void;
// }

// const InputField: React.FC<InputFieldProps> = ({ children, onClick }) => {
//     return (
//         // <button
//         //     className='w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-2xl border shadow-xl transition cursor-pointer hover:bg-gray-200 border-zinc-400'
//         //     onClick={onClick}>
//         //     {children}
//         // </button>

//         <div>
//             <label htmlFor='email' className='block mb-2 text-gray-900'>
//                 Email
//             </label>
//             <input
//                 id='email'
//                 type='text'></input>
//                 placeholder='me@email.com'
//                 className='bg-gray-50 border border-gray-300 text-gray-500 rounded-2xl block w-full p-3 shadow-lg focus:outline-zinc-400'
//         </div>
//     );
// };

// export default InputField;
