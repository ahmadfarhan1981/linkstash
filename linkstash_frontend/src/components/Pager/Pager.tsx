import Link from 'next/link';

export default function Pager(){
    return (
        <div className='border-2 font-mono text-xs content-end text-right'>
            
                
                        <Link href="#" >{"|<-"}</Link>{" "}
                        <Link href="#" >{"<"}</Link>{" "}
                        <Link href="#" >1</Link>{" "}
                        <Link href="#" >2</Link>{" "}
                        <Link href="#" >3</Link>{" "}
                        <Link href="#" >4</Link>{" "}
                        {"... "}
                        <Link href="#" >10</Link>{" "}
                        <Link href="#" >11</Link>{" "}
                        <Link href="#" >12</Link>{" "}
                        <Link href="#" >{">"}</Link>{" "}
                        <Link href="#" >{"->|"}</Link>{" "}
            
        
        </div>
    );
}