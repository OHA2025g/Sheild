import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Homepage from "./components/Homepage";
import About from "./components/About";
import Programs from "./components/Programs";
import Impact from "./components/Impact";
import Blog from "./components/Blog";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import ToastTest from "./components/ToastTest";
import News from "./components/News";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminPanel />} />
          <Route path="/toast-test" element={<ToastTest />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
