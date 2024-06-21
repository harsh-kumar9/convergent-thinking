import React, { useEffect, useState, useRef, useContext } from "react";
import { DataContext } from "../App";
import { useNavigate } from "react-router-dom";
import { prompts, promptsArray } from "./Prompts";
import background from "../assets/blur-background.svg";

let nextId = 0;
let promptId = 0;
let itemId = 0;
let ideasCount = 0;

const Fluency = () => {
  const [input, setInput] = useState(""); // store currently inputted idea in input form
  const [ideas, setIdeas] = useState([]); // previously entered ideas

  const [ideaEditing, setIdeaEditing] = useState(null); // id of idea we are editing
  const [editingText, setEditingText] = useState("");
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

  const handleSubmit = (e) => {
    // e is short for event
    e.preventDefault(); // prevents page from refreshing upon clicking submit
    setIdeas([
      ...ideas,
      {
        id: nextId++,
        iid: itemId++,
        name: input,
        time: new Date().toISOString(),
      },
    ]);
    setInput(""); // clears the input form
  };

  function editIdea(id) {
    const updatedIdeas = [...ideas].map((idea) => {
      if (idea.id === id) {
        idea.name = editingText;
        idea.time = new Date().toISOString();
      }
      return idea;
    });
    setIdeas(updatedIdeas);

    // reset editing hooks
    setIdeaEditing(null);
    setEditingText("");
  }

  // timer countdown in seconds
  const [time, setTime] = useState(60);

  const deleteIdea = (id) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

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
      addData({ HideTime: outOfFocusTime });
      navigate("/convergent/controls");
    }
  }, [time]);

  return (
    <div className="h-screen w-screen items-center justify-center flex text-3xl font-semibold space-y-8 p-8 bg-cover">
      <div className="flex flex-row space-x-4 p-4 h-full w-full items-center justify-center rounded-[60px]">
        <div
          className="w-1/3 rounded-[60px] bg-orange-500 flex flex-col items-center h-full px-4  outline outline-2 outline-white bg-slate-500"
          style={{ backgroundColor: "rgba(64, 64, 64, 0.17)" }}
        >
          <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-row justify-between items-center mb-4 mt-8 px-3">
              <h2 className="text-black text-lg 2xl:text-2xl text-center">
                Enter words starting with the letter "F"
              </h2>
              <span
                style={{
                  backgroundColor: "rgba(0, 100, 0, .5)",
                }}
                className="text-white text-center outline outline-1 rounded-lg text-2xl p-2"
              >
                Time: {`${Math.floor(time / 60)}`.padStart(2, 0)}:
                {`${time % 60}`.padStart(2, 0)}
              </span>
            </div>

            <div className="flex flex-row space-x-4 justify-between">
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
                className="text-black outline outline-offset-2 outline-2 rounded-md font-bold text-xl px-2 hover:bg-slate-100"
              />
            </div>
          </form>

          <div
            className="h-3/4 w-full rounded-b-[60px] bg-orange-600 mt-6 rounded-lg px-4 py-4 grid place-items-start bg-slate-500"
            style={{ backgroundColor: "rgba(71, 85, 105, 0.18)" }}
          >
            <ul className="flex flex-col items-center w-full h-full overflow-hidden overflow-y-auto mt-2">
              {ideas.map((idea) => (
                <li
                  key={idea.id}
                  className="text-black text-left text-xl flex flex-col w-full px-2 space-y-1"
                >
                  <div className="flex flex-row w-full justify-between items-center justify-center mt-2">
                    {ideaEditing === idea.id ? (
                      <form
                        onSubmit={() => editIdea(idea.id)}
                        className="flex flex-row"
                      >
                        <input
                          type="text"
                          value={editingText}
                          className="w-full p-1 outline outline-1 bg-transparent"
                          onChange={(e) => setEditingText(e.target.value)}
                        />
                        <input input type="submit" value="✔️" />
                      </form>
                    ) : (
                      <span className="whitespace-normal max-w-3/4">{`${idea.name}`}</span>
                    )}

                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setIdeaEditing(idea.id);
                          setEditingText(idea.name);
                        }}
                      >
                        ✏️
                      </button>

                      <button onClick={() => deleteIdea(idea.id)}>❌</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fluency;
