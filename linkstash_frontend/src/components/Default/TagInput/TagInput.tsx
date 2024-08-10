"use client";

import {
  FieldError,
  GridList,
  GridListItem,
  Input,
  Label,
  Link,
  Popover,
  Text,
  TextField
} from "react-aria-components";
import { Key, useEffect, useRef, useState } from "react";
import { ListData, useListData } from "react-stately";
import { MyTag, MyTagGroup } from "@/components";

import { TagListItem } from "@/types";
import styles from "../InputComponent/InputComponent.module.css"; //TODO refactor style

export type TagInputProps = {
  tagsToChooseFrom?: TagListItem[];
  selectedTags: ListData<TagListItem>;
  maxWidthInPixel?: Number;
  inputLabel?: string;
  selectedLabel?: string;
  description: string;
};



export function TagInput(props: TagInputProps  ) {
  const { selectedTags, tagsToChooseFrom=[], maxWidthInPixel=150, inputLabel, selectedLabel, description } = props; //TODO default values
  const gridListRef = useRef<HTMLInputElement>(null);
  const tagInput = useRef(null);
  const [tagListInput, setTagListInput] = useState<Key | null>("");
  const [isOpen, setIsOpen] = useState(false);

   
  
  const handleTagInputChange = (value: string) => {
    setTagListInput(value);
    filteredTagsToChooseFrom.setFilterText(value);
  };

  const filterTagList = (item: TagListItem, filterText: string) => {
    const partOfItem = filterText
      ? item.name.includes(filterText) //|| item.id.includes(filterText)
      : true;
    const addedTag = selectedTags.getItem(item.id);
    const result = partOfItem && !addedTag;
    return result;
    //return partOfItem
  };

  const filteredTagsToChooseFrom = useListData({
    initialItems: tagsToChooseFrom,
    getKey: (item) => item.id,
    filter: filterTagList,
  });

  const clearTagListInput = () => {
    setTagListInput("");
  };
  const appendToTaglist = (value: TagListItem) => {
    if (value) {
      if (!selectedTags.getItem(value.id)) selectedTags.append({ id: value.id, name: value.name });
    }
  };

  const handleKeyDown = (e: any) => {
    const { value } = e.target;

    if (e.key === "Enter") {
      e.preventDefault();
      appendToTaglist({id:value, name:value});
      clearTagListInput();
      filteredTagsToChooseFrom.setFilterText("");
      setIsOpen(false);
    }
    if (e.key === "ArrowDown" && gridListRef.current) {
      gridListRef.current.focus();
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
    // console.log(e.key);
  };

  useEffect(() => {
    const haveInput = tagListInput && tagListInput.toString().length > 0;
    const foundTags = filteredTagsToChooseFrom.items.length > 0;

    if (haveInput && foundTags) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [tagListInput, filteredTagsToChooseFrom.items.length]);
  


  return (
    <>
      <div style={{width:Number.parseInt(maxWidthInPixel.toString())}} >      
      <div id="tagListInputDiv">
      <label className={styles["form-label"]} >
          <TextField            
            ref={tagInput}
            onChange={handleTagInputChange}
            value={tagListInput?.toString()}
            onKeyDown={handleKeyDown}
          >
            {/* //TODO refactor style */}
            <Label className={styles["form-label"]} ><span className={`inline-block mr-2 min-w-[90px] ${inputLabel?"":"hidden"}`}>{inputLabel}{" "}</span>
            <Input className={styles["form-input"].concat(" form-input")} />
            </Label>  
            <Text slot="description" />
            <FieldError />
          </TextField>
          </label>
        </div>
        <Popover isOpen={isOpen} triggerRef={tagInput} className={"popover"}>
          <GridList
            className={({ isEmpty }) => `
          border-2 mt-1 big
          ${
            isEmpty || !tagListInput || tagListInput.toString().length === 0
              ? ""
              : ""
          }            
          `}
            ref={gridListRef}
            id="existingTagGrid"
            aria-label="Existing tags that matches input"
            selectionMode="multiple"
            onAction={(e) => {
              const tag = tagsToChooseFrom.find((tag)=> tag.id == e.toString() )
              if (tag) appendToTaglist( tag );
              setTagListInput("");
              setIsOpen(false);
            }}
            items={filteredTagsToChooseFrom.items}
          >
            {(item) => (
              <GridListItem
                className={
                  "tag-autocomplete-item before:content-['#'] after:content-[' ']"
                }
                textValue={item.name}
                id={item.id}
              >
                {item.name}
              </GridListItem>
            )}
          </GridList>
        </Popover>
        <div id="selectedTagListDiv" className="overflow-x-auto">
          <MyTagGroup
            aria-label={selectedLabel}
            label={selectedLabel?selectedLabel:""}
            renderEmptyState={() => "**no tags specified**"}
            onRemove={(keys) => selectedTags.remove(...keys)}
            description={description}
          >            
            {selectedTags.items.map((tag) => (
              <MyTag
                key={tag.id}
                id={tag.id}
                textValue={tag.name}
                className={
                  "font-light underline inline bg-blue-100 mx-1 px-1 rounded  border-purple-200  border-2 before:content-['#'] after:content-[' '] before:font-medium hover:bg-purple-300"
                }
              >
                <Link href={`/tags/${tag}`}>{tag.name}</Link>
              </MyTag>
            ))}            
          </MyTagGroup>
          </div>
      </div>      
    </>
  );
}