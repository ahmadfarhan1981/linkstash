import {Dispatch, RefObject, SetStateAction, createContext, useContext} from 'react';



export type TagInputAutoCompleteContextProps = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  suggestions: string[];
  setSuggestions: Dispatch<SetStateAction<string[]>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  activeSuggestionIndex: number;
  setActiveSuggestionIndex: Dispatch<SetStateAction<number>>;
  inputRef: RefObject<HTMLInputElement>;
};

export const TagInputAutoCompleteContext = createContext<TagInputAutoCompleteContextProps|null>(null)

export function useTagInputAutoCompleteContext (): TagInputAutoCompleteContextProps {
  const context  = useContext(TagInputAutoCompleteContext);
  if(!context){
    throw new Error (
      "Must be rendered as part of BookmarkCard!!!!!"
    )
  }
  return context;
}
