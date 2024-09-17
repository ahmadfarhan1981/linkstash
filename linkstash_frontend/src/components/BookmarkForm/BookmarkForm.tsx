/* eslint-disable github/a11y-no-title-attribute */
"use client";

import {
  AuthenticatedSection,
  InputComponent,
  Loader,
  TagInput,
} from "@/components";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { debounce, uniq } from "lodash";

import { TagListItem } from "@/types";
import axios from "axios";
import { handleFormChange } from "@/scripts";
import styles from "./styles.module.css";
import { useListData } from "react-stately";

export type BookmarkFormConfig = {
  allTags: TagListItem[];
  isLoading: boolean;
  handleSubmit: (__bookmarkData: BookmarkFormData) => Promise<void>;
  formData: BookmarkFormData;
  setFormData: Dispatch<SetStateAction<BookmarkFormData>>;
  submitButtonText: string;
};

export type BookmarkFormData = {
  url?: string;
  title?: string;
  description?: string;
  tagList?: string[];
};

export function BookmarkForm({
  handleSubmit,
  isLoading,
  allTags,
  formData,
  setFormData,
  submitButtonText,
}: BookmarkFormConfig) {
  const tagList = useListData({
    initialItems: [],
    getKey: (item: TagListItem) => item.name,
  });
  const [lastUrlFetched, setLastUrlFetched] = useState("");

  // TODO indicator when fetching url metadata
  function handleURLChange(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) {
    const { value } = event.target;

    if (formData.title || formData.description) return;
    if (lastUrlFetched === value) return;

    axios
      .get("/fetchUrlMetadata/?url=".concat(encodeURIComponent(value)))
      .then(function (response) {
        const { ogTitle, ogDescription } = response.data.data;
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          title: ogTitle,
          description: ogDescription,
        }));
        setLastUrlFetched(value);
      })
      .catch(function (_error) {
        // TODO logging
        return;
      });
  }

  useEffect(() => {
    if(formData.tagList){
        const keys = tagList.items.map((t)=>t.name)
        keys.forEach((key)=>tagList.remove(key))
        formData.tagList.forEach((tag: string) =>{tagList.append({ id: tag, name: tag} )} );
    }    
  }, [formData.tagList]);

  async function handleSubmitWrapper(form: FormData) {
    //TODO bookmarklet layout
    //TODO make the page more responsive when adding. (disable input while pending, splash screen before redirecting etc)

    //TODO handle not entering the protocol at the beginning of the url (http:// or https://)    
    const postData: BookmarkFormData = {
      url: form.get("url")?.toString(),
      title: form.get("title")?.toString(),
      description: form.get("description")?.toString(),
       tagList: uniq(tagList.items.map((tag: TagListItem) => tag.name)),
    };

    setFormData(postData);
    await handleSubmit(postData);
  }
  const handleControlledInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleFormChange(e, setFormData);
  };
  const handleControlledURLInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    handleFormChange(e, setFormData);
    debounce(handleURLChange, 1000)(e);
  };
  return (
    <>
      <AuthenticatedSection>
        <Loader isLoading={isLoading}>
          <form action={handleSubmitWrapper}>
            <div>
              <InputComponent
                label="URL"
                autocomplete="off"
                id="url"
                name="url"
                placeholder="URL"
                type="url"
                handleChange={handleControlledURLInput}
                value={formData?.url}
              />
            </div>
            <div>
              <InputComponent
                type="text"
                label="Title"
                required={true}
                placeholder="Title"
                autocomplete="off"
                name="title"
                id="title"
                value={formData?.title}
                handleChange={handleControlledInput}
              />
            </div>

            <div>
              <InputComponent
                label="Description"
                type="textarea"
                placeholder="Description"
                name="description"
                autocomplete="off"
                id="description"
                value={formData?.description}
                handleChange={handleControlledInput}
              />
            </div>
            <div>
              {!isLoading && (
                <TagInput
                  selectedTags={tagList}
                  tagsToChooseFrom={allTags}
                  maxWidthInPixel={700}
                  inputLabel={"Tags:"}
                  selectedLabel={"Tags:"}
                  description="List of selected tags."
                />
              )}
            </div>

            <div>              
              <button
                className="button accent-button"
                type="submit"
              >{submitButtonText}</button>
            </div>
          </form>
        </Loader>
      </AuthenticatedSection>
    </>
  );
}
