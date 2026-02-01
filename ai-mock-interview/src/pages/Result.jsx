import { useLocation } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const answers = state?.answers || [];

  if (!answers.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>No interview data found.</p>
      </div>
    );
  }

  // ✅ BASIC SCORE CALCULATION
  let score = 0;

  answers.forEach(a => {
    if (a.answer.length > 50) score += 10;
    else if (a.answer.length > 20) score += 6;
    else score += 3;
  });

  score = Math.min(score, 100);

  const status =
    score >= 75 ? "Strong" :
    score >= 50 ? "Good" :
    "Needs Improvement";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-gray-800 rounded-xl text-center w-96">

        <h2 className="text-2xl font-bold mb-4">Interview Summary</h2>

        <div className="text-5xl font-bold text-blue-400 mb-2">
          {score}
        </div>

        <p className="text-gray-300 mb-4">Interview Readiness Score</p>

        <span className="px-4 py-2 rounded-full bg-green-700 text-sm">
          {status}
        </span>

      </div>
    </div>
  );
}
