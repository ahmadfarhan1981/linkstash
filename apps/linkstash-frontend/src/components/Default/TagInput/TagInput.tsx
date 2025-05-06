"use client";

import React, {ReactNode, useRef, useState} from 'react';

import {TagInputAutoCompleteContext} from './subcomponents/TagInputAutocompleteContext';
import {TagInputAutoCompleteTextbox} from './subcomponents/TagInputAutoCompleteTextbox';
import {TagInputAutocompleteDropDown} from './subcomponents/TagInputAutocompleteDropDown';
import {TagInputSelectedTags} from './subcomponents/TagInputSelectedTags';
import {TagInputContextProps, TagInputContext} from './TagInputContext';

export interface TagInputProps extends TagInputContextProps {
  children?: ReactNode;
}

export function TagInput({
  children,
  ...inputProps
}: Omit<TagInputProps, "addTag" | "removeTag">) {
  // Remove a tag from the selected list.
  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    onSelectedTagsChange && onSelectedTagsChange(newTags);
  };

  const { selectedTags, onSelectedTagsChange } = inputProps;
  // Add a tag if it's not already selected.
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      const newTags = [...selectedTags, trimmed];
      onSelectedTagsChange && onSelectedTagsChange(newTags);
    }
  };

  const contextProps: TagInputContextProps = {
    ...inputProps,
    addTag,
    removeTag,
  };

  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const tagInputAutoCompleteContext = {
    inputValue,
    setInputValue,
    suggestions,
    setSuggestions,
    isDropdownOpen,
    setIsDropdownOpen,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    inputRef,
  };

  return (
    <TagInputContext.Provider value={contextProps}>
      <TagInputAutoCompleteContext.Provider value={tagInputAutoCompleteContext}>
        <div>{children || defaultTagInputComponent}</div>
      </TagInputAutoCompleteContext.Provider>
    </TagInputContext.Provider>
  );
}
TagInput.Textbox = TagInputAutoCompleteTextbox;
TagInput.AutoCompleteSuggestion = TagInputAutocompleteDropDown;
TagInput.SelectedTags = TagInputSelectedTags;

const defaultTagInputComponent = (
  <>
    <div className='relative inline-block'>
      <TagInput.Textbox />
      <TagInput.AutoCompleteSuggestion />
    </div>

    <TagInput.SelectedTags />
  </>
);
