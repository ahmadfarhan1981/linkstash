"use client";
import { TagInput } from "@/components/Default/TagInput/TagInput";
import { useListData } from "react-stately";

export default function Home() {
  const tagList = useListData({
    initialItems: [{id:"read-later", name:"read-later"}],
    getKey: (item) => item.id,
  });

  const initialItems = [
    { id: "read-later", name: "read-later" },
    { id: "test", name: "test" },
    { id: "tes2", name: "tes2" },
  ];

  return (
    <>
      <div>
        <TagInput selectedTags={tagList} tagsToChooseFrom={initialItems} maxWidthInPixel={700}/>
      </div>      
    </>
  );
}
