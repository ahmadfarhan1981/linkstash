
import React, {useEffect} from 'react';

import styles from '@/components/Default/InputComponent/InputComponent.module.css';

import { useTagInputContext } from '../TagInputContext';

import { useTagInputAutoCompleteContext } from './TagInputAutocompleteContext';

export function TagInputAutoCompleteTextbox() {
  const {placeholder, addTag, tagsToChooseFrom, selectedTags, label} = useTagInputContext();
  const {inputRef, inputValue, setInputValue, suggestions, setActiveSuggestionIndex, activeSuggestionIndex, setSuggestions, setIsDropdownOpen}  = useTagInputAutoCompleteContext();

  useEffect(() => {
    const filtered = (inputValue.trim() === "") ? []
      : tagsToChooseFrom.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selectedTags.includes(tag)
      );

    if( (filtered.length > 0) !== (suggestions.length > 0) ) {
      setIsDropdownOpen(filtered.length > 0 );
    }
    if (JSON.stringify(filtered) !== JSON.stringify(suggestions)) {
      setSuggestions(filtered);
    }

  }, [inputValue, tagsToChooseFrom, selectedTags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestionIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setActiveSuggestionIndex(prev =>
          prev > 0 ? prev - 1 : -1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex !== -1) {
        addTag(suggestions[activeSuggestionIndex]);
      } else {
        addTag(inputValue);
      }
      setInputValue("");
      setSuggestions([]);
      setIsDropdownOpen(false);
      setActiveSuggestionIndex(-1);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setActiveSuggestionIndex(-1);
    }
  };
  /**
   * label has min width of 90
   * input has min width of 350
   * anything 440 and above will make it inline, given that the text dont exceed the width
   */
  const maxWidthInPixel = 350
  return (
    <div style={{maxWidth:Number.parseInt(maxWidthInPixel.toString())+"px", minWidth:'100px'}}>
      {/* Input field */}

      <label className={styles["form-label"] + " "} >
          <span className={`max-w-100 inline-block mr-2 min-w-[90px] text-black ${label ? "" : "hidden"}`}>
            {label}
          </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles["form-input"].concat(" form-input") + " w-[350px] "}
        />
      </label>
    </div>
  )
}