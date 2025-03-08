import { useState } from "react";

import { ApiCallOptions, FetchTagsOptions, TagListItem } from "@/types";
import { makeApiCall } from "@/scripts";
import { useAuthentication } from "@/hooks";

export type useTagsReturnValue = {
  tags: TagListItem[];
  fetchTags: (_options: FetchTagsOptions) => void;
  isLoading: boolean;
  simpleTags: string[];
};

function generateRequestParams(options: FetchTagsOptions): Record<string, any> {
  const { sortBy, sortDirection } = options;
  const filterString = `{    
    "order": "${sortBy} ${sortDirection}"  
  }`;
  return { filter: filterString };
}

export function useTags(): useTagsReturnValue {
  const [tags, setTags] = useState<TagListItem[]>([]);
  const [simpleTags, setSimpleTags] = useState<string[]>([]);
  const { AuthenticationState } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);

  const fetchTags = (fetchOptions: FetchTagsOptions) => {
    if (!AuthenticationState.isLoggedIn) return;
    const params = generateRequestParams(fetchOptions);
    const apiOptions: ApiCallOptions = {
      endpoint: "/tags",
      method: "GET",
      headers: {
        Authorization: "Bearer ".concat(AuthenticationState.token),
      },
      successCallback: (response: any) => {
        setTags((_oldState) => {
          const newState = response.data;
          return newState;
        });
        setSimpleTags((_oldState) => {
          return (response.data as TagListItem[]).map((t) => t.name);
        });
        setIsLoading(false);
      },
      requestParams: params,
      finallyCallback: () => {
        setIsLoading(false);
      },
    };
    setIsLoading(true);
    makeApiCall(apiOptions, true);
  };

  return {
    tags,
    fetchTags,
    isLoading,
    simpleTags,
  };
}
