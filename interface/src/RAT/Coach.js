import React, { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "../App";
import ReactTyped from "react-typed";
import { json, useNavigate } from "react-router-dom";
import { easyRAT, mediumRAT, hardRAT } from "./Prompts";
import background from "../assets/blur-background.svg";
import Game from "../Game/Game";
import prompt_json from "./output.json";

let nextId = 0;
//let promptId = 0;
let itemId = 0;
let ideasCount = 0;

const Coach = () => {
  // const [input, setInput] = useState(""); // store currently inputted idea in input form

  // const [ideaEditing, setIdeaEditing] = useState(null); // id of idea we are editing
  // const [editingText, setEditingText] = useState("");
  const [promptId, setPromptId] = useState(0);
  const [input, setInput] = useState("");
  const [idea, setIdea] = useState([]); // Answer
  const [promptCopy, setPromptCopy] = useState([]);
  const [shuffled, setShuffled] = useState(false);
  const outOfFocusStart = useRef(0);
  const [outOfFocusTime, setOutOfFocusTime] = useState(0);
  const [outOfTime, setOutofTime] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const { data, addData } = useContext(DataContext);

  const navigate = useNavigate();

  const preventDefaultAction = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    // log page load time
    setPrompts(prompt_json);
    addData({ PageLoad: new Date().toISOString() });
  }, []);

  useEffect(() => {
    // Start tracking when the tab goes out of focus and stop when it comes back into focus
    const handleVisibilityChange = () => {
      if (document.hidden) {
        outOfFocusStart.current = Date.now();
        // console.log(`Went out of focus at: ${outOfFocusStart.current}`);
      } else {
        if (outOfFocusStart.current !== 0) {
          const currentFocusTime =
            (Date.now() - outOfFocusStart.current) / 1000;
          // console.log(`Came back into focus, was out for: ${currentFocusTime} seconds`);
          setOutOfFocusTime((prevTime) => prevTime + currentFocusTime);
          outOfFocusStart.current = 0;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function to remove the event listener
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const logInterval = setInterval(() => {
      console.log(`Out of Focus Time: ${outOfFocusTime} seconds`);
    }, 5000);

    // Cleanup function to clear the interval when the component unmounts
    // or when outOfFocusTime changes to prevent memory leaks.
    return () => clearInterval(logInterval);
  }, [outOfFocusTime]);

  useEffect(() => {
    // Shuffle the array using the Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Set the randomized list in the state during component mount or refresh
    setPromptCopy(() => {
      const shuffledEasy = shuffleArray(easyRAT);
      const shuffledMedium = shuffleArray(mediumRAT);
      const shuffledHard = shuffleArray(hardRAT);
      const trialArray = [
        ...shuffledEasy.slice(0, 2),
        ...shuffledMedium.slice(0, 2),
        ...shuffledHard.slice(0, 2),
      ];
      const testArray = [shuffledEasy[3], shuffledMedium[3], shuffledHard[3]];
      return [
        shuffledEasy[3],
        ...shuffleArray(trialArray),
        "dummy",
        ...shuffleArray(testArray),
      ];
    });
    setShuffled(true);
  }, []);

  const handleSubmit = (e) => {
    // e is short for event
    e.preventDefault(); // prevents page from refreshing upon clicking submit
    setIdea(input);
    setInput(""); // clears the input form
    if (promptId > 7) {
      setTime(0);
    }
  };
  const nextQuestion = (e) => {
    e.preventDefault(); // prevents page from refreshing upon clicking submit
    if (!(promptId === 7)) {
      addData({
        Prompt: promptCopy[promptId][3],
        Response: idea,
      });
    }
    if (promptId === 10) {
      addData({ HideTime: outOfFocusTime });
      navigate("/convergent/feedback");
    } else {
      setPromptId(promptId + 1);
      // reset states and timer
      if (promptId === 7) {
        setTime(60);
      } else {
        setTime(60);
      }
      setInput("");
      setIdea("");
      setOutofTime(false);
    }
  };
  // timer countdown in seconds
  const [time, setTime] = useState(60);

  useEffect(() => {
    let timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);

    // Cleanup the interval on component unmount or when time reaches 0
    return () => clearInterval(timer);
  }, [time]);

  useEffect(() => {
    if (time === 0) {
      if (promptId === 10) {
        addData({ HideTime: outOfFocusTime });
        navigate("/convergent/feedback");
      } else {
        if (promptId == 0 || promptId == 7) {
          setPromptId(promptId + 1);
          // reset states and timer
          setTime(60);
          setInput("");
          setIdea("");
          setOutofTime(false);
        } else if (idea == "") {
          setOutofTime(true);
        }
      }
    }
    if (promptId >= promptCopy.length) {
      setTime(0);
    }
  }, [time]);
  if (!shuffled || !promptCopy.length) {
    return <div>Loading...</div>;
  }
  let practice = "Practice Round:";
  let test = "Test Round:";

  return !(promptId === 7) ? (
    promptId > 7 ? (
      <div className="h-screen w-screen place-items-center justify-center flex text-3xl font-semibold space-y-8 p-8 bg-cover">
        <div className="flex flex-row space-x-4 p-4 w-full h-full place-items-center justify-center rounded-[60px]">
          <div
            className=" rounded-[60px] bg-orange-500 flex flex-col h-full px-4  outline outline-2 outline-white bg-slate-500"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          >
            <div className="grid grid-cols-3 place-items-center auto-cols-min mb-4 mt-8">
              <div className="col-start-1 place-items-center">
                <span className="text-black col-start-1 w-fit outline outline-1 rounded-lg text-xl p-1">
                  {promptId < 7
                    ? practice.concat(" ", promptId.toString(), "/6")
                    : test.concat(" ", (promptId - 7).toString(), "/3")}
                </span>
              </div>
              <div></div>
              <div className="justify justify-end">
                <span
                  style={{
                    backgroundColor: "rgba(0, 100, 0, .5)",
                  }}
                  className="text-white text-center outline outline-1 rounded-lg text-4xl p-1"
                >
                  Time: {`${Math.floor(time / 60)}`.padStart(2, 0)}:
                  {`${time % 60}`.padStart(2, 0)}
                </span>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full place-items-center items-center"
            >
              <p className="text-black text-xl mb-6 mt-3">
                Find a fourth word that is related to all three of the
                following:
              </p>
              <div
                className="mb-4 items-center grid grid-cols-2 place-items-center auto-cols-min rounded-xl px-3"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              >
                <h2 className="text-black text-4xl pr-100 p-1">
                  {promptCopy[promptId][0]} / {promptCopy[promptId][1]} /{" "}
                  {promptCopy[promptId][2]}
                </h2>
                {idea === "" ? (
                  <div className="float-right">
                    <input
                      type="text"
                      placeholder="Enter your idea.."
                      value={input}
                      className="p-1 h-2/3 text-lg mr-4"
                      onPaste={preventDefaultAction}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <input
                      type="submit"
                      value="SUBMIT"
                      className="text-black bg-slate-400 outline outline-2 rounded-md font-bold text-xl px-2 hover:bg-slate-100"
                    />
                  </div>
                ) : (
                  <div className="float-right">
                    <h2 className="text-black underline text-4xl pr-100 p-1">
                      {idea}
                    </h2>
                  </div>
                )}
              </div>
            </form>
            <h2 className="text-black mb-4 text-2xl text-center mt-4">
              No AI help this round!
            </h2>
            <div className="p-2"></div>
          </div>
        </div>
      </div>
    ) : (
      <div className="h-screen w-screen place-items-center justify-center flex text-3xl font-semibold space-y-8 p-8 bg-cover">
        <div className="flex flex-row space-x-4 p-4 w-full h-full place-items-center justify-center rounded-[60px]">
          <div
            className=" rounded-[60px] bg-orange-500 flex flex-col h-full px-4  outline outline-2 outline-white bg-slate-500"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          >
            {!outOfTime ? (
              <div className="grid grid-cols-3 place-items-center auto-cols-min mb-4 mt-8">
                <div className="col-start-1 place-items-center">
                  <span className="text-black col-start-1 w-fit outline outline-1 rounded-lg text-xl p-1">
                    {promptId < 7
                      ? practice.concat(" ", promptId.toString(), "/6")
                      : test.concat(" ", (promptId - 7).toString(), "/3")}
                  </span>
                </div>
                <div></div>
                <div className="justify justify-end">
                  <span
                    style={{
                      backgroundColor: "rgba(0, 100, 0, .5)",
                    }}
                    className="text-white text-center outline outline-1 rounded-lg text-4xl p-1"
                  >
                    Time: {`${Math.floor(time / 60)}`.padStart(2, 0)}:
                    {`${time % 60}`.padStart(2, 0)}
                  </span>
                </div>
              </div>
            ) : idea == "" ? (
              <div className="flex justify-center place-items-center mb-4 mt-8">
                <span
                  style={{
                    backgroundColor: "rgba(200, 0, 0, .5)",
                  }}
                  className="text-white text-center outline outline-1 rounded-lg text-4xl p-1"
                >
                  Please submit a response!
                </span>
              </div>
            ) : (
              <div className="flex justify-center place-items-center mb-4 mt-8">
                <span
                  style={{
                    backgroundColor: "rgba(0, 100, 0, .5)",
                  }}
                  className="text-white text-center outline outline-1 rounded-lg text-4xl p-1"
                >
                  Thank you!
                </span>
              </div>
            )}
            <form
              onSubmit={handleSubmit}
              className="w-full place-items-center items-center"
            >
              <p className="text-black text-xl mb-6 mt-3">
                Find a fourth word that is related to all three of the
                following:
              </p>
              <div
                className="mb-4 items-center grid grid-cols-2 place-items-center auto-cols-min rounded-xl px-3"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
              >
                <h2 className="text-black text-4xl pr-100 p-1">
                  {promptCopy[promptId][0]} / {promptCopy[promptId][1]} /{" "}
                  {promptCopy[promptId][2]}
                </h2>
                {idea === "" ? (
                  <div className="float-right">
                    <input
                      type="text"
                      placeholder="Enter your idea.."
                      value={input}
                      className="p-1 h-2/3 text-lg mr-4"
                      onPaste={preventDefaultAction}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <input
                      type="submit"
                      value="SUBMIT"
                      className="text-black bg-slate-400 outline outline-2 rounded-md font-bold text-xl px-2 hover:bg-slate-100"
                    />
                  </div>
                ) : time > 0 ? (
                  <div className="float-right">
                    <h2 className="text-black underline text-4xl pr-100 p-1">
                      {idea}
                    </h2>
                  </div>
                ) : (
                  <div className="flex flex-1 justify justify-end pt-2 pb-2">
                    <h2 className="text-black underline text-4xl pr-100 p-1 pr-2">
                      {idea}
                    </h2>
                    <input
                      value="NEXT QUESTION"
                      type="button"
                      onClick={nextQuestion}
                      className="text-black bg-green-400 outline outline-2 rounded-md font-bold text-xl p-1 pl-2 hover:bg-slate-100"
                    />
                  </div>
                )}
              </div>
            </form>
            <h2 className="text-black mb-4 text-2xl text-center mt-4">
              Here are some ideas generated by AI
            </h2>
            {/* <text className="text-black  text-lg mb-4 ml-4">
                        Alternative uses generated by GPT-4
                    </text> */}
            <div
              onCopy={preventDefaultAction}
              className="text-black flex-grow place-items-center select-none h-5/6 text-xs bg-orange-600 rounded-b-[20px] rounded-lg mt-4 p-2 whitespace-pre-line overflow-auto"
              style={{
                backgroundColor: "rgba(71, 85, 105, 0.18)",
                maxWidth: "800px",
              }}
            >
              <ReactTyped
                key={prompt_json[promptCopy[promptId][3]]["gpt-4-coach"]}
                strings={[prompt_json[promptCopy[promptId][3]]["gpt-4-coach"]]}
                typeSpeed={0.1}
                cursorChar="⬤"
                showCursor={true}
                startDelay={1000}
              />
            </div>
            <div className="p-2"></div>
          </div>
        </div>
      </div>
    )
  ) : (
    <Game />
  );
};

export default Coach;
