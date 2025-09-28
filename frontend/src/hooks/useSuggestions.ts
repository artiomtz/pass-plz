import { SuggestionsContext, SuggestionsContextType } from '@contexts/SuggestionsContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';

const useSuggestions = (): SuggestionsContextType => {
    const context = useContext(SuggestionsContext);
    if (!context) {
        console.error('failed to fetch suggestions context');
        toast.error('Failed to fetch suggestions context');
        throw new Error('useSuggestions must be used within an SuggestionsProvider');
    }

    return context;
};

export default useSuggestions;
