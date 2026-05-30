"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, MessageSquare, Send } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PostActions() {
  const { id } = useParams();
  const { user, signInWithGoogle } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLikeStatus();
    }
  }, [id, user]);

  const fetchLikeStatus = async () => {
    try {
      const userParam = user?.id ? `?user_id=${encodeURIComponent(user.id)}` : "";
      const res = await fetch(`/api/posts/${id}/likes/status${userParam}`);
      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.total);
        setLiked(data.user_liked);
      }
    } catch (e) {
      console.error("Failed to fetch like status:", e);
    }
  };

  const handleLike = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);
    // 낙관적 업데이트
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const formData = new FormData();
      formData.append('user_id', user.id);

      const res = await fetch(`/api/posts/${id}/likes/toggle`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error();
      }
    } catch (e) {
      // 실패 시 복구
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '네모네AIM Archive',
        url: window.location.href,
      });
    } else {
      alert("링크가 복사되었습니다.");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById('comments-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex justify-between items-center py-10 border-t border-white/10 mt-20 relative z-50">
      <div className="flex gap-8 items-center">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 transition-all group ${liked ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
        >
          <Heart className={`w-6 h-6 transition-all ${liked ? 'fill-[#D4AF37] scale-110' : 'group-hover:fill-[#D4AF37]'}`} />
          <div className="flex flex-col items-start leading-none">
            <span className="text-xs not-italic uppercase font-bold tracking-tighter mb-0.5">Like</span>
            <span className="text-[10px] opacity-40 font-black italic">{likeCount}</span>
          </div>
        </button>
      </div>
      {/* 대표님이 찾으시던 퍼가기 버튼 복구 */}
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
      >
        <Send className="w-6 h-6" />
        <span className="text-sm not-italic uppercase font-bold tracking-tighter">Share</span>
      </button>
    </div>
  );
}