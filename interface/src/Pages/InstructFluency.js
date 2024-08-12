import React, { useState, useContext } from "react";
import { DataContext } from "../App";
import { useNavigate } from "react-router-dom";
import background from "../assets/blur-background.svg";

const InstructFluency = () => {
  const navigate = useNavigate();
  const { data, addData } = useContext(DataContext);

  const [sliderValue, setSliderValue] = useState(null);
  const [q2, setQ2] = useState("");

  const handleChange = (event) => {
    setSliderValue(event.target.value);
  };

  const handleClick = () => {
    if (checked && checked2) {
      navigate("/convergent-thinking/fluency");
    } else {
      alert("Please read the instructions & answer all questions to proceed");
    }
  };

  const [checked, setChecked] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const handleCheck = () => {
    setChecked(!checked);
  };
  const handleCheck2 = () => {
    setChecked2(!checked2);
  };
  return (
    <div className="text-black h-auto w-screen items-center justify-center space-y-8 p-14 bg-cover">
      <div
        className="flex flex-col items-center justify-center outline outline-2 outline-black rounded-[60px] px-10 py-8 bg-slate-500"
        style={{ backgroundColor: "rgba(64, 64, 64, 0.17)" }}
      >
        <h1 className="text-3xl font-bold mb-4">Verbal Fluency Introduction</h1>
        <p className="text-xl mb-2">
          To begin, you will complete a quick verbal fluency task. On the next
          screen you will be shown a letter of the alphabet and have{" "}
          <b>1 minute</b> to list as many english words as you can that begin with that
          letter. None of the words can be numbers or names of people.
        </p>
        <p className="text-xl mb-8">
          For example, if shown the letter B, you could say brown, bottle, or
          bake, but you wouldn’t say Barbara, Boston or billion. Also, please
          try not to give me the same word with different endings, so if you
          said bake, you wouldn’t also say baked or bakes, and if you said big,
          you wouldn’t also say bigger and biggest.
        </p>
        <p className="text-xl mb-8">
          Your goal is to list <b>as many words as possible</b> in the alloted
          time.
        </p>
        <h1 className="text-2xl font-bold mb-4">Important: Please do not take screenshots, copy any text, or consult external tools (e.g., ChatGPT).</h1>
        <p className="text-xl font-bold  mb-8" style={{color: "red"}}>
        We're just interested in your best effort and what you learn.
        </p>
        <p className="text-xl font-bold mb-8" style={{color: "red"}}>
        You will be paid regardless of how well you do!
        </p>
        <p className="text-xl  mb-8" >
        The experiment will be ruined if you take screenshots or use external tools to do this task. So please do not do so! In fact, you have no reason to do so because you are not paid based on performance.
        </p>
        <div><img src={"/convergent-thinking/cheat-icon.png"} alt="No screenshots or external tools allowed" style={{maxWidth: "40%", height: "auto", display: "block", margin: "0px auto"}}/></div>
        <p className="text-xl font-bold mb-8" style={{color: "red"}}>
        Please do not refresh the page. If you refresh the page, you will lose any progress you have made and may not receive any compensation.
        </p>
        <hr style={{ marginTop: "20px", marginBottom: "20px" }} />
        <label className="text-xl mt-2">
          <input type="checkbox" checked={checked} onChange={handleCheck} />
          <b>
            {`  `}I promise not to take screenshots, pictures, or use external tools to do this study. I understand that I will not be paid more if I do so and it will only ruin the experiment.*
          </b>
        </label>
        <label className="text-xl mt-2">
        <input type="checkbox" checked={checked2} onChange={handleCheck2} />
          <b>
            {`  `}I understand the instructions above and am ready to continue*
          </b>
          </label>
        <button
          onClick={handleClick}
          className="mt-6 text-xl outline outline-offset-2 outline-2 rounded-md font-semibold px-4 py-1 hover:bg-slate-100"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default InstructFluency;
