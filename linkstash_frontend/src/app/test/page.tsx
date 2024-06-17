/* eslint-disable no-console */
/* eslint-disable sort-imports */
/* eslint-disable compat/compat */
"use client";

import { MyTag, MyTagGroup } from "@/components";
import { Key, useRef, useState } from "react";

import {
  Button,
  FieldError,
  GridList,
  GridListItem,
  Input,
  Label,
  Link,
  Popover,
  Text,
  TextField,
  isTextDropItem,
  useDragAndDrop,
} from "react-aria-components";
import { useListData } from "react-stately";

export default function Home() {
  const gridListRef = useRef(null);
  const tagInput = useRef(null);
  
  const [tagListInput, setTagListInput] = useState<Key | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const tagList = useListData({
    initialItems: ["read-later"],
    getKey: (item) => item,
  });

  const delayAbit = () => {
    const tagList = document.getElementById("existingTagGrid");
    if (!tagList?.dataset.empty) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleTagListChange = (value) => {
    setTagListInput(value);
    existingTaglist.setFilterText(value);
    // TODO debounce
    setTimeout(delayAbit, 500);
  };

  const filterTagList = (item: any, filterText: string) => {
    const partOfItem = filterText ? item.name.includes(filterText) : true;

    const inTagList = tagList.items.includes(item.name);

    //console.log(item, partOfItem, tagList.items, inTagList)
    return partOfItem && !inTagList;
  };

  const existingTaglist = useListData({
    initialItems: [
      { id: "read-later", name: "read-later" },
      { id: "test", name: "test" },
      { id: "tes2", name: "tes2" },
    ],
    getKey: (item) => item.id,
    filter: filterTagList,
  });

  const clearTagListInput = () => {
    setTagListInput("");
  };
  const appendToTaglist = (value: string) => {
    if (value) {
      if (!tagList.getItem(value)) tagList.append(value);
      //debounce(clearTagListCombo, 1000)
    }
  };

  const handleKeyDown = (e: any) => {
    const { value } = e.target;

    if (e.key === "Enter") {
      e.preventDefault();
      appendToTaglist(value);
      clearTagListInput();
      existingTaglist.setFilterText("");
      setIsOpen(false);
    }
    if (e.key === "ArrowDown") {
      gridListRef.current.focus();
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
    console.log(e.key);
  };

  return (
    <>
      <div>
        <div>
          <TextField
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
              ? "hidden"
              : ""
          }            
          `}
            ref={gridListRef}
            id="existingTagGrid"
            aria-label="Favorite pokemon"
            selectionMode="multiple"
            onAction={(e) => {
              console.log(e);
              console.log(typeof e);
              appendToTaglist(e.toString());
              setTagListInput("")
              setIsOpen(false);
            }}
            items={existingTaglist.items}
          >
            {(item) => (
              <GridListItem className={"tag-autocomplete-item before:content-['#'] after:content-[' ']"} textValue={item.name} id={item.id}>
                {item.name}
                <Button aria-label="Info">ⓘ</Button>
              </GridListItem>
            )}
          </GridList>
        </Popover>

        <div className="tag-container">
          <MyTagGroup
            aria-label="Added tags"
            label="Tags:"
            renderEmptyState={() => "emptyTag"}
          >
            {tagList.items.map((tag) => (
              <MyTag
                key={tag}
                id={tag}
                textValue={tag}
                className={
                  "font-light inline bg-blue-100 mx-1 px-1 rounded  border-purple-200  border-2 before:content-['#'] after:content-[' '] before:font-medium hover:bg-purple-300"
                }
              >
                <Link href={`/tags/${tag}`}>{tag}</Link>
              </MyTag>
            ))}
          </MyTagGroup>
        </div>
      </div>
    </>
  );
}
