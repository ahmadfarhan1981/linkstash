"use client";

import {
  Button,
  Dialog,
  Label,
  Popover,
  Tag,
  TagGroup,
  TagGroupProps,
  TagList,
  TagListProps,
  TagProps,
  Text,
} from "react-aria-components";
import { delay, now } from "lodash";
import { useRef, useState } from "react";

import { SiPantheon } from "react-icons/si";
import { useHover } from "react-aria";

/**
 * Copied from https://react-spectrum.adobe.com/react-aria/TagGroup.html#reusable-wrappers
 *
 *
 */

interface MyTagGroupProps<T>
  extends Omit<TagGroupProps, "children">,
    Pick<TagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function MyTagGroup<T extends object>({
  label,
  description,
  errorMessage,
  items,
  children,
  renderEmptyState,
  ...props
}: MyTagGroupProps<T>) {
  const triggerRef = useRef(null);
  const [showDescription, setShowDescription] = useState(false);

  const [hoverStart, setHoverStart] = useState(now());
  const checkLastHoverStart = (cooldown:number) =>{
    const elapsed = now() - hoverStart
    if ( elapsed > cooldown ) {
      setShowDescription(false)
    }else{
      delay(checkLastHoverStart, cooldown - elapsed, cooldown)
    }
      
  }
  const { hoverProps } = useHover({
    // eslint-disable-next-line no-unused-vars
    onHoverStart: () => {
      setHoverStart(now())
      setShowDescription(true);
    },
    // eslint-disable-next-line no-unused-vars
    onHoverEnd: () => {
      checkLastHoverStart(750)
      //setShowDescription(false);
    },
  });
  return (
    <TagGroup {...props}>
      {description && (
        <span className="text-accent" ref={triggerRef} {...hoverProps}>
          {String.fromCharCode(8505)}
        </span>
      )}
      <Label className="m-2">{label}</Label>
      <TagList items={items} renderEmptyState={renderEmptyState}>
        {children}
      </TagList>
      <Popover
        isOpen={showDescription}
        triggerRef={triggerRef}
        className={"popover"}
      >
        <Dialog className="bg-accent text-white py-1 px-3 rounded">
          {description && <Text slot="description">{description}</Text>}
        </Dialog>
      </Popover>
      {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
    </TagGroup>
  );
}

export function MyTag({ children, ...props }: TagProps) {
  let textValue = typeof children === "string" ? children : undefined;
  return (
    <Tag textValue={textValue} {...props}>
      {( {allowsRemoving }) => (
        <>
          children
          {allowsRemoving && (
            <Button slot="remove">
              <span className={"font-serif"}>
                <svg
                  aria-label="Remove tag"
                  className="{hover:cursor-pointer}"
                  xmlns="http://www.w3.org/2000/svg"
                  width="12px"
                  height="12px"
                >
                  <path
                    d="M10,12.5c-.13,0-.26-.05-.35-.15L1.65,4.35c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0L10.35,11.65c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z"
                    fill="purple"
                  ></path>
                  <path
                    d="M2,12.5c-.13,0-.26-.05-.35-.15-.2-.2-.2-.51,0-.71L9.65,3.65c.2-.2,.51-.2,.71,0,.2,.2,.2,.51,0,.71L2.35,12.35c-.1,.1-.23,.15-.35,.15Z"
                    fill="purple"
                  ></path>
                </svg>
              </span>
            </Button>
          )}
        </>
      )}
    </Tag>
  );
}
