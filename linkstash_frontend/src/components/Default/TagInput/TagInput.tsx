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

export type TagInputProps = {
  tagsToChooseFrom?: TagListItem[];
  selectedTags: ListData<TagListItem>;
  maxWidthInPixel?: Number;
};



export function TagInput(props: TagInputProps  ) {
  const { selectedTags, tagsToChooseFrom=[], maxWidthInPixel=150 } = props;
  const gridListRef = useRef(null);
  const tagInput = useRef(null);
  const [tagListInput, setTagListInput] = useState<Key | null>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleTagListChange = (value: string) => {
    setTagListInput(value);
    filteredTagsToChooseFrom.setFilterText(value);
  };

  const filterTagList = (item: TagListItem, filterText: string) => {
    const partOfItem = filterText
      ? item.name.includes(filterText) || item.id.includes(filterText)
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
  const appendToTaglist = (value: string) => {
    if (value) {
      if (!selectedTags.getItem(value)) selectedTags.append({ id: value, name: value });
    }
  };

  const handleKeyDown = (e: any) => {
    const { value } = e.target;

    if (e.key === "Enter") {
      e.preventDefault();
      appendToTaglist(value);
      clearTagListInput();
      filteredTagsToChooseFrom.setFilterText("");
      setIsOpen(false);
    }
    if (e.key === "ArrowDown") {
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
      <div style={{width:maxWidthInPixel}} className={" border-2 "}>
        <div id="tagListInputDiv" className={" border-2"}>
          <TextField
            className={"w-[250px]"}
            ref={tagInput}
            onChange={handleTagListChange}
            value={tagListInput}
            onKeyDown={handleKeyDown}
          >
            <Label />
            <Input />
            <Text slot="description" />
            <FieldError />
          </TextField>
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
              appendToTaglist(e.toString());
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
        <div id="selectedTagListDiv" className="overflow-x-auto border-2">
          <MyTagGroup
            aria-label="Added tags"
            label="Tags:"
            renderEmptyState={() => "**no tags specified**"}
            onRemove={(keys) => selectedTags.remove(...keys)}
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