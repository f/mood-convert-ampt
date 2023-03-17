import React, { useCallback, useEffect, useState } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";

function Main() {
  const [value, setValue] = useState("");
  const [mood, setMood] = useState();

  const [response, setResponse] = useState("");
  const [moods, setMoods] = useState([]);

  const onValueChange = useCallback((e) => {
    setValue(e.target.value);
  })

  const onMoodChange = useCallback((e) => {
    setMood(e.target.value);
  });

  useEffect(() => {
    fetch("/moods").then((res) => res.json()).then((data) => {
      setMoods(data);
      setMood(data[0]);
    });
  }, []);

  const onTranslate = useCallback(async () => {
    const response = await fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value, mood }),
    });
    const json = await response.json();
    setResponse(json.result);
  })

  return (<main className="
    p-10
  ">
    <div>
      <h1 className="
       font-bold text-center text-blue-500 text-4xl mb-4
     ">Mood Conversion</h1>
      <textarea value={value} onInput={onValueChange} className="
        w-full h-64 p-2 border-2 border-blue-500
      " />
      <div className="
        flex
      ">
        <select className="
          w-full p-2 border-2 border-blue-500 mr-2
        " onInput={onMoodChange}>
          {moods.map((mood) => (<option value={mood}>{mood}</option>))}
        </select>
        <button onClick={onTranslate} className="
          w-full bg-blue-500 text-white p-2 mt- active:bg-blue-600
        ">Convert Mood</button>
      </div>
      <div className="
        mt-4
      ">
        {response}
      </div>
    </div>
  </main>);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main />);
