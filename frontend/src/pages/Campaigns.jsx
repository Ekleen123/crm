import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // form states
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [spend, setSpend] = useState("");
  const [visits, setVisits] = useState("");
  const [inactiveDays, setInactiveDays] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // AI suggestion states
  const [objective, setObjective] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // AI summaries
  const [summaries, setSummaries] = useState({});

  // fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await apiFetch("https://crm-backend-e8xq.onrender.com/api/campaigns");
        setCampaigns(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // build audience filter from form inputs
  const buildAudienceFilter = () => {
    const filter = {};
    if (spend) filter.spend = { $gt: Number(spend) };
    if (visits) filter.visits = { $lt: Number(visits) };
    if (inactiveDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number(inactiveDays));
      filter.last_active = { $lt: cutoff };
    }
    return filter;
  };

  // handle new campaign submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const newCampaign = await apiFetch("https://crm-backend-e8xq.onrender.com/api/campaigns", {
        method: "POST",
        body: JSON.stringify({
          name,
          message,
          audienceFilter: buildAudienceFilter(),
        }),
      });

      alert("Campaign created successfully!");
      setCampaigns((prev) => [
        {
          id: newCampaign.campaignId,
          name,
          message,
          audienceSize: newCampaign.audienceSize,
          sent: 0,
          failed: 0,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      // reset form
      setName("");
      setMessage("");
      setSpend("");
      setVisits("");
      setInactiveDays("");
      setObjective("");
      setSuggestions([]);
      setShowForm(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // fetch AI message suggestions
  const handleGenerateAI = async () => {
    if (!objective.trim()) {
      alert("Please enter a campaign objective first!");
      return;
    }
    setLoadingAI(true);
    try {
      const res = await apiFetch("https://crm-backend-e8xq.onrender.com/ai/suggest-messages", {
        method: "POST",
        body: JSON.stringify({ objective }),
      });
      setSuggestions(res.suggestions || []);
    } catch (err) {
      alert("AI Error: " + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  // fetch AI campaign summary
  const handleSummarize = async (campaign) => {
    try {
      const res = await fetch("https://crm-backend-e8xq.onrender.com/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      const data = await res.json();
      setSummaries((prev) => ({ ...prev, [campaign.id]: data.summary }));
    } catch (err) {
      alert("AI Error: " + err.message);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Campaigns
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, manage, and track your marketing campaigns
          </p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "+ New Campaign"}
        </button>
      </div>

      {/* New Campaign Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Campaign</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Campaign Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              required
            />
            <textarea
              placeholder="Message (e.g. Hi! get 10% off!)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              rows={3}
              required
            />

            {/* AI Suggestions */}
            <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
              <h3 className="text-md font-semibold mb-2 dark:text-white">
                AI Message Suggestions
              </h3>
              <input
                type="text"
                placeholder="Objective (e.g. Bring back inactive users)"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:text-white mb-2"
              />
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={loadingAI}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingAI ? "Generating..." : "Generate Suggestions"}
              </button>

              {suggestions.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {suggestions.map((s, idx) => (
                    <li
                      key={idx}
                      className="p-2 border rounded-lg cursor-pointer bg-white dark:bg-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-500"
                      onClick={() => setMessage(s)}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Audience Filter Fields */}
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Spend greater than (₹)"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                placeholder="Visits less than"
                value={visits}
                onChange={(e) => setVisits(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="number"
                placeholder="Inactive for (days)"
                value={inactiveDays}
                onChange={(e) => setInactiveDays(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Launch Campaign"}
            </button>
          </form>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading campaigns...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : campaigns.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No campaigns yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Audience Size</th>
                <th className="px-4 py-2">Sent</th>
                <th className="px-4 py-2">Failed</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">AI Summary</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.id || c._id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.name}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-200">{c.audienceSize}</td>
                  <td className="px-4 py-2 text-green-600 dark:text-green-400">{c.sent}</td>
                  <td className="px-4 py-2 text-red-500 dark:text-red-400">{c.failed}</td>
                  <td className="px-4 py-2 text-gray-700 dark:text-gray-200">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {summaries[c.id] ? (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {summaries[c.id]}
                      </p>
                    ) : (
                      <button
                        onClick={() => handleSummarize(c)}
                        className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                      >
                        Summarize
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
