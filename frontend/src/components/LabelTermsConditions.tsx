const LabelTermsConditions: React.FC = () => {
    return (
        <label htmlFor='terms' className='text-gray-500 text-gray-300'>
            By using the Pass Plz
            <br />
            you agree to the the{' '}
            <a
                id='terms'
                className='font-semibold group relative text-zinc-400'
                // className='relative font-medium hover:underline text-blue-600 group'
            >
                Terms and Conditions
                <span className='font-medium absolute z-10 hidden group-hover:block top-full mt-1 w-64 p-2 text-xs rounded bg-gray-800 text-white shadow-lg'>
                    By using this service, you agree that Pass Plz is not liable for any damages,
                    losses, or data breaches. Use at your own risk. No warranties are implied.
                </span>
            </a>
        </label>
    );
};

export default LabelTermsConditions;
