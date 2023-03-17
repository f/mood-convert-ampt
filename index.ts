import { http, params } from "@ampt/sdk";
import { data } from "@ampt/data";
import express from "express";
import fetch from "node-fetch";

const expressApp = express();

const KEY = params("OPENAI_KEY");

const TRANSLATE_PROMPT = (mood) => `
  You are text rewriter that rewrites user's input using *${mood.toLowerCase()}* style.
  *Never write descriptions or explanations*, write just the rewrite itself.
  The rewrite must be as accurate as possible. *Never quote* the original text.
  Do not caption.
  Do not include original text in response.
  The response must be maximum ~4000 characters.
`;

expressApp.use("/translate", (req, res) => {
  let jsonData = "";

  req.body.on("data", (data) => {
    jsonData += data.toString();
  });

  req.body.on("end", () => {
    const { value, mood } = JSON.parse(jsonData);
    const messages = [
      {
        role: "system",
        content: TRANSLATE_PROMPT(mood),
      },
      {
        role: "assistant",
        content: "OK. Write me the text you want to rewrite.",
      },
      {
        role: "user",
        content: value.substring(0, 4000),
      },
    ];

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .then((data: any) => {
        const result = { result: data?.choices?.[0].message.content };
        res.send(JSON.stringify(result));
      });
  });
});

expressApp.use("/moods", (req, res) => {
  data.get("moods").then((moods) => {
    res.send(JSON.stringify(moods) ?? []);
  });
});

http.useNodeHandler(expressApp);
