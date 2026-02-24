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
    "position_Title": A string representing the job title.
    "experience": An array of strings, each representing a bullet point describing relevant experience for the given job title in html format.
For the Job Title "{positionTitle}", create a JSON object with the following fields:
The experience array should contain 5-7 bullet points. Each bullet point should be a concise description of a relevant skill, responsibility, or achievement. Return ONLY valid JSON (no markdown, no backticks).`;

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
function RichTextEditor({ onRichTextEditorChange, index, resumeInfo }) {
  const [value, setValue] = useState(
    resumeInfo?.experience[index]?.workSummary || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onRichTextEditorChange(value);
  }, [value]);

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast("Please Add Position Title");
      return;
    }
    setLoading(true);

    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo.experience[index].title
    );
    const result = await AIChatSession.sendMessage(prompt);
    const raw = result.response.text();
    const resp = parseJsonResponse(raw);
    await setValue(
      resp.experience
        ? resp.experience?.join("")
        : resp.experience_bullets?.join("")
    );
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

export default RichTextEditor;
