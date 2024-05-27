import React, { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "../App";
import { useNavigate } from "react-router-dom";
import { easyRAT, mediumRAT, hardRAT} from "./Prompts";
import background from "../assets/blur-background.svg";
import Game from "../Game/Game";

let nextId = 0;
let promptId = 0;
let itemId = 0;
let ideasCount = 0;

const Absent = () => {
  // const [input, setInput] = useState(""); // store currently inputted idea in input form
  

  // const [ideaEditing, setIdeaEditing] = useState(null); // id of idea we are editing
  // const [editingText, setEditingText] = useState("");

  const [input, setInput] = useState("");
  const [idea, setIdea] = useState([]); // Answer
  const [promptCopy, setPromptCopy] = useState([]);
  const [shuffled, setShuffled] = useState(false);

  const outOfFocusStart = useRef(0);
  const [outOfFocusTime, setOutOfFocusTime] = useState(0);

  const { data, addData } = useContext(DataContext);

  const navigate = useNavigate();

  const preventDefaultAction = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    // log page load time
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
      const trialArray = [...shuffledEasy.slice(0, 2), ...shuffledMedium.slice(0, 2),...shuffledHard.slice(0, 2)]
      const testArray = [shuffledEasy[3], shuffledMedium[3], shuffledHard[3]]
      return [...shuffleArray(trialArray), "dummy", ...shuffleArray(testArray)];
    });
    setShuffled(true);
  }, []);

  const handleSubmit = (e) => {
    // e is short for event
    e.preventDefault(); // prevents page from refreshing upon clicking submit
    setIdea(input)
    setInput(""); // clears the input form
  };
  // timer countdown in seconds
  const [time, setTime] = useState(20);

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
      if (!(promptId === 6)) {
        addData({
          Prompt: promptCopy[promptId][3],
          Response: idea,
        });
      }

      if (promptId === 9) {
        addData({ HideTime: outOfFocusTime });
        navigate("/convergent/feedback");
      } else {
        promptId += 1;
        // reset states and timer
        if (promptId === 6) {
          setTime(60);
        } else {
          setTime(20);
        }
        setInput("");
        setIdea("");
      }
    }
    if (promptId >= promptCopy.length) {
      setTime(0);
    }
  }, [time]);
  if (!shuffled || !promptCopy.length) {
    return <div>Loading...</div>;
  }
  return !(promptId === 6) ? (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="h-screen w-screen items-center justify-center flex text-3xl font-semibold space-y-8 p-8 bg-cover"
    >
      <div className="flex flex-row space-x-4 p-4 h-full w-full items-center justify-center rounded-[60px]">
        <div
          className="w-1/1 rounded-[60px] bg-orange-500 flex flex-col items-center h-full px-4  outline outline-2 outline-white bg-slate-500"
          style={{ backgroundColor: "rgba(64, 64, 64, 0.17)" }}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-row justify-between items-center mb-4 mt-8 px-3">
              <h2 className="text-white text-lg text-center p-1">
                For the following cue words, find a word which relates to them all. 
              </h2>
              <p className="text-white w-fit  outline outline-1  rounded-lg text-xl p-1">
                Time: {`${Math.floor(time / 60)}`.padStart(2, 0)}:
                {`${time % 60}`.padStart(2, 0)}
              </p>
            </div>
            <div className="flex flex-row justify-between items-center mb-4 mt-8 px-3" style={{ backgroundColor: "rgba(71, 85, 105, 0.18)" }}>
              <h2 className="text-white text-4xl text-center">
                {promptCopy[promptId][0]}, {promptCopy[promptId][1]}, {promptCopy[promptId][2]}
              </h2>
            </div>

            <div className="flex flex-row space-x-4 justify-between p-1">
              <input
                type="text"
                value={input}
                className="w-2/3 p-1 text-lg"
                onPaste={preventDefaultAction}
                onChange={(e) => setInput(e.target.value)}
              />
              <input
                type="submit"
                value="SUBMIT"
                className="text-white outline outline-offset-2 outline-2 rounded-md font-bold text-xl px-2 hover:bg-orange-500"
              />
            </div>
            <div className="flex flex-row space-x-4 justify-between p-3">
              <p className="text-white w-fit  outline outline-1  rounded-lg text-xl p-1">
                Current answer: {idea}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <Game />
  );
};

export default Absent;
