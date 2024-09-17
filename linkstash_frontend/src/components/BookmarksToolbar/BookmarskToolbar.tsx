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
import React, { CSSProperties, ChangeEvent, ReactNode } from "react";
import { SortBy, SortDirection } from "@/hooks";

import { InputComponent } from "../Default";
import { Key } from "@react-types/shared"
import { debounce } from "lodash";
import { setUrlParam } from "@/scripts";
import { useListData } from "react-stately";
import { useSearchParams } from "next/navigation";

export type SortListItem = {
  id: string;
  name: string;
  icon: ReactNode;
  sortBy: SortBy;
  sortDirection: SortDirection;
};

export function BookmarksToolbar({
  sortBy,
  sortDirection,
  pageSize,
  filter,
  setSortBy,
  setSortDirection,
  setPageSize,
  setFilter,
}: {
  sortBy:SortBy;
  sortDirection: SortDirection;
  pageSize: number;
  filter: string;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
  setSortDirection: React.Dispatch<React.SetStateAction<SortDirection>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  const searchParams = useSearchParams();
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
        icon: <BiSortUp className="inline text-accent"/>,
        sortBy: "created",
        sortDirection: "ASC",
      },
      {
        id: "title ASC",
        name: "Title",
        icon: <BiSortUp className="inline text-accent"/>,
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

  const onPageSizeSelectionChange = (key: Key) => {
    
    setPageSize(Number.parseInt(key.toString()));
    setUrlParam("perPage", key.toString(), searchParams )
  };

  const onSelectionChange = (key: Key) => {
    setSortBy(list.getItem(key).sortBy);
    setSortDirection(list.getItem(key).sortDirection);
  };

  const handleFilterChange = (e:ChangeEvent<HTMLInputElement>)=>{setFilter(e.target.value)}
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
          <Select onSelectionChange={onSelectionChange} selectedKey={`${sortBy} ${sortDirection}`}>
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
          <Select onSelectionChange={onPageSizeSelectionChange} selectedKey={pageSize.toString()}>
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
