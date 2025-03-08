"use client";

export default function Home() {
  return (
    <>
      <div className="grid w-full border-2 grid-cols-5 grid-flow-row">
        accent
        <div className="bg-accent text-accent">on accent</div>
        <div className="bg-card-background text-accent">on bg-card-background</div>
        <div className="bg-primary-background text-accent">on primary primary-background</div>
        <div className="bg-primary-text text-accent">on primary-text</div>

        text-card-background
        <div className="bg-accent text-card-background">on accent</div>
        <div className="bg-card-background text-card-background">on bg-card-background</div>
        <div className="bg-primary-background text-card-background">on primary primary-background</div>
        <div className="bg-primary-text text-card-background">on primary-text</div>

        text-primary-background
        <div className="bg-accent text-primary-background">on accent</div>
        <div className="bg-card-background text-primary-background">on bg-card-background</div>
        <div className="bg-primary-background text-primary-background">on primary primary-background</div>
        <div className="bg-primary-text text-primary-background">on primary-text</div> 

        text-primary-text
        <div className="bg-accent text-primary-text">on accent</div>
        <div className="bg-card-background text-primary-text">on bg-card-background</div>
        <div className="bg-primary-background text-primary-text">on primary primary-background</div>
        <div className="bg-primary-text text-primary-text">on primary-text</div>
        
        
      </div>
        <div><button className="">Button1</button><button className="">Button1</button></div>
        <div><button className="submit-button">Button1</button><button className="small-button-original">Button1</button></div>
        <div><button className="button">Button2</button><button className="button small-button">Button21</button></div>
        <div><button className="button accent-button">Button1</button><button className="button small-button accent-button">Button31</button></div>
        <div><button className="button alert-button">Button4</button><button className="button small-button alert-button">Button41</button></div>
        <div><button className="button">Button5</button><button className="button">Button51</button></div>
    </>
  );
}
