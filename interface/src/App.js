import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import Controls from "./Pages/Controls";
import Absent from "./RAT/Absent";
import Generate from "./RAT/Generate";
import Coach from "./RAT/Coach";
import Fluency from "./RAT/Fluency";
import Refine from "./RAT/Refine";
import Introduction from "./Pages/Captcha";
import InstructFluency from "./Pages/InstructFluency";
import InstructAbsent from "./Pages/InstructAbsent";
import InstructGenerate from "./Pages/InstructGenerate";
import InstructCoach from "./Pages/InstructCoach";
import Thanks from "./Pages/Thanks";
import Captcha from "./Pages/Captcha";
import Consent from "./Pages/Consent";
import Feedback from "./Pages/Feedback";
import Game from "./Game/Game";

export const DataContext = createContext();
export const mTurkContext = createContext();

function App() {
  const [data, setData] = useState([]);

  const addData = (newData) => {
    setData((prevArray) => [...prevArray, newData]);
  };

  const [mTurk, setMTurk] = useState({});

  const addMTurk = (key, value) => {
    setMTurk((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const [acceptedHIT, setAcceptedHIT] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const assignmentId = urlParams.get("assignmentId") || "test";
    setAcceptedHIT(assignmentId !== "ASSIGNMENT_ID_NOT_AVAILABLE");
    const hitId = urlParams.get("hitId") || "test";
    const turkSubmitTo = urlParams.get("turkSubmitTo") || "test";
    const workerId =
      urlParams.get("workerId") || "test" + Math.floor(Math.random() * 10000);

    addMTurk("assignmentId", assignmentId);
    addMTurk("hitId", hitId);
    addMTurk("turkSubmitTo", turkSubmitTo);
    addMTurk("workerId", workerId);
  }, []);

  return (
    <div className="App">
      {!acceptedHIT ? (
        <div>
          In this study, you will be asked to complete numerous remote
          association tasks. We estimate this task will take around 10 minutes.
          You must accept this HIT to continue.
        </div>
      ) : (
        <DataContext.Provider value={{ data, addData }}>
          <mTurkContext.Provider value={{ mTurk, addMTurk }}>
            <Router>
              <Routes>
                <Route path="/convergent/" element={<Captcha />} />
                <Route
                  path="/convergent/instructabsent"
                  element={<InstructAbsent />}
                />
                <Route
                  path="/convergent/instructgenerate"
                  element={<InstructGenerate />}
                />
                <Route
                  path="/convergent/instructcoach"
                  element={<InstructCoach />}
                />
                <Route
                  path="/convergent/instructfluency"
                  element={<InstructFluency />}
                />
                <Route path="/convergent/thanks" element={<Thanks />} />
                <Route path="/convergent/consent" element={<Consent />} />
                <Route path="/convergent/controls" element={<Controls />} />
                <Route path="/convergent/absent" element={<Absent />} />
                <Route path="/convergent/generate" element={<Generate />} />
                <Route path="/convergent/coach" element={<Coach />} />
                <Route path="/convergent/refine" element={<Refine />} />
                <Route path="/convergent/feedback" element={<Feedback />} />
                <Route path="/convergent/game" element={<Game />} />
                <Route path="/convergent/fluency" element={<Fluency />} />
              </Routes>
            </Router>
          </mTurkContext.Provider>
        </DataContext.Provider>
      )}
    </div>
  );
}

export default App;
