"use client";

import {
  AuthenticatedSection,
  InputComponent,
  Loader,
  TagInput,
} from "@/components";
import { handleFormChange, makeApiCall } from "@/scripts/index";
import { ApiCallOptions, TagListItem } from "@/types";
import { ChangeEvent, useEffect, useState } from "react";

import { useAuthentication } from "@/hooks/useAuthentication";
import axios from "axios";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useListData } from "react-stately";


/**
 * TODO only populate title and description after fetching url metadata if none is entered
 * TODO indicator when fetching url metadata
 *  *  
 */

export default function Home() {
  const router = useRouter();
  const { AuthenticationState } = useAuthentication();
 
  const [allTags, setAllTags] = useState<TagListItem[]>([]);
  const [isTagFetched, setIsTagFetced] = useState(false);



  useEffect(()=>{
    if (!AuthenticationState.isLoggedIn || isTagFetched) return
    const success = async (response: any) => {      
      const result = response.data.map( (element:TagListItem)=> { return {id:String(element.id), name:element.name} as TagListItem }  )      
      setAllTags(result)
      setIsTagFetced(true)
      
    };
    const options: ApiCallOptions = {
      endpoint: "/tags",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: success,
    };
    makeApiCall(options, false, true);
  },[AuthenticationState.isLoggedIn, AuthenticationState.token, isTagFetched])

  async function addBookmark(form: FormData) {
    //TODO bookmarklet layout
    //TODO make the page more responsive when adding. (disable input while pending, splash screen before redirecting etc)

    //TODO handle not entering the protocol at the beginning of the url (http:// or https://)
    const postData: addBookmarkFormData = {
      url: form.get("url")?.toString(),
      title: form.get("title")?.toString(),
      description: form.get("description")?.toString(),
      tagList: tagList.items.map((tag:TagListItem)=>tag.name),
    };
    // eslint-disable-next-line no-unused-vars
    const success = async (response: any) => {
      router.push("/bookmarks");
    };
    const options: ApiCallOptions = {
      endpoint: "/bookmarks",
      method: "POST",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      body: postData,
      successCallback: success,
    };
    await makeApiCall(options);
  }

  function handleURLChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (formData.title || formData.description) return;
    //TODO !! use makeAPICall()
    axios
      .get("/fetchUrlMetadata/?url=".concat(encodeURIComponent(value)))
      .then(function (response) {        
        const { ogTitle, ogDescription } = response.data.data;
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          title: ogTitle,
          description: ogDescription,
        }));
      })
      // eslint-disable-next-line no-unused-vars
      .catch(function (error) {        
        return;
      });
  }

  const [formData, setFormData] = useState<addBookmarkFormData>({});

  type addBookmarkFormData = {
    url?: string;
    title?: string;
    description?: string;
    tagList?: string[];
  };

  const tagList = useListData({
    initialItems: [],
    getKey: (item:TagListItem) => item.id,
  });
  
  return (
    <>
      <AuthenticatedSection>
        <Loader isLoading={!isTagFetched}>
        <form action={addBookmark}>
          <div>
            <InputComponent
              label="URL"
              autocomplete="off"
              id="url"
              name="url"
              placeholder="URL"
              handleChange={debounce(handleURLChange, 1000)}
              type="url"
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
              value={formData.title}
              handleChange={(
                e:
                  | ChangeEvent<HTMLInputElement>
                  | ChangeEvent<HTMLTextAreaElement>
              ) => handleFormChange(e, setFormData)}
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
              value={formData.description}
              handleChange={(
                e:
                  | ChangeEvent<HTMLTextAreaElement>
                  | ChangeEvent<HTMLInputElement>
              ) => handleFormChange(e, setFormData)}
            />
          </div>          
          <div>
          {isTagFetched && <TagInput 
            selectedTags={tagList} 
            tagsToChooseFrom={allTags} 
            maxWidthInPixel={700} 
            inputLabel={"Tags:"} 
            selectedLabel={"Tags:"}
            description="List of selected tags."
            serializedTagsToChooseFrom={JSON.stringify(allTags)}
            
            />}
          </div>

          <div>
            <input type="checkbox" name="private" id="private" />{" "}
            <label className="display:inline" htmlFor="private">
              private
            </label>
            <input type="checkbox" name="toread" id="toread" />{" "}
            <label className="display:inline" htmlFor="toread">
              read later
            </label>
            <input type="submit" value="add bookmark" />
          </div>
        </form>
        {/* <input type="button" onClick={()=>{setShowHeaders(!showHeaders)}} value="click"></input> */}
        </Loader>
      </AuthenticatedSection>
    </>
  );
}
