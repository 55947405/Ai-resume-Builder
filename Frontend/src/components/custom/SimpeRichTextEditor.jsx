import React, { useEffect, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "@/Services/AiModel";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Sparkles, LoaderCircle } from "lucide-react";

const PROMPT = `Create a JSON object with the following fields:
"projectName": A string representing the project
"techStack":A string representing the project tech stack
"projectSummary": An array of strings, each representing a bullet point in html format describing relevant experience for the given project tittle and tech stack
projectName-"{projectName}"
techStack-"{techStack}". Return ONLY valid JSON (no markdown, no backticks).`;

const parseJsonResponse = (text) => {
  if (!text) return null;

  const firstFence = text.indexOf("```");
  if (firstFence !== -1) {
    const lastFence = text.lastIndexOf("```");
    if (lastFence > firstFence) {
      text = text.slice(firstFence + 3, lastFence);
    }
  }

  text = text.replace(/^\s*\w+\s*\n/, "").trim();

  const firstCurly = text.indexOf("{");
  const firstBracket = text.indexOf("[");
  let start = -1;
  if (firstCurly === -1) start = firstBracket;
  else if (firstBracket === -1) start = firstCurly;
  else start = Math.min(firstCurly, firstBracket);

  const lastCurly = text.lastIndexOf("}");
  const lastBracket = text.lastIndexOf("]");
  let end = -1;
  if (lastCurly === -1) end = lastBracket;
  else if (lastBracket === -1) end = lastCurly;
  else end = Math.max(lastCurly, lastBracket);

  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  return JSON.parse(text);
};
function SimpeRichTextEditor({ index, onRichTextEditorChange, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.projects[index]?.projectSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (
      !resumeInfo?.projects[index]?.projectName ||
      !resumeInfo?.projects[index]?.techStack
    ) {
      toast("Add Project Name and Tech Stack to generate summary");
      return;
    }
    setLoading(true);

    const prompt = PROMPT.replace(
      "{projectName}",
      resumeInfo?.projects[index]?.projectName
    ).replace("{techStack}", resumeInfo?.projects[index]?.techStack);
    console.log("Prompt", prompt);
    const result = await AIChatSession.sendMessage(prompt);
    const raw = result.response.text();
    const resp = parseJsonResponse(raw);
    console.log("Response", resp);
    await setValue(resp.projectSummary?.join(""));
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summery</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(value);
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default SimpeRichTextEditor;
