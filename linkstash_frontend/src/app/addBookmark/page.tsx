"use client";

import { ApiCallOptions, handleFormChange, makeApiCall } from "@/scripts/index";
import { AuthenticatedSection, InputComponent, useAuthentication } from "@/components";
import React, { ChangeEvent, useContext, useState } from "react";

import { Application } from "@/app/context/application";
import axios from "axios";
import debounce from "lodash/debounce";
import { useRouter } from "next/navigation";

export default function Home() {
  const ApplicationContext = useContext(Application);
    const {showHeaders, setShowHeaders } = ApplicationContext
  const router = useRouter()
  const { AuthenticationState } = useAuthentication();
  async function addBookmark(form: FormData) {

    //TODO bookmarklet layout
    //TODO make the page more responsive when adding. (disable input while pending, splash screen before redirecting etc)
    
    //TODO handle not entering the protocol at the beginning of the url (http:// or https://)
    const postData: addBookmarkFormData = {
      url: form.get("url")?.toString(),
      title: form.get("title")?.toString(),
      description: form.get("description")?.toString(),
    };
    const success = async (response: any) => {
      router.push('/bookmarks')
    };
    const failure = (error: any) => {
      console.log(error);
    };
    const finallyFunction = () => {
      // always executed
    };

    console.log(postData);
    const options: ApiCallOptions = {
      endpoint: "/bookmarks",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        UserAgent: "react",
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      body: postData,
      successCallback: success,
      failureCallback: failure,
      finallyCallback: finallyFunction,
    };

    await makeApiCall(options);
  }

  function handleURLChange(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (formData.title || formData.description) return;

    axios
      .get("/fetchUrlMetadata/?url=".concat(encodeURIComponent(value)))
      .then(function (response) {
        console.log(response);
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
    tags?: string;
  };

  return (
    <>
    <AuthenticatedSection>
      <form action={addBookmark}>
        <table>
          <tbody>
            <tr>
              <td>
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
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <InputComponent
                  type="text"
                  label="Title"
                  required={true}
                  placeholder="Title"
                  autocomplete="off"
                  name="title"
                  id="title"
                  value={formData.title}
                  handleChange={(e) => handleFormChange(e, setFormData)}
                />
              </td>
            </tr>

            <tr>
              <td>
                <InputComponent
                  label="Description"
                  type="textarea"
                  placeholder="Description"
                  name="description"
                  autocomplete="off"
                  id="description"
                  value={formData.description}
                  handleChange={(e) => handleFormChange(e, setFormData)}
                />
              </td>
            </tr>

            <tr>
              <td>
                {" "}
                <InputComponent
                  name="tags"
                  autocomplete="off"
                  id="tags"
                  type={"text"}
                  label={"tags"}
                />
              </td>
            </tr>

            <tr>
              <td></td>
              <td>
                <input type="checkbox" name="private" id="private" />{" "}
                <label className="display:inline" htmlFor="private">
                  private
                </label>
                <input type="checkbox" name="toread" id="toread" />{" "}
                <label className="display:inline" htmlFor="toread">
                  read later
                </label>
              </td>
            </tr>

            <tr>
              {" "}
              <td></td>
              <td>
                <input type="submit" value="add bookmark" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {/* <input type="button" onClick={()=>{setShowHeaders(!showHeaders)}} value="click"></input> */}
      </AuthenticatedSection>
      {/* <form >
              <InputComponent id="email" type="text" name="email" placeholder="Email" label="Email" autocomplete="username"  handleChange={e=>handleFormChange(e, setFormData)} />
              <InputComponent id="password" type="password" name="password" placeholder="Email" label="Password" autocomplete="new-password" handleChange={e=>handleFormChange(e,setFormData)} />         
             
              <br />
              <label>{JSON.stringify(formData)}</label>
              <div className="mt-2">
                <input
                  type="submit"
                  value="Login"
                  className = "submit-button"
                  onClick={(event)=>{}}
                />
              </div>
            </form> */}
    </>
  );
}
