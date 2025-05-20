import React, { useState } from "react";
import { supabase } from "./supabase";

function App() {
  const [resume, setResume] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [customLinks, setCustomLinks] = useState("");
  const [duration, setDuration] = useState("3");
  const [refreshInterval, setRefreshInterval] = useState("5");
  const [datePosted, setDatePosted] = useState("");

  const handlePlatformChange = (platform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = resume;
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, file);

    if (uploadError) return alert("❌ Failed to upload resume.");

    const fileUrl = `${supabase.storage.from("resumes").getPublicUrl(filePath).data.publicUrl}`;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([{ email, phone, password }])
      .select()
      .single();

    if (userError) return alert("❌ Failed to save user info.");

    const userId = userData.id;

    await supabase.from("resumes").insert([
      { user_id: userId, file_url: fileUrl, filename: file.name },
    ]);

    await supabase.from("tasks").insert([
      {
        user_id: userId,
        job_title: jobTitle,
        location,
        job_type: jobType,
        platforms,
        date_posted: datePosted,
        custom_links: customLinks,
        duration_days: parseInt(duration),
        refresh_interval_hours: parseInt(refreshInterval),
      },
    ]);

    alert("✅ Task saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="max-w-2xl mx-auto bg-white shadow p-6 rounded-xl space-y-6">
        <h1 className="text-2xl font-bold text-center">🎯 JobPilot.AI</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm mb-1">Upload Resume</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} className="w-full border p-2 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" />
          </div>

          <input type="password" placeholder="Bot Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" />

          <input type="text" placeholder="Job Title (e.g. Shopify Developer)" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full border p-2 rounded" />

          <input type="text" placeholder="Location (e.g. Remote, Canada)" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-2 rounded" />

          <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          <label className="block text-sm mt-4 mb-1">Select Job Platforms</label>
          <div className="grid grid-cols-2 gap-2">
            {["RemoteOK", "Remotive", "WeWorkRemotely", "AngelList", "LinkedIn", "Indeed", "StackOverflow Jobs", "Workable", "Jobspresso", "Jobgether"].map((platform) => (
              <label key={platform}><input type="checkbox" checked={platforms.includes(platform)} onChange={() => handlePlatformChange(platform)} className="mr-2" />{platform}</label>
            ))}
          </div>

          <label className="block text-sm mt-4 mb-1">Manual Links (comma-separated)</label>
          <textarea value={customLinks} onChange={(e) => setCustomLinks(e.target.value)} placeholder="https://example.com/job1, https://anotherjob.com/posting" className="w-full border p-2 rounded" rows={2}></textarea>

          <label className="block text-sm mt-4 mb-1">Date Posted Filter</label>
          <select value={datePosted} onChange={(e) => setDatePosted(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Any time</option>
            <option value="1">Last 24 hours</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last 7 days</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="border p-2 rounded">
              <option value="1">Duration: 1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
            </select>
            <select value={refreshInterval} onChange={(e) => setRefreshInterval(e.target.value)} className="border p-2 rounded">
              <option value="1">Refresh: Every 1 Hour</option>
              <option value="3">3 Hours</option>
              <option value="5">5 Hours</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">🚀 Start Auto Job Hunt</button>
        </form>
      </div>
    </div>
  );
}

export default App;
