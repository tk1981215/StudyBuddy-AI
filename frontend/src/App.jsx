import { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("");

  // =====================================================
  // EXPLAIN TOPIC
  // =====================================================

  const explainTopic = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first.");
      return;
    }

    setLoading(true);
    setMode("explain");
    setResult(null);
    setExamResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to explain topic");
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert(
        "Could not connect to StudyBuddy AI. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EXAM PREPARATION
  // =====================================================

  const prepareExam = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first.");
      return;
    }

    setLoading(true);
    setMode("exam");
    setResult(null);
    setExamResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/exam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to prepare exam");
      }

      setExamResult(data);
    } catch (error) {
      console.error(error);
      alert(
        "Could not connect to StudyBuddy AI. Make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="header">
        <div className="logo">
          📚 StudyBuddy AI
        </div>

        <p>
          Your simple AI study companion
        </p>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="container">

        <section className="hero">
          <h1>
            Study Smarter.
            <br />
            Understand Better.
          </h1>

          <p>
            Enter any college topic and let StudyBuddy explain it
            in simple words or prepare you for your exam.
          </p>
        </section>

        {/* =================================================
            INPUT
        ================================================= */}

        <section className="study-box">

          <label htmlFor="topic">
            What do you want to study?
          </label>

          <input
            id="topic"
            type="text"
            placeholder="Example: DBMS, Operating System, Machine Learning..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="buttons">

            <button
              className="explain-btn"
              onClick={explainTopic}
              disabled={loading}
            >
              {loading && mode === "explain"
                ? "Thinking..."
                : "✨ Explain Topic"}
            </button>

            <button
              className="exam-btn"
              onClick={prepareExam}
              disabled={loading}
            >
              {loading && mode === "exam"
                ? "Preparing..."
                : "📝 Exam Preparation"}
            </button>

          </div>

        </section>

        {/* =================================================
            EXPLANATION RESULT
        ================================================= */}

        {result && (
          <section className="result-card">

            <div className="result-title">
              <span>📖</span>
              <h2>{result.topic}</h2>
            </div>

            <div className="answer">
              {result.explanation}
            </div>

          </section>
        )}

        {/* =================================================
            EXAM RESULT
        ================================================= */}

        {examResult && (
          <section className="exam-results">

            <div className="result-card">

              <div className="result-title">
                <span>🎯</span>
                <h2>Important Questions</h2>
              </div>

              <ol>
                {examResult.important_questions.map(
                  (question, index) => (
                    <li key={index}>{question}</li>
                  )
                )}
              </ol>

            </div>


            <div className="result-card">

              <div className="result-title">
                <span>✍️</span>
                <h2>Short Answer Questions</h2>
              </div>

              <ol>
                {examResult.short_answer_questions.map(
                  (question, index) => (
                    <li key={index}>{question}</li>
                  )
                )}
              </ol>

            </div>


            <div className="result-card">

              <div className="result-title">
                <span>🧠</span>
                <h2>MCQs</h2>
              </div>

              {examResult.mcqs.map((mcq, index) => (

                <div className="mcq" key={index}>

                  <h3>
                    {index + 1}. {mcq.question}
                  </h3>

                  <ul>
                    {mcq.options.map((option, optionIndex) => (
                      <li key={optionIndex}>
                        {String.fromCharCode(65 + optionIndex)}.{" "}
                        {option}
                      </li>
                    ))}
                  </ul>

                  <p className="answer-text">
                    <strong>Answer:</strong> {mcq.answer}
                  </p>

                </div>

              ))}

            </div>


            <div className="result-card">

              <div className="result-title">
                <span>⚡</span>
                <h2>Quick Revision</h2>
              </div>

              <ul className="revision-list">
                {examResult.revision_points.map(
                  (point, index) => (
                    <li key={index}>{point}</li>
                  )
                )}
              </ul>

            </div>

          </section>
        )}

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer>
        <p>
          Built with React + FastAPI + Open-Source AI
        </p>

        <p>
          StudyBuddy AI • Hacktoberfest 2026
        </p>
      </footer>

    </div>
  );
}

export default App;