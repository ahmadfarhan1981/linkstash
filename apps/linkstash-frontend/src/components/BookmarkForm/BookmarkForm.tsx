"use client";
/* eslint-disable github/a11y-no-title-attribute */
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { BiRefresh } from "react-icons/bi";
import Link from "next/link";
import axios from "axios";
import { debounce } from "lodash-es";



import { InputComponent, Loader } from "@/components";
import { DEFAULT_FETCH_TAGS_OPTIONS, handleFormChange } from "@/scripts";
import { useAuthentication, useTags } from "@/hooks";
import { TagInput } from "@/components/Default/TagInput/TagInput";

import styles from "./styles.module.css";


export type BookmarkFormConfig = {
  title: string;
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
  title,
  handleSubmit,
  formData,
  setFormData,
  submitButtonText,
}: BookmarkFormConfig) {
  const [lastUrlFetched, setLastUrlFetched] = useState("");
  const [isURLFetching, setIsURLFetching] = useState(false);

  function handleURLChangeEvent(
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
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

 

  const { simpleTags, isLoading, fetchTags } = useTags();
  const {AuthenticationState} =  useAuthentication();
  useEffect(() => {
    fetchTags(DEFAULT_FETCH_TAGS_OPTIONS);
  },[AuthenticationState.isLoggedIn, fetchTags]);

  async function handleSubmitWrapper(form: FormData) {
    //TODO bookmarklet layout
    //TODO make the page more responsive when adding. (disable input while pending, splash screen before redirecting etc)
    //TODO handle not entering the protocol at the beginning of the url (http:// or https://)
    const postData: BookmarkFormData = {
      url: form.get("url")?.toString(),
      title: form.get("title")?.toString(),
      description: form.get("description")?.toString(),
      tagList: tags,
    };

    setFormData(postData);
    await handleSubmit(postData);
  }
  const handleControlledInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    handleFormChange(e, setFormData);
  };
  const handleControlledURLInput = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    handleFormChange(e, setFormData);
    debounce(handleURLChangeEvent, 1000)(e);
  };

  const [tags, setTags] = useState<string[]>(formData?.tagList || []);

  useEffect(() => {
    if (formData.url) {
      handleURLChangeURL(formData.url);
    }
  }, [formData.url]);

  useEffect(() => {
   setTags(formData.tagList || []);
  }, [formData.tagList]);

  return (
    <div className="w-[90%]">
    
        <Loader isLoading={isLoading}>
          <h2>{title}</h2>
          <div className="bg-card-background shadow p-3 mt-3 min-w-[280px] w-full">
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
                  style={{ minWidth: "240px", maxWidth: "520px", width: "64%" }}
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
                    selectedTags={tags}
                    tagsToChooseFrom={simpleTags}
                    label={"Tags:"}
                    selectedTagsLabel={"Tags:"}
                    onSelectedTagsChange={(t) => setTags([...t])}
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
    </div>
  );
}
