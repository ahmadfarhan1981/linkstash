'use client'

export default function Header(){
    return (
        <div
            className="flex flex-row w-100vw 
                    border-[1px] 
                    border-linkstashPurple 
                    text-linkstashPurple 
                    "
        >
            <span className="flex flex-[100%] flex-row w-100vw" >
                <span className="flex-[70%]"></span>
                <span className="flex-1 "><a href="/">Home</a></span>
                <span className="flex-1 "><a href="/">Links</a></span>
                <span className="flex-1 "><a href="/">Settings</a></span>
            </span>
            
        </div>
    )

}