const LabelTermsConditions: React.FC = () => (
    <label htmlFor='terms'>
        By using the Pass Plz
        <br />
        you agree to the the{' '}
        <button
            className='popup-style-wrapper relative group'
            id='terms'>
            <span className='font-semibold'>Terms and Conditions</span>
            <div className='text-left absolute right-0 lg:right-auto top-full mt-1 w-64 p-4 rounded-2xl shadow-xl popup-style'>
                By using this service, you agree that Pass Plz is not liable for any damages, losses, or data breaches.
                Use at your own risk. No warranties are implied.
            </div>
        </button>
    </label>
);

export default LabelTermsConditions;
