"use client";

import { BiError } from "react-icons/bi";
import { IconContext } from "react-icons";
import {
  ReactNode,
} from "react";

export function AlertBox({
  isVisible,
  message,
  handleClose,
  children,
}: {
  isVisible: boolean;
  message: string;
  handleClose?: ()=>void;
  children?: ReactNode;
}): ReactNode { 
    
  

    return (<div>
      { isVisible && 
      <div className="max-w-xl mx-auto mt-10 preview transition">
        <div className="flex cemt py-4 px-8 bg-[#e41749]  text-[#fff] rounded-lg items-center justify-center shadow hover:scale-105 transition">
          <div className="flex-none">
            <IconContext.Provider value={{ color: "white", size: "2em" }}>
              <BiError />
            </IconContext.Provider>
          </div>
          <div className=" m-0 flex-1">{message}</div>
          <div>
            {handleClose?<button className="font-bold flex-none  hover:scale-150 hover:font-bold transition" onClick={handleClose} >&#10005;</button>:""}
          </div>
        </div>
      </div>
      }
    </div>)
}