import { SuggestionsContext, SuggestionsContextType } from '@contexts/SuggestionsContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';

export const useSuggestions = (): SuggestionsContextType => {
    //   const ctx = useContext(SuggestionsContext);
    //   if (!ctx) {
    //     throw new Error("useSuggestions must be used within SuggestionsProvider");
    //   }
    //   return ctx;

    const context = useContext(SuggestionsContext);
    if (!context) {
        console.warn('no suggestions context');
        // toast
        // log
        toast.error('Failed to fetch suggestions context');
        throw new Error('useSuggestions must be used within an SuggestionsProvider');
    }
    return context;
};
