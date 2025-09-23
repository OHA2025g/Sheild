// components/NewsDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { api } from "../api";
import Header from "./Header";
import Footer from "./Footer";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.getNewsById(id);
        setNews(response);
      } catch (error) {
        console.error("Error loading news:", error);
      }
    };
    fetchNews();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading news...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          to="/news"
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>

        <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(news.date)}
          </span>
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {news.author}
          </span>
        </div>

        <div className="prose max-w-none whitespace-pre-line text-gray-800 leading-relaxed">
          {news.content}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NewsDetail;
