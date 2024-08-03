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
    if (checked) {
      navigate("/convergent-thinking/fluency");
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
        <h1 className="text-3xl font-bold mb-4">Verbal Fluency Introduction</h1>
        <p className="text-2xl mb-2">
          To begin, you will complete a quick verbal fluency task. On the next
          screen you will be shown a letter of the alphabet and have{" "}
          <b>1 minute</b> to list as many words as you can that begin with that
          letter. None of the words can be numbers or names of people.
        </p>
        <p className="text-2xl mb-8">
          For example, if shown the letter B, you could say brown, bottle, or
          bake, but you wouldn’t say Barbara, Boston or billion. Also, please
          try not to give me the same word with different endings, so if you
          said bake, you wouldn’t also say baked or bakes, and if you said big,
          you wouldn’t also say bigger and biggest.
        </p>
        <p className="text-2xl mb-8">
          Your goal is to list <b>as many words as possible</b> in the alloted
          time.
        </p>
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

export default InstructFluency;
