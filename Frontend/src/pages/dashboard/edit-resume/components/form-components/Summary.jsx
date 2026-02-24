import React, { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { updateThisResume } from "@/Services/resumeAPI";

const prompt =
  "Job Title: {jobTitle} , Depends on job title give me list of  summery for 3 experience level, Mid Level and Freasher level in 3 -4 lines in array format, With summery and experience_level Field in JSON Format. Return ONLY valid JSON (no markdown, no backticks).";

const parseJsonResponse = (text) => {
  if (!text) return null;

  // Strip markdown fences ```...``` if present
  const firstFence = text.indexOf("```");
  if (firstFence !== -1) {
    const lastFence = text.lastIndexOf("```");
    if (lastFence > firstFence) {
      text = text.slice(firstFence + 3, lastFence);
    }
  }

  // Remove leading language hint like "json\n"
  text = text.replace(/^\s*\w+\s*\n/, "").trim();

  // Try to isolate the JSON part between first {/[ and last }/]
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
function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false); // Declare the undeclared variable using useState
  const [summary, setSummary] = useState(resumeInfo?.summary || ""); // Declare the undeclared variable using useState
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null); // Declare the undeclared variable using useState
  const { resume_id } = useParams();

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setSummary(e.target.value);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Started Saving Summary");
    const data = {
      data: { summary },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Resume Updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  }; // Declare the undeclared variable using useState

  const setSummery = (summary) => {
    dispatch(
      addResumeData({
        ...resumeInfo,
        summary: summary,
      })
    );
    setSummary(summary);
  };

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    console.log("Generate Summery From AI for", resumeInfo?.jobTitle);
    if (!resumeInfo?.jobTitle) {
      toast("Please Add Job Title");
      setLoading(false);
      return;
    }
    const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle);
    const result = await AIChatSession.sendMessage(PROMPT);
    const raw = result.response.text();
    const parsed = parseJsonResponse(raw);
    console.log(parsed);
    setAiGenerateSummeryList(parsed);
    toast("Summery Generated", "success");
    setLoading(false);
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summery</label>
            <Button
              variant="outline"
              onClick={() => GenerateSummeryFromAI()}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
            >
              <Sparkles className="h-4 w-4" /> Generate from AI
            </Button>
          </div>
          <Textarea
            name="summary"
            className="mt-5"
            required
            value={summary ? summary : resumeInfo?.summary}
            onChange={handleInputChange}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && (
        <div className="my-5">
          <h2 className="font-bold text-lg">Suggestions</h2>
          {aiGeneratedSummeryList?.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                enanbledNext(false);
                enanbledPrev(false);
                setSummery(item?.summary);
              }}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer"
            >
              <h2 className="font-bold my-1 text-primary">
                Level: {item?.experience_level}
              </h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
