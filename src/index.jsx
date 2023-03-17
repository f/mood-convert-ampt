import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function Main() {
  const [value, setValue] = useState("");
  const [mood, setMood] = useState();

  const [response, setResponse] = useState("");
  const [moods, setMoods] = useState([]);

  const onValueChange = useCallback((e) => {
    setValue(e.target.value);
  });

  const onMoodChange = useCallback((e) => {
    if (e.target.value.toLowerCase() === "other") {
      setMood(prompt("Please enter the mood of the text:", ""));
      return;
    }
    setMood(e.target.value);
  });

  useEffect(() => {
    fetch("/moods")
      .then((res) => res.json())
      .then((data) => {
        setMoods(data.concat("Other"));
        setMood(data[0]);
      });
  }, []);

  const onTranslate = useCallback(async () => {
    setResponse("Converting the mood of the text, please wait...");
    const response = await fetch("/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value, mood }),
    });
    const json = await response.json();
    setResponse(json.result);
  });

  return (
    <main className="p-10">
      <div>
        <h1 className="font-bold text-center text-blue-500 text-4xl mb-4">
          Mood Conversion
        </h1>
        <textarea
          value={value}
          onInput={onValueChange}
          className="w-full h-64 p-2 border-2 border-blue-500"
          maxLength={500}
        />
        {/* text counter at right */}
        <div className="text-right text-gray-500">
          {value.length} / 500
        </div>
        <div className="flex mt-4">
          <select
            className="w-full p-2 border-2 border-blue-500 mr-2"
            onInput={onMoodChange}
          >
            {moods.map((mood) => (
              <option value={mood}>{mood}</option>
            ))}
          </select>
          <button
            onClick={onTranslate}
            className="w-full bg-blue-500 text-white p-2 mt- active:bg-blue-600"
          >
            Convert Text to {mood}
          </button>
        </div>
        <div className="mt-4 whitespace-pre-wrap">{response}</div>
      </div>
    </main>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Main />);
