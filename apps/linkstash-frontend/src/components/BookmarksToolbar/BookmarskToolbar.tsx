"use client";

import { BiSortDown, BiSortUp } from "react-icons/bi";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import React, { ChangeEvent, ReactNode } from "react";
import { Key } from "@react-types/shared";
import { debounce } from "lodash-es";
import { useListData } from "react-stately";

import { SortBy, SortDirection } from "@/hooks";
import {
  useQuerySelector,
  useUpdateQuery,
} from "@/components/Providers/QueryStateProvider/QueryStateProvider";

import { InputComponent } from "../Default";

export type SortListItem = {
  id: string;
  name: string;
  icon: ReactNode;
  sortBy: SortBy;
  sortDirection: SortDirection;
};

export function BookmarksToolbar() {
  const sortBy = useQuerySelector("sortBy");
  const sortDirection = useQuerySelector("sortDirection");
  const pageSize = useQuerySelector("perPage");
  const filter = useQuerySelector("filter");
  const updateQuery = useUpdateQuery();

  let list = useListData<SortListItem>({
    initialItems: [
      {
        id: "created DESC",
        name: "Date added",
        icon: <BiSortDown className="inline text-accent" />,
        sortBy: "created",
        sortDirection: "DESC",
      },
      {
        id: "created ASC",
        name: "Date added",
        icon: <BiSortUp className="inline text-accent" />,
        sortBy: "created",
        sortDirection: "ASC",
      },
      {
        id: "title ASC",
        name: "Title",
        icon: <BiSortUp className="inline text-accent" />,
        sortBy: "title",
        sortDirection: "ASC",
      },
    ],
    initialSelectedKeys: ["created DESC"],
    getKey: (item) => item.id,
  });

  let pageSizes = useListData({
    initialItems: [
      { id: "5", name: "5" },
      { id: "10", name: "10" },
      { id: "20", name: "20" },
      { id: "50", name: "50" },
    ],
    initialSelectedKeys: ["10"],
    getKey: (item) => item.id,
  });

  const onPageSizeSelectionChange = (key: Key | null) => {
    if(key){
      updateQuery("perPage", Number.parseInt(key.toString()));
    }
    
  };

  const onSelectionChange = (key: Key | null) => {
    if (key){
      updateQuery("sortBy", list.getItem(key)!.sortBy);
      updateQuery("sortDirection", list.getItem(key)!.sortDirection);
    }
    
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuery("filter", e.target.value);
  };
  return (
    <>
      <div className={"flex w-full "}>
        <div className={"inline-block flex-1"}>
          <InputComponent
            labelAuto={true}
            defaultValue={filter}
            name="filter"
            type="text"
            id="filter"
            handleChange={debounce(handleFilterChange, 750)}
            label={"Filter"}
          ></InputComponent>
        </div>
        <div className={"inline-block flex-none content-center"}>
          <Select
            onSelectionChange={onSelectionChange}
            selectedKey={`${sortBy} ${sortDirection}`}
          >
            <Label>Sort: </Label>
            <Button className={"min-w-32 max-w-96  border-2"}>
              <SelectValue />
              <span aria-hidden="true">▼</span>
            </Button>
            <Popover className={"bg-white bg-opacity-85 min-w-32 max-w-96 "}>
              <ListBox items={list.items}>
                {(item) => (
                  <ListBoxItem>
                    {item.name} {item.icon ? item.icon : ""}
                  </ListBoxItem>
                )}
              </ListBox>
            </Popover>
          </Select>
        </div>
        <div className={"inline-block flex-none content-center"}>
          <Select
            onSelectionChange={onPageSizeSelectionChange}
            selectedKey={pageSize.toString()}
          >
            <Label>Items: </Label>
            <Button className={"min-w-16 max-w-32  border-2"}>
              <SelectValue />
              <span aria-hidden="true">▼</span>
            </Button>
            <Popover className={"bg-white bg-opacity-85 min-w-16 max-w-32"}>
              <ListBox items={pageSizes.items}>
                {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
              </ListBox>
            </Popover>
          </Select>
        </div>
      </div>
    </>
  );
}
