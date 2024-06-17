'use client'
/**
 * Copied from https://react-spectrum.adobe.com/react-aria/TagGroup.html#reusable-wrappers
 * 
 * 
 */

 import {Button, Label, Tag, TagGroup, TagGroupProps, TagList, TagListProps, TagProps, Text} from 'react-aria-components';

interface MyTagGroupProps<T>
  extends
    Omit<TagGroupProps, 'children'>,
    Pick<TagListProps<T>, 'items' | 'children' | 'renderEmptyState'> {
  label?: string;
  description?: string;
  errorMessage?: string;
}

export function MyTagGroup<T extends object>(
  {
    label,
    description,
    errorMessage,
    items,
    children,
    renderEmptyState,
    ...props
  }: MyTagGroupProps<T>
) {
  return (
    <TagGroup {...props}>
      <Label>{label}</Label>
      <TagList items={items} renderEmptyState={renderEmptyState}>
        {children}
      </TagList>
      {description && <Text slot="description">{description}</Text>}
      {errorMessage && <Text slot="errorMessage">{errorMessage}</Text>}
    </TagGroup>
  );
}

export function MyTag({ children, ...props }: TagProps) {
  let textValue = typeof children === 'string' ? children : undefined;
  return (
    <Tag textValue={textValue} {...props} >
      {({ allowsRemoving }) => (
        <>
          {children}
          {allowsRemoving && <Button slot="remove">ⓧ</Button>}
        </>
      )}
    </Tag>
  );
}
