const LabelTermsConditions: React.FC = () => {
    return (
        <label
            className='text-gray-500 text-gray-300'
            htmlFor='terms'>
            By using the Pass Plz
            <br />
            you agree to the the{' '}
            <a
                className='font-semibold group relative text-zinc-400'
                id='terms'>
                Terms and Conditions
                <span className='font-medium absolute z-10 hidden group-hover:block top-full mt-1 w-64 p-2 text-xs rounded bg-gray-800 text-white shadow-lg'>
                    By using this service, you agree that Pass Plz is not liable for any damages, losses, or data
                    breaches. Use at your own risk. No warranties are implied.
                </span>
            </a>
        </label>
    );
};

export default LabelTermsConditions;
