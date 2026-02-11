
const username = "Ravi91kumar";
const projectDiv = document.getElementById("projects");
const blogDiv = document.getElementById("blogs");
const inboxDiv = document.getElementById("inbox");

/* Visitor Counter */
let visits = localStorage.getItem("visits");
visits = visits ? parseInt(visits)+1 : 1;
localStorage.setItem("visits", visits);
document.getElementById("visitorCount").innerText = visits;

/* Theme */
const themeBtn = document.getElementById("themeToggle");
if(localStorage.getItem("theme")==="dark") document.body.classList.add("dark");

themeBtn.onclick = () => {
 document.body.classList.toggle("dark");
 localStorage.setItem("theme",
   document.body.classList.contains("dark")?"dark":"light");
};

/* Projects */
fetch(`https://api.github.com/users/${username}/repos`)
.then(r=>r.json())
.then(data=>{
 projectDiv.innerHTML="";
 data.slice(0,6).forEach(repo=>{
  const div=document.createElement("div");
  div.className="project";
  div.innerHTML=`
   <b>${repo.name}</b>
   <p>${repo.description||""}</p>
   <a href="${repo.html_url}" target="_blank">Code</a>
  `;
  projectDiv.appendChild(div);
 });
});

/* Blog */
let blogs = JSON.parse(localStorage.getItem("blogs")||"[]");

function renderBlogs(){
 blogDiv.innerHTML="";
 blogs.forEach(b=>{
  const div=document.createElement("div");
  div.className="blog";
  div.innerHTML=`
   <h3>${b.title}</h3>
   ${b.image?`<img src="${b.image}" width="200">`:""}
   <p>${b.content}</p>
  `;
  blogDiv.appendChild(div);
 });
}
renderBlogs();

window.addBlog=function(){
 const title=document.getElementById("blogTitle").value;
 const content=document.getElementById("blogContent").value;
 const image=document.getElementById("blogImage").value;
 blogs.push({title,content,image});
 localStorage.setItem("blogs",JSON.stringify(blogs));
 renderBlogs();
};

/* Contact Messages */
let messages = JSON.parse(localStorage.getItem("messages")||"[]");

document.getElementById("contactForm").onsubmit=function(e){
 e.preventDefault();
 const data=new FormData(e.target);
 messages.push(Object.fromEntries(data.entries()));
 localStorage.setItem("messages",JSON.stringify(messages));
 alert("Message stored!");
 e.target.reset();
 renderInbox();
};

function renderInbox(){
 inboxDiv.innerHTML="";
 messages.forEach(m=>{
  const div=document.createElement("div");
  div.className="card";
  div.innerHTML=`
    <b>${m.name}</b><br>
    ${m.email}<br>
    <p>${m.message}</p>
  `;
  inboxDiv.appendChild(div);
 });
}
renderInbox();

/* Profile Image */
const profileImg=document.getElementById("profileImg");
const saved=localStorage.getItem("profileImg");
if(saved) profileImg.src=saved;

window.updateProfile=function(){
 const url=document.getElementById("profileUrl").value;
 profileImg.src=url;
 localStorage.setItem("profileImg",url);
};
