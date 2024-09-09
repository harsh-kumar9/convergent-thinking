import React, { useState } from "react";
import { useContext } from "react";
import { DataContext } from "../App";
import { mTurkContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import background from "../assets/blur-background.svg";

const Feedback = () => {
  const navigate = useNavigate();
  const { data, addData } = useContext(DataContext);
  const { mTurk, addMTurk } = useContext(mTurkContext);

  const [sliderValue, setSliderValue] = useState(null);
  // console.log(mTurk.assignmentId);
  // console.log(mTurk.workerId);
  const handleChange = (event) => {
    setSliderValue(event.target.value);
  };
  // const [date, setDate] = useState(new Date());
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setq4] = useState("");
  const [q6, setq6] = useState("");
  const [q7, setq7] = useState("");
  const submitData = async (data) => {
    try {
      console.log("attempt");
      const response = await axios.post(
        "https://creative-gpt.azurewebsites.net/api/httptrigger2?code=SfnloefDXU04OK8Ao4QAvrwDRNIBeoDKWmco5VKt33xSAzFukmwSbw%3D%3D",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Redirect to the Prolific URL
      console.log("here");
      window.location.href =
        "https://app.prolific.com/submissions/complete?cc=C1EXYXN1";

      if (response.status !== 200) {
        console.log("Response not okay");
      }

      return response.data;
    } catch (error) {
      console.log(error);
      console.error("Error submitting data:", error);
      throw error;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Data validation
    if (
      !(q1 === "") &&
      !(q2 === "") &&
      !(q3 === "") &&
      !(q4 === "") &&
      !(q6 === "") &&
      !(q7 === "") &&
      !(sliderValue === null)
    ) {
      // Prepare feedback responses for submission
      const feedbackData = {
        q1,
        q2,
        q3,
        q4,
        q6,
        q7,
        sliderValue,
      };

      // Optionally, update your application state with new feedback data
      addData(feedbackData);

      // Construct the data object for MTurk submission
      const submissionData = {
        ...data, // Spread existing data into the submission object
        feedback: feedbackData, // Add new feedback data
        assignmentId: mTurk.assignmentId,
        hitId: mTurk.hitId,
        workerId: mTurk.workerId,
        ts_submitted_: new Date().toISOString(),
      };

      // For MTurk submission: Set the value of a hidden input to include all necessary data
      // const dataInput = document.createElement("input");
      // dataInput.type = "hidden";
      // dataInput.name = "data";
      // dataInput.value = JSON.stringify(submissionData);
      // event.target.appendChild(dataInput);
      console.log(submissionData);
      submitData(submissionData)
        .then((result) => {
          console.log("Data submitted successfully:", result);
        })
        .catch((error) => {
          console.error("Error in submission:", error);
        });
    } else if (
      !(q1 === "") &&
      !(q2 === "") &&
      !(q3 === "") &&
      !(q4 === "") &&
      !(q6 === "") &&
      !(q7 === "") &&
      !(sliderValue === null)
    ) {
      alert("Please answer all the questions to proceed");
      return;
    } else {
      alert("Please read the instructions & answer all questions to proceed");
      return;
    }
  };

  return (
    <div className="h-auto w-screen items-center justify-center flex text-black text-3xl font-semibold p-14 bg-cover">
      <form
        className="flex flex-col text-center h-full w-full items-center justify-center outline outline-2 outline-black rounded-[60px] py-10 px-10 bg-slate-500"
        style={{ backgroundColor: "rgba(64, 64, 64, 0.17)" }}
        action={`${mTurk.turkSubmitTo}/mturk/externalSubmit`}
        method="POST"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl mb-8">
          Please answer the following questions. You must complete these and
          click submit below to complete the task and get paid.
        </h2>

        {/* Question 1 */}
        <div className="text-2xl flex flex-col mb-4">
          <h2>
            1. How difficult was it to come up the associated word for the last
            two (test) tasks?
          </h2>
          {/* Options for Question 1 */}
          <label>
            <input
              type="radio"
              name="q1"
              value="Very easy"
              checked={q1 === "Very easy"}
              onChange={(e) => setQ1(e.target.value)}
              className="mr-2"
            />
            Very easy
          </label>
          <label>
            <input
              type="radio"
              name="q1"
              value="Somewhat easy"
              checked={q1 === "Somewhat easy"}
              onChange={(e) => setQ1(e.target.value)}
              className="mr-2"
            />
            Somewhat easy
          </label>
          <label>
            <input
              type="radio"
              name="q1"
              value="Somewhat difficult"
              checked={q1 === "Somewhat difficult"}
              onChange={(e) => setQ1(e.target.value)}
              className="mr-2"
            />
            Somewhat difficult
          </label>
          <label>
            <input
              type="radio"
              name="q1"
              value="Very difficult"
              checked={q1 === "Very difficult"}
              onChange={(e) => setQ1(e.target.value)}
              className="mr-2"
            />
            Very difficult
          </label>
        </div>

        {/* Additional questions follow a similar pattern to Question 1 */}
        {/* Example for Question 2 */}
        <div className="text-2xl flex flex-col mb-4">
          <h2>
            2. Artificial intelligence computer programs are designed to learn
            tasks that humans typically do. Would you say the increased use of
            artificial intelligence computer programs in daily life makes you
            feel
          </h2>
          {/* Options for Question 2 */}
          <label>
            <input
              type="radio"
              name="q2"
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
              name="q2"
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
              name="q2"
              value="Equally excited and concerned"
              checked={q2 === "Equally excited and concerned"}
              className="mr-2"
              onChange={(e) => setQ2(e.target.value)}
            />
            Equally excited and concerned
          </label>
        </div>

        {/* Question 3 */}
        <div className="text-2xl flex flex-col mb-4">
          <h2>3. Please select the Agree for this</h2>
          {/* Options for Question 3 */}
          <label>
            <input
              type="radio"
              name="q3"
              value="Disagree"
              checked={q3 === "Disagree"}
              className="mr-2"
              onChange={(e) => setQ3(e.target.value)}
            />
            Disagree
          </label>
          <label>
            <input
              type="radio"
              name="q3"
              value="Neutral"
              checked={q3 === "Neutral"}
              className="mr-2"
              onChange={(e) => setQ3(e.target.value)}
            />
            Neutral
          </label>
          <label>
            <input
              type="radio"
              name="q3"
              value="Agree"
              checked={q3 === "Agree"}
              className="mr-2"
              onChange={(e) => setQ3(e.target.value)}
            />
            Agree
          </label>
        </div>
        <div className="text-2xl flex flex-col mb-4">
          <h2>
            4. How helpful was the practice round (first three questions)?
          </h2>
          {/* Options for Question 3 */}
          <label>
            <input
              type="radio"
              name="q4"
              value="Not at all helpful"
              checked={q4 === "Not at all helpful"}
              className="mr-2"
              onChange={(e) => setq4(e.target.value)}
            />
            Not at all helpful
          </label>
          <label>
            <input
              type="radio"
              name="q4"
              value="A little helpful"
              checked={q4 === "A little helpful"}
              className="mr-2"
              onChange={(e) => setq4(e.target.value)}
            />
            A little helpful
          </label>
          <label>
            <input
              type="radio"
              name="q4"
              value="Very helpful"
              checked={q4 === "Very helpful"}
              className="mr-2"
              onChange={(e) => setq4(e.target.value)}
            />
            Very helpful
          </label>
          <div className="text-2xl flex items-center justify-center space-x-8 mb-4">
            <label>
              5. Adjust the slider:{" "}
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
        </div>
        {/* New question */}
        <div className="mb-4">
          <h2 className="text-2xl mb-2">
            6. What was your strategy for coming up with associated word for the
            last two tasks?
          </h2>
          <textarea
            name="q6"
            value={q6}
            onChange={(e) => setq6(e.target.value)}
            className="text-lg p-2 w-full h-32 text-black" // Adjust width (w-full for full width) and height (h-32 for height) as needed
            style={{ resize: "none" }} // Optional: prevents the user from resizing the textarea
          ></textarea>
        </div>

        {/* Technical issues question */}
        <div className="mb-4">
          <h2 className="text-2xl mb-2">
            7. Did you have any technical issues during the task?
          </h2>
          <textarea
            name="q7"
            value={q7}
            onChange={(e) => setq7(e.target.value)}
            className="text-lg p-2 w-full h-32 text-black" // Adjust width (w-full for full width) and height (h-32 for height) as needed
            style={{ resize: "none" }} // Optional: prevents the user from resizing the textarea
          ></textarea>
        </div>
        {/* Question 6 */}

        {/* Hidden inputs for MTurk */}
        <input type="hidden" name="assignmentId" value={mTurk.assignmentId} />
        <input type="hidden" name="hitId" value={mTurk.hitId} />
        <input type="hidden" name="workerId" value={mTurk.workerId} />

        {/* Submit button */}
        <input
          type="submit"
          value="SUBMIT"
          className="outline outline-offset-2 outline-white text-black outline-2 rounded-md mt-4 font-bold text-2xl px-4 py-2 hover:bg-slate-100"
        />
      </form>
    </div>
  );
};

export default Feedback;
