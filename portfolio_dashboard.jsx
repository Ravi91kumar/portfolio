import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// ===== Portfolio Dashboard for GitHub Pages =====
// Update username & resume link if needed
const USERNAME = "Ravi91kumar";
const RESUME_URL = "https://github.com/Ravi91kumar/Ravi91kumar/raw/main/Resume.pdf"; // upload resume in repo

export default function PortfolioDashboard() {
  const [repos, setRepos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visits, setVisits] = useState(0);

  // ===== Visitor Counter =====
  useEffect(() => {
    const count = localStorage.getItem("visits");
    const newCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem("visits", newCount);
    setVisits(newCount);
  }, []);

  // ===== Load GitHub Repositories =====
  useEffect(() => {
    fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated`)
      .then((res) => res.json())
      .then((data) => {
        const cleaned = data.filter((r) => !r.fork);
        setRepos(cleaned);
        setFiltered(cleaned);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const result = repos.filter((repo) =>
      repo.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, repos]);

  const skills = [
    "Python",
    "JavaScript",
    "React",
    "Machine Learning",
    "PHP",
    "MySQL",
    "Data Structures",
    "Git & GitHub",
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-6"
      >
        <h1 className="text-3xl font-bold">Ravi Kumar — Portfolio</h1>
        <p className="text-gray-600 mt-2">
          Dynamic portfolio powered by GitHub projects.
        </p>
      </motion.div>

      {/* Resume & Visitor Section */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-4 mb-6">
        <a
          href={RESUME_URL}
          className="bg-black text-white px-5 py-2 rounded-xl"
          download
        >
          Download Resume
        </a>

        <div className="bg-white px-5 py-2 rounded-xl shadow">
          Visitors: {visits}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center bg-white rounded-2xl shadow p-3">
          <Search className="mr-2 text-gray-500" />
          <input
            className="w-full outline-none"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Skills Section */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-white px-4 py-2 rounded-xl shadow"
            >
              {skill}
            </span>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects">
        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((repo) => (
              <motion.div
                key={repo.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl shadow p-5 flex flex-col"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {repo.name}
                </h3>

                <p className="text-gray-600 flex-grow">
                  {repo.description || "No description provided."}
                </p>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {repo.language || "Code"}
                  </span>

                  <div className="flex gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      className="px-3 py-1 bg-black text-white rounded-xl"
                    >
                      Code
                    </a>

                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        className="px-3 py-1 bg-green-600 text-white rounded-xl"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      {/* Blog Section */}
      <Section title="Blog">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p>
            Blog section ready. You can publish articles using GitHub
            repositories or markdown files.
          </p>
        </div>
      </Section>

      {/* Contact Form */}
      <Section title="Contact Me">
        <form
          action="mailto:yourmail@example.com"
          method="post"
          encType="text/plain"
          className="bg-white p-6 rounded-2xl shadow grid gap-4"
        >
          <input
            className="border p-3 rounded-xl"
            placeholder="Your Name"
            required
          />
          <input
            className="border p-3 rounded-xl"
            placeholder="Email"
            required
          />
          <textarea
            className="border p-3 rounded-xl"
            placeholder="Message"
            rows={4}
            required
          />
          <button className="bg-black text-white py-2 rounded-xl">
            Send Message
          </button>
        </form>
      </Section>

      {/* Admin Panel Placeholder */}
      <Section title="Admin Panel">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p>
            Admin panel can be connected using Firebase / Node backend to
            manage blogs & projects.
          </p>
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center mt-10 text-gray-500">
        © {new Date().getFullYear()} Ravi Kumar | Portfolio Dashboard
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="max-w-6xl mx-auto mb-10">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
