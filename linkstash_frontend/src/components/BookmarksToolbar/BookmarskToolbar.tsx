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
import { InputComponent } from "../Default";

export function BookmarksToolbar() {
  return (
    <>
    <div className={"flex w-full "}>
        <div className={"inline-block flex-1"}>
          <InputComponent
            labelAuto={true}
            name="filter"
            type="text"
            id="filter"
            label={"Filter"}
          ></InputComponent>
        </div>
        <div className={"inline-block flex-none content-center"}>
          <Select>
            <Label>Sort: </Label>
            <Button className={"w-36 border-2"}>
              <SelectValue />
              <span aria-hidden="true">▼</span>
            </Button>
            <Popover>
              <ListBox>
                <ListBoxItem>Date added</ListBoxItem>
                <ListBoxItem>Title</ListBoxItem>
                <ListBoxItem>Unread</ListBoxItem>
                <ListBoxItem>Kangaroo</ListBoxItem>
                <ListBoxItem>Panda</ListBoxItem>
                <ListBoxItem>Snake</ListBoxItem>
              </ListBox>
            </Popover>
          </Select>
        </div>
      </div>
      
    </>
  );
}
