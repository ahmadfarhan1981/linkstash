"use client";
import { TagInput } from "@/components/Default/TagInput/TagInput";
import { useListData } from "react-stately";

export default function Home() {
  const tagList = useListData({
    initialItems: [{id:"read-later", name:"read-later"}],
    getKey: (item) => item.id,
  });

  // const initialItems = [
  //   { id: "read-later", name: "read-later" },
  //   { id: "test", name: "test" },
  //   { id: "tes2", name: "tes2" },
  // ];

  const initialItems = [{"id":"14","name":"read-later"},{"id":"15","name":"hdd"},{"id":"16","name":"hdd2"}];


  return (
    <>
      <div>
        <TagInput selectedTags={tagList} tagsToChooseFrom={initialItems} maxWidthInPixel={700} inputLabel={"Tags:"} selectedLabel={"Tags:"}/>
      </div>      
    </>
  );
}
