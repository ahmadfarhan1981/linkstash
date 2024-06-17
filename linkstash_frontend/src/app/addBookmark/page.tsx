"use client";

import {
  AuthenticatedSection,
  InputComponent,
  MyComboBox,
  MyItem,
  MyTag,
  MyTagGroup,
} from "@/components";
import { handleFormChange, makeApiCall } from "@/scripts/index";
import { ChangeEvent, useState } from "react";
import { Key, Link } from "react-aria-components";

import { useAuthentication } from "@/hooks/useAuthentication";
import { ApiCallOptions } from "@/types";
import axios from "axios";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";
import { useListData } from "react-stately";

export default function Home() {
  const router = useRouter();
  const { AuthenticationState } = useAuthentication();
  const tagList = useListData({ initialItems: ["read-later"],
    getKey: item=> item

   });
  async function addBookmark(form: FormData) {
    //TODO bookmarklet layout
    //TODO make the page more responsive when adding. (disable input while pending, splash screen before redirecting etc)

    //TODO handle not entering the protocol at the beginning of the url (http:// or https://)
    const postData: addBookmarkFormData = {
      url: form.get("url")?.toString(),
      title: form.get("title")?.toString(),
      description: form.get("description")?.toString(),
      tagList: tagList.items,
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

  const [tagListInput, setTagListInput] = useState<Key | null>(null);

  const clearTagListCombo  = () =>{
    setTagListInput(null)
  }
  const appendToTaglist= (value:string)=>{
    if (value) {
      console.log(tagList.getItem(value))
      if(!tagList.getItem(value))
        tagList.append(value);
      //debounce(clearTagListCombo, 1000)
      
    }
  }


  const handleKeyDown = (e:any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const { value } = e.target ;
      console.log(`Enter ${value}` );
      console.log(tagList)
      appendToTaglist(value)
      clearTagListCombo()
    }
  };

  const handleTagComboSelectionChange = (key: Key) => {
    console.log(key);
    appendToTaglist (key?.toString()) 

  };
  return (
    <>
      <AuthenticatedSection>
        <form action={addBookmark}>
          <div>
            <InputComponent
              label="URL"
              labelWidth={111}
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
            <MyComboBox
              label="tags"
              allowsCustomValue={true}
              onInputChange={setTagListInput}
              inputValue={tagListInput ? tagListInput.toString() : ""}
              selectedKey={tagListInput}
              description={
                "Pick existing tag or write a new one and press enter"
              }
              onKeyDown={handleKeyDown}
              onSelectionChange={handleTagComboSelectionChange}
              menuTrigger="manual"
            >
              <MyItem id={`test`}>{`test`}</MyItem>
              <MyItem id={`test2`}>test2</MyItem>
            </MyComboBox>
          </div>
          <div>
            <MyTagGroup label="Tags:"  renderEmptyState={() => "emptyTag"}>
              {tagList.items.map((tag) => (
                <MyTag
                  key={tag}
                  id={tag}
                  textValue={tag}
                  className={
                    "font-light inline bg-blue-100 mx-1 px-1 rounded  border-purple-200  border-2 before:content-['#'] before:font-medium hover:bg-purple-300 after:last-of-type:content-[''] after:content-[',']"
                  }
                >
                  <Link href={`/tags/${tag}`}>{tag}</Link>
                </MyTag>
              ))}
            </MyTagGroup>
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
      </AuthenticatedSection>
    </>
  );
}
