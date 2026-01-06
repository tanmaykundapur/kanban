"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Kanbans() {
  interface Kanban {
    id: string;
    title: string;
    user_id: number;
  }
  const [kanbans, setKanbans] = useState<Kanban[]>([]);
  useEffect(() => {
    fetch("http://localhost:8000/kanbans")
      .then((x) => x.json())
      .then((textData) => {
        console.log("Extracting Kanbans...");
        setKanbans(textData["kanbans"]);
      });
  }, []);

  console.log("Kanban Array: ");
  console.log(kanbans);
  return (
    <div className="m-30 p-10 font-sans">
      <h1 className="text-5xl font-bold font-sans">Kanbans</h1>
      <ul>
        {kanbans.map((kanban, index) => (
          <li key={index}>
            <Link href={`/kanbans/${kanban.id}`}>
              <div className="m-5 p-5 round-2xl border-2 border-b-amber-50 bg-sky-800 hover:bg-sky-700">
                <div>{kanban.title}</div>
                <p className="text-right">created by User {kanban.user_id}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
