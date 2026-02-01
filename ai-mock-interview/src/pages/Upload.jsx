import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [resume, setResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const extractSkills = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("http://localhost:5000/extract-skills", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setSkills(data.skills || []);
    setLoading(false);
  };

  const startInterview = async () => {
  try {
    if (!resume || !jd.trim()) {
      alert("Resume and JD required");
      return;
    }

    const res = await fetch("https://ai-mock-interview-backend-8pxv.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skills,
        jd,
      }),
    });

    const data = await res.json(); // ✅ THIS WAS MISSING

    if (!data.questions || data.questions.length === 0) {
      alert("Interview start failed");
      return;
    }

    navigate("/interview", {
      state: {
        questions: data.questions,
        currentIndex: 0,
        answers: [],
      },
    });

  } catch (err) {
    console.error(err);
    alert("Interview start failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800/70 backdrop-blur p-8 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-4">
          🤖 AI Mock Interview
        </h1>

        <input
          type="file"
          accept=".docx"
          onChange={(e) => {
            setResume(e.target.files[0]);
            extractSkills(e.target.files[0]);
          }}
          className="mb-4"
        />

        {loading && <p className="text-yellow-400">Analyzing resume...</p>}

        {skills.length > 0 && (
          <p className="text-green-400 mb-4">
            🧠 Skills: {skills.join(", ")}
          </p>
        )}

        <textarea
          placeholder="Paste Job Description"
          onChange={(e) => setJd(e.target.value)}
          className="w-full p-3 text-black rounded mb-4"
        />

        <button
  onClick={startInterview}
  className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
>
  Start Interview 🚀
</button>


      </div>
    </div>
  );
}
