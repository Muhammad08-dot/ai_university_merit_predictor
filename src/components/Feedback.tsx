"use client";

import { useState, useEffect } from "react";

interface FeedbackItem {
  id: string;
  rating: number;
  feedbackText: string;
  createdAt: string;
}

export default function Feedback() {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [pastFeedbacks, setPastFeedbacks] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    fetch("/api/feedback")
      .then(res => res.json())
      .then(data => {
        if (data.feedbacks) {
          setPastFeedbacks(data.feedbacks);
        }
      })
      .catch(console.error);
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    
    try {
      await fetch("/api/feedback", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback }) 
      });
    } catch (err) {
      console.error(err);
    }
    
    console.log("Feedback submitted:", { rating, feedback });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 sm:p-12 text-center border border-green-100 shadow-sm">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl mb-4">
            🎉
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-green-900 mb-2">
            Thank You For Your Feedback!
          </h2>
          <p className="text-green-700 font-medium">
            Your review helps us make UniMatch better for thousands of students across Pakistan.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16" id="feedback">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg shadow-slate-100/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Rate Your Experience
          </h2>
          <p className="text-slate-500">
            How likely are you to recommend UniMatch to a friend? (10 = Extremely Likely)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {/* 1 to 10 Rating Scale */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                onMouseEnter={() => setHoveredRating(num)}
                onMouseLeave={() => setHoveredRating(null)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-sm sm:text-base font-bold transition-all duration-200 flex items-center justify-center ${
                  rating === num
                    ? "bg-green-600 text-white shadow-lg shadow-green-200 scale-110"
                    : hoveredRating !== null && num <= hoveredRating
                    ? "bg-green-100 text-green-800"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-400 mb-8 px-2">
            <span>1 - Not Likely</span>
            <span>10 - Very Likely</span>
          </div>

          {rating && (
            <div className="animate-fade-in space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Any suggestions or thoughts? (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you liked or what we can improve..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-400 outline-none transition min-h-[120px] resize-y text-slate-700 bg-slate-50 focus:bg-white"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full py-4 gradient-green-btn text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:opacity-90 transition-all text-lg"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </form>

        {/* Display Past Feedbacks */}
        {pastFeedbacks.length > 0 && (
          <div className="mt-16 border-t border-slate-100 pt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Recent Reviews</h3>
            <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {pastFeedbacks.slice(0, 6).map((item) => (
                <div key={item.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                        {item.rating}
                      </div>
                      <div className="flex text-yellow-400 text-sm">
                        {"★".repeat(Math.ceil(item.rating / 2)) + "☆".repeat(5 - Math.ceil(item.rating / 2))}
                      </div>
                    </div>
                    {item.feedbackText ? (
                      <p className="text-slate-600 text-sm italic">&ldquo;{item.feedbackText}&rdquo;</p>
                    ) : (
                      <p className="text-slate-400 text-sm italic">No comment provided.</p>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-4 text-right">
                    {new Date(item.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
