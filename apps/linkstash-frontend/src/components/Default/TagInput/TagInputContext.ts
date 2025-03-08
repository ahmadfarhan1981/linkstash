'use client'
import {createContext, useContext} from 'react';


export type TagInputContextProps = {
  /** List of all available tags */
  tagsToChooseFrom: string[];
  /** Currently selected tags */
  selectedTags: string[];
  /**
   * Callback when the selected tags change.
   * Use this to update the parent’s state.
   */
  onSelectedTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  selectedTagsLabel?: string;
  /** Normally you wont set these
   * there are  are set by the TagInput providers */
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;

};




const TagInputContext = createContext<TagInputContextProps|null>(null)

export function useTagInputContext (): TagInputContextProps {
  const context  = useContext(TagInputContext);
  if(!context){
    throw new Error (
      "Must be rendered as part of BookmarkCard"
    )
  }
  return context;
}

export default TagInputContext;