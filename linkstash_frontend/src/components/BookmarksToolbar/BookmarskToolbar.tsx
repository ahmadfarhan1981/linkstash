"use client";

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
import { useListData } from "react-stately";
import { debounce } from "lodash";
import { useSearchParams } from "next/navigation";
import { setUrlParam } from "@/scripts";

const svgStyle: CSSProperties = {
  fontSize: "medium",
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  fontStretch: "normal",
  textIndent: "0",
  textAlign: "start",
  textDecoration: "none",
  lineHeight: "normal",
  letterSpacing: "normal",
  wordSpacing: "normal",
  textTransform: "none",
  direction: "ltr",
  //blockProgression: 'tb',
  //writingMode: 'lr-tb',
  textAnchor: "start",
  baselineShift: "baseline",
  opacity: "1",
  color: "#C400B3",
  fill: "#C400B3",
  fillOpacity: "1",
  stroke: "none",
  strokeWidth: "1.99999988000000010",
  marker: "none",
  visibility: "visible",
  display: "inline",
  overflow: "visible",
  //enableBackground: 'accumulate',
  fontFamily: "Sans",
  // -inkscape-font-specification is not a standard CSS property and is specific to Inkscape
};

export function AscIcon(): ReactNode {
  return (
    <>
      <svg
        aria-label="Desc"
        className="inline content-center align-middle"
        style={svgStyle}
        x="0px"
        y="0px"
        width="32"
        height="32"
        viewBox="-1.6 0 35.2 43.2"
        enable-background="new 0 0 32 32"
      >
        <path d="M29.7070313,8.7070313C29.5117188,8.9023438,29.2558594,9,29,9s-0.5117188-0.0976563-0.7070313-0.2929688L27,7.4140625V23  c0,0.5522461-0.4477539,1-1,1s-1-0.4477539-1-1V7.4140625l-1.2929688,1.2929688c-0.390625,0.390625-1.0234375,0.390625-1.4140625,0  s-0.390625-1.0234375,0-1.4140625l3-3c0.390625-0.390625,1.0234375-0.390625,1.4140625,0l3,3  C30.0976563,7.6835938,30.0976563,8.3164063,29.7070313,8.7070313z M3,13h11c0.5522461,0,1-0.4477539,1-1s-0.4477539-1-1-1H3  c-0.5522461,0-1,0.4477539-1,1S2.4477539,13,3,13z M3,18h14c0.5522461,0,1-0.4477539,1-1s-0.4477539-1-1-1H3  c-0.5522461,0-1,0.4477539-1,1S2.4477539,18,3,18z M3,23h17c0.5522461,0,1-0.4477539,1-1s-0.4477539-1-1-1H3  c-0.5522461,0-1,0.4477539-1,1S2.4477539,23,3,23z M26,26H3c-0.5522461,0-1,0.4477539-1,1s0.4477539,1,1,1h23  c0.5522461,0,1-0.4477539,1-1S26.5522461,26,26,26z" />
      </svg>
    </>
  );
}

export function DescIcon(): ReactNode {
  return (
    <svg
      aria-label="Desc"
      className="inline content-center align-middle"
      style={svgStyle}
      x="0px"
      y="0px"
      width="32"
      height="32"
      viewBox="-1.6 -8 35.2 43.2"
      enable-background="new 0 0 32 32"
    >
      <path d="M29.7070313,24.7070313l-3,3C26.5117188,27.9023438,26.2558594,28,26,28s-0.5117188-0.0976563-0.7070313-0.2929688l-3-3  c-0.390625-0.390625-0.390625-1.0234375,0-1.4140625s1.0234375-0.390625,1.4140625,0L25,24.5859375V9c0-0.5522461,0.4477539-1,1-1  s1,0.4477539,1,1v15.5859375l1.2929688-1.2929688c0.390625-0.390625,1.0234375-0.390625,1.4140625,0  S30.0976563,24.3164063,29.7070313,24.7070313z M14,19H3c-0.5522461,0-1,0.4477539-1,1s0.4477539,1,1,1h11  c0.5522461,0,1-0.4477539,1-1S14.5522461,19,14,19z M17,14H3c-0.5522461,0-1,0.4477539-1,1s0.4477539,1,1,1h14  c0.5522461,0,1-0.4477539,1-1S17.5522461,14,17,14z M20,9H3c-0.5522461,0-1,0.4477539-1,1s0.4477539,1,1,1h17  c0.5522461,0,1-0.4477539,1-1S20.5522461,9,20,9z M3,6h23c0.5522461,0,1-0.4477539,1-1s-0.4477539-1-1-1H3  C2.4477539,4,2,4.4477539,2,5S2.4477539,6,3,6z" />
    </svg>
  );
}

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
        icon: <DescIcon />,
        sortBy: "created",
        sortDirection: "DESC",
      },
      {
        id: "created ASC",
        name: "Date added",
        icon: <AscIcon />,
        sortBy: "created",
        sortDirection: "ASC",
      },
      {
        id: "title ASC",
        name: "Title",
        icon: <AscIcon />,
        sortBy: "title",
        sortDirection: "ASC",
      },
    ],
    initialSelectedKeys: ["created DESC"],
    getKey: (item) => item.id,
  });

  let pageSizes = useListData({
    initialItems: [
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
            <Popover>
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
            <Popover>
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
