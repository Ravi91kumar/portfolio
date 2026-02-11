
import React, { useEffect, useMemo, useState } from "react";
import { Search, Sun, Moon, Github, Mail, BarChart3 } from "lucide-react";

const USERNAME = "Ravi91kumar";
const RESUME_URL = "https://github.com/Ravi91kumar/Ravi91kumar/raw/main/Resume.pdf";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export default function PortfolioDashboard() {
  const [repos, setRepos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [visits, setVisits] = useState(0);
  useEffect(() => {
    const count = localStorage.getItem("visits");
    const newCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem("visits", newCount);
    setVisits(newCount);
  }, []);

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

  const skills = useMemo(
    () => ["Python","React","Machine Learning","PHP","MySQL","GitHub"],
    []
  );

  const [adminLogged, setAdminLogged] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const login = (e) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) setAdminLogged(true);
    else alert("Invalid login");
  };

  const [blogs, setBlogs] = useState(
    JSON.parse(localStorage.getItem("blogs") || "[]")
  );
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState("");

  const addBlog = () => {
    if (!blogTitle) return;
    const newBlogs = [
      ...blogs,
      { title: blogTitle, content: blogContent, image: blogImage },
    ];
    setBlogs(newBlogs);
    localStorage.setItem("blogs", JSON.stringify(newBlogs));
    setBlogTitle("");
    setBlogContent("");
    setBlogImage("");
  };

  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages") || "[]")
  );

  const saveMessage = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const msg = Object.fromEntries(data.entries());
    const newMsgs = [...messages, msg];
    setMessages(newMsgs);
    localStorage.setItem("messages", JSON.stringify(newMsgs));
    e.target.reset();
    alert("Message stored");
  };

  const analytics = {
    totalProjects: repos.length,
    totalBlogs: blogs.length,
    totalMessages: messages.length,
    visits,
  };

  const aiSummary = `Software developer working with ${skills
    .slice(0, 3)
    .join(", ")} and building dynamic web & ML projects.`;

  return (
    <div className="min-h-screen p-6">
      <h1>Ravi Kumar — Portfolio</h1>

      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <Sun /> : <Moon />} Theme
      </button>

      <div>
        <a href={RESUME_URL} download>Download Resume</a>
        <p>Visits: {visits}</p>
      </div>

      <h2>AI Summary</h2>
      <p>{aiSummary}</p>

      <Search />
      <input
        placeholder="Search project..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Projects</h2>
      {loading
        ? "Loading..."
        : filtered.map((r) => (
            <div key={r.id}>
              <b>{r.name}</b>
              <p>{r.description}</p>
              <a href={r.html_url} target="_blank">Code</a>
            </div>
          ))}

      <h2>Blog</h2>
      {blogs.map((b, i) => (
        <div key={i}>
          <h3>{b.title}</h3>
          {b.image && <img src={b.image} width="200" />}
          <p>{b.content}</p>
        </div>
      ))}

      <h2>Contact</h2>
      <form onSubmit={saveMessage}>
        <input name="name" placeholder="Name" required /><br />
        <input name="email" placeholder="Email" required /><br />
        <textarea name="message" placeholder="Message" required /><br />
        <button>Send</button>
      </form>

      <h2>Admin Panel</h2>
      {!adminLogged ? (
        <form onSubmit={login}>
          <input placeholder="Username" onChange={(e) => setUser(e.target.value)} /><br />
          <input type="password" placeholder="Password" onChange={(e) => setPass(e.target.value)} /><br />
          <button>Login</button>
        </form>
      ) : (
        <div>
          <input placeholder="Title" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} /><br />
          <textarea placeholder="Content" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} /><br />
          <input placeholder="Image URL" value={blogImage} onChange={(e) => setBlogImage(e.target.value)} /><br />
          <button onClick={addBlog}>Publish Blog</button>
        </div>
      )}

      <h2>Analytics</h2>
      <p>Projects: {analytics.totalProjects}</p>
      <p>Blogs: {analytics.totalBlogs}</p>
      <p>Messages: {analytics.totalMessages}</p>
      <p>Visits: {analytics.visits}</p>
    </div>
  );
}
