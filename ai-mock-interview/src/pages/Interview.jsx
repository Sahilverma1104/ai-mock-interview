import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Interview() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const questions = state?.questions || [];
  const startIndex = state?.currentIndex || 0;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>No interview questions found.</p>
      </div>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = () => {
    if (!answer.trim()) {
      alert("Please write an answer");
      return;
    }

    setAnswers([
      ...answers,
      {
        question: questions[currentIndex].question, // ✅ FIX
        skill: questions[currentIndex].skill,
        answer,
      },
    ]);

    setAnswer("");
    setCurrentIndex(currentIndex + 1);
  };

  const handleSubmitInterview = () => {
    if (!answer.trim()) {
      alert("Please write an answer");
      return;
    }

    const finalAnswers = [
      ...answers,
      {
        question: questions[currentIndex].question, // ✅ FIX
        skill: questions[currentIndex].skill,
        answer,
      },
    ];

    navigate("/result", {
      state: {
        answers: finalAnswers,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-2xl w-full p-6 bg-gray-800 rounded-xl">

        <h2 className="text-xl font-semibold mb-1">
          AI Interview Question ({currentIndex + 1}/{questions.length})
        </h2>

        {/* ✅ OPTIONAL: skill badge */}
        <p className="text-sm text-gray-400 mb-3">
          Skill: {questions[currentIndex].skill}
        </p>

        {/* ✅ FIXED RENDER */}
        <p className="text-lg mb-4">
          {questions[currentIndex].question}
        </p>

        <textarea
          rows="6"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-700 mb-4"
        />

        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Next Question →
          </button>
        ) : (
          <button
            onClick={handleSubmitInterview}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 font-semibold"
          >
            Submit Interview ✅
          </button>
        )}
      </div>
    </div>
  );
}
