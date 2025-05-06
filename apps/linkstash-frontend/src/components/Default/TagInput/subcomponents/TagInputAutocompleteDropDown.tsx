import React, { useEffect, useState }  from 'react';

import {useTagInputAutoCompleteContext} from '@/components/Default/TagInput/subcomponents/TagInputAutocompleteContext';
import {useTagInputContext} from '@/components/Default/TagInput/TagInputContext';

export function TagInputAutocompleteDropDown() {
  const {addTag} = useTagInputContext();
  const [inputWidth, setInputWidth] = useState<number | null>(null);
  const {isDropdownOpen, setInputValue, setSuggestions, setIsDropdownOpen,setActiveSuggestionIndex, activeSuggestionIndex, suggestions, inputRef} = useTagInputAutoCompleteContext();

  useEffect(() => {
    if (inputRef?.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [inputRef?.current]);

  return <>
    {/* Autocomplete suggestions dropdown */}
    {isDropdownOpen && (
      <ul        
        className={"border-[1px] border-[#ccc] bg-white opacity-95 mt-2 px-1 "}
      >
        {suggestions.map((suggestion, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
          <li
            key={suggestion}
            onClick={(e) => {
              e.preventDefault();
              addTag(suggestion);
              setInputValue("");
              setSuggestions([]);
              setIsDropdownOpen(false);
              setActiveSuggestionIndex(-1);
            }}
            className={
              "cursor-pointer rounded-sm before:content-['#'] before:font-normal after:content-[' '] " +
              (index === activeSuggestionIndex
                ? "bg-[rgb(216,180,254)] border-blue-600"
                : "bg-[rgb(219,234,254)] border-purple-200") +
              " hover:bg-[rgb(216,180,254)] " +
              // "bg-blue-100 " +
              "hover:bg-purple-300 " +
              "rounded " +
              " border-2 font-thin"
            }
          >
            {suggestion}
          </li>
        ))}
      </ul>
    )}
  </>;
}