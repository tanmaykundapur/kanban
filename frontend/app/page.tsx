"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [color, setColor] = useState("white");

  // let color1 = 'white'

  // function setColor1(ncolor:string) {
  //   color1 = ncolor
  // }
  // useEffect(() => {
  //   const yellowBtn = document.getElementById("yellowBtn");
  //   const redBtn = document.getElementById("redBtn");
  //   yellowBtn?.addEventListener("click", (e) => {
  //     document.body.setAttribute("style", "background-color: red;");
  //   });
  //   redBtn?.addEventListener("click", (e) => {
  //     document.body.setAttribute("style", "background-color: yellow;");
  //   });
  // });
  console.log("POSTS:");
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(x => x.json())
      .then(textData => {
        setPosts(textData);
      });
  });

  console.log(posts);
  
  

  // fetch("http://localhost:8000")
  //   .then(x => x.json())
  //   .then(textData => {
  //     console.log(textData);
  //   });

  return (
    <>
      <div>Potato</div>
      <div className="grid grid-cols-3">{posts.map(x => <div className="m-2 rounded bg-amber-100 text-black">{x.title}</div>)}</div>
      <div
        style={{
          backgroundColor: color,
        }}
        className="flex min-h-screen items-center justify-center font-sans"
      >
        <h1>KanBan App</h1>
        <button
          onClick={(e) => setColor("red")}
          className="bg-red-500 m-5 p-2"
          id="redBtn"
        >
          Red
        </button>
        <button
          onClick={() => setColor("yellow")}
          className="bg-yellow-300 m-5 p-2"
          id="yellowBtn"
        >
          Yellow
        </button>
      </div>
    </>
  );
}
