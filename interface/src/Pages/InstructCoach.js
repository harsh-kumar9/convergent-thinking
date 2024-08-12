import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../App";
import background from "../assets/blur-background.svg";

const InstructCoach = () => {
  const navigate = useNavigate();
  const { data, addData } = useContext(DataContext);

  const [sliderValue, setSliderValue] = useState(null);
  const [q2, setQ2] = useState("");

  const handleChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleClick = () => {
    if (checked && !(q2 === "") && !(sliderValue === null)) {
      addData({
        "How Creative?": sliderValue,
        "Increased AI use makes you feel": q2,
      });
      navigate("/convergent-thinking/coach");
    } else if (checked && !(q2 === "") && sliderValue === null) {
      alert("Please select a value for Question 1 (Slider)");
    } else {
      alert("Please read the instructions & answer all questions to proceed");
    }
  };

  const [checked, setChecked] = React.useState(false);

  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <div className="text-black h-auto w-screen items-center justify-center space-y-8 p-14 bg-cover">
      <div
        className="flex flex-col items-center justify-center outline outline-2 outline-black rounded-[60px] px-10 py-8 bg-slate-500"
        style={{ backgroundColor: "rgba(64, 64, 64, 0.17)" }}
      >
        <h1 className="text-3xl font-bold mb-4">Introduction</h1>

        <p className="text-2xl mb-2">
          In this task, You will be shown sets of three words at a time. For each
          set of three words, you will be asked to generate a fourth word that
          connects or fits with all three words. Specifically, the word that you
          generate, when combined with each of the three stimulus words, should
          create three word-pairs, each of which makes a common compound word or
          phrase. Please try to be <b>creative</b> and <b>appropriate</b> in
          your responses.
        </p>
        <p className="text-2xl mb-8">
          For example, one set of words that you might be shown is:
        </p>
        <o1 class="list-decimal text-2xl mb-8">
          {["shelf", "log", "worm"].map((item) => (
            <li>
              <b>{item}</b>
            </li>
          ))}
        </o1>
        <p className="text-2xl mb-8">
          A word that can be combined with each of these stimulus words is "
          <b>book</b>":
        </p>
        <o1 class="list-decimal text-2xl mb-8">
          {[
            <li>
              <b>
                <u>book</u> shelf
              </b>
            </li>,
            <li>
              <b>
                log <u>book</u>
              </b>
            </li>,
            <li>
              <b>
                <u>book</u> worm
              </b>
            </li>,
          ].map((item) => item)}
        </o1>
        <p className="text-2xl mb-8">
          Another set of words that you might be shown is:
        </p>
        <o1 class="list-decimal text-2xl mb-8">
          {["cream", "skate", "pick"].map((item) => (
            <li>
              <b>{item}</b>
            </li>
          ))}
        </o1>
        <p className="text-2xl mb-8">
          A word that can be combined with each of these words to create a
          common word or phrase is "<b>ice</b>":
        </p>
        <o1 class="list-decimal text-2xl mb-8">
          {[
            <li>
              <b>
                <u>ice</u> cream
              </b>
            </li>,
            <li>
              <b>
                <u>ice</u> skate
              </b>
            </li>,
            <li>
              <b>
                <u>ice</u> pick
              </b>
            </li>,
          ].map((item) => item)}
        </o1>
        <p className="text-2xl mb-8">
          Write down only the fourth word (i.e., "book" and "ice") as your
          answers. You will have 2 minutes for each task. Once you click submit,
          you will not be able to change your answer. There will be 3 practice
          rounds, followed by a short break, then 1 test round.
        </p>

        <p className="text-2xl mb-8">
          In the Practice round, to spark your imagination, you will receive
          guidance from AI (i.e., ChatGPT) to help you come up with the idea.
          This will be shown at the bottom of the screen.
        </p>

        <b>
          <p className="text-2xl mb-8">
            Please answer the following questions:
          </p>
        </b>

        <div className="text-2xl flex items-center justify-center space-x-8 mb-4">
          <label>
            1. Adjust the slider:{" "}
            <i>
              I am more creative than{" "}
              <b>
                <span>{sliderValue}%</span>
              </b>{" "}
              of humans
            </i>
          </label>
          <input
            type="range"
            id="creative-slider"
            name="creative-slider"
            min="0"
            max="100"
            // Conditionally render the value only if sliderValue is not null
            value={sliderValue ?? ""}
            onChange={handleChange}
          />
        </div>

        <h2 className="text-2xl">
          2. Artificial intelligence computer programs are designed to learn
          tasks that humans typically do. Would you say the increased use of
          artificial intelligence computer programs in daily life makes you
          feel:
        </h2>
        <div className="flex flex-col text-2xl">
          <label>
            <input
              type="radio"
              name="q1"
              value="More concerned than excited"
              checked={q2 === "More concerned than excited"}
              className="mr-2"
              onChange={(e) => setQ2(e.target.value)}
            />
            More concerned than excited
          </label>
          <label>
            <input
              type="radio"
              name="q1"
              value="More excited than concerned"
              checked={q2 === "More excited than concerned"}
              className="mr-2"
              onChange={(e) => setQ2(e.target.value)}
            />
            More excited than concerned
          </label>
          <label>
            <input
              type="radio"
              name="q1"
              value="Equally excited and concerned"
              checked={q2 === "Equally excited and concerned"}
              className="mr-2"
              onChange={(e) => setQ2(e.target.value)}
            />
            Equally excited and concerned
          </label>
        </div>

        <hr style={{ marginTop: "20px", marginBottom: "20px" }} />

        <label className="text-2xl mt-2">
          <input type="checkbox" checked={checked} onChange={handleCheck} />
          <b>
            {`  `}I understand the instructions above and am ready to continue*
          </b>
        </label>
        <button
          onClick={handleClick}
          className="mt-6 text-2xl outline outline-offset-2 outline-2 rounded-md font-semibold px-4 py-1 hover:bg-slate-100"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default InstructCoach;
