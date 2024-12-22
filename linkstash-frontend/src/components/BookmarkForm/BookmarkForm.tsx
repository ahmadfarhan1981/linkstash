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

import { BiRefresh } from "react-icons/bi";
import Link from "next/link";
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
  const [isURLFetching, setIsURLFetching] = useState(false);

  function handleURLChangeEvent(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) {
    const { value } = event.target;
    handleURLChangeURL(value);
  }

  function handleURLChangeURL(url: string, force: boolean = false) {
    const value = url;

    if (!force && (formData.title || formData.description)) return;
    if (lastUrlFetched === value) return;

    setIsURLFetching(true); // Set loading to true
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
      })
      .finally(() => {
        setIsURLFetching(false); // Set loading to false
      });
  }

  useEffect(() => {
    if (formData.tagList) {
      const keys = tagList.items.map((t) => t.name);
      keys.forEach((key) => tagList.remove(key));
      formData.tagList.forEach((tag: string) => {
        tagList.append({ id: tag, name: tag });
      });
    }
  }, [formData.tagList]);

  useEffect(() => {    
    if (formData.url) {
      handleURLChangeURL(formData.url);
    }
  }, [formData.url]);

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
    debounce(handleURLChangeEvent, 1000)(e);
  };
  return (
    <>
      <AuthenticatedSection prefix={<>Please login to continue</>}>
        <Loader isLoading={isLoading}>
          <h2>Adding a new bookmark</h2>
          <div className="bg-card-background shadow p-3 mt-3 w-[80%] min-w-[280px] ">
            <form action={handleSubmitWrapper}>
              <div>
                <InputComponent
                  style={{ minWidth: "250px", maxWidth: "550px", width: "70%" }}
                  label="URL"
                  autocomplete="off"
                  id="url"
                  name="url"
                  placeholder="URL"
                  type="url"
                  handleChange={handleControlledURLInput}
                  value={formData?.url}
                />

                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleURLChangeURL(formData?.url!, true);
                  }}
                >
                  <BiRefresh
                    className="react-icons font-bold text-blue-600 w-[24px] h-[24px]"
                    aria-label="Refresh metadata"
                    title="Refresh metadata"
                  />
                </Link>
              </div>
              <div>
                <InputComponent
                  disabled={isURLFetching}
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
                {isURLFetching && (
                  <span className={styles.loadingIndicator}>
                    Fetching metadata...
                  </span>
                )}
              </div>

              <div>
                <InputComponent
                  disabled={isURLFetching}
                  label="Description"
                  type="textarea"
                  placeholder="Description"
                  name="description"
                  autocomplete="off"
                  id="description"
                  value={formData?.description}
                  handleChange={handleControlledInput}
                />
                {isURLFetching && (
                  <span className={styles.loadingIndicator}>
                    Fetching metadata...
                  </span>
                )}
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
                <button className="button accent-button" type="submit">
                  {submitButtonText}
                </button>
              </div>
            </form>
          </div>
        </Loader>
      </AuthenticatedSection>
    </>
  );
}
