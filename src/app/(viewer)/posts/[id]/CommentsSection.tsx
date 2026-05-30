"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Send, User, Trash2, UserX } from 'lucide-react';

export default function CommentsSection({ postId }: { postId: string }) {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (e) {
      console.error("Failed to fetch comments:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('user_id', user.id);
      formData.append('user_name', user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      formData.append('user_image', user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'U')}&background=random`);
      formData.append('content', newComment);

      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (e) {
      console.error("Failed to post comment:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!user || !confirm("정말 이 댓글을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments/${commentId}?user_id=${user.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchComments();
      } else {
        alert("삭제 권한이 없거나 오류가 발생했습니다.");
      }
    } catch (e) {
      console.error("Failed to delete comment:", e);
    }
  };

  const handleWithdrawal = async () => {
    if (!user?.id) return;
    
    const confirmed = confirm("회원 탈퇴를 진행하시겠습니까?\n작성하신 모든 댓글과 좋아요 내역이 영구 삭제됩니다.");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.");
        signOut();
      } else {
        alert("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } catch (e) {
      console.error("Withdrawal failed:", e);
      alert("서버 통신 오류가 발생했습니다.");
    }
  };

  const isAdmin = user?.email === "nemonecoltd@gmail.com";

  return (
    <div id="comments-section" className="max-w-3xl mx-auto py-20 border-t border-white/5 relative z-50">
      <h3 className="text-2xl font-black italic tracking-tighter mb-10 text-[#D4AF37]">COMMENTS</h3>

      {/* 댓글 입력창 */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-16">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white/10 border border-white/10">
              <img 
                src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'U')}&background=random`} 
                alt={user.user_metadata?.full_name || ""} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-grow space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="의견을 남겨보세요..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 transition-colors resize-none min-h-[100px]"
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleWithdrawal}
                  className="text-[10px] text-white/20 hover:text-white/40 transition-colors flex items-center gap-1.5 font-bold tracking-tighter uppercase"
                >
                  <UserX size={12} />
                  회원탈퇴하기
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isLoading}
                  className="px-6 py-2 bg-[#D4AF37] text-black font-black italic tracking-tighter rounded-full flex items-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                >
                  <Send size={16} />
                  POST
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-16 p-8 rounded-3xl bg-white/5 border border-dashed border-white/10 text-center">
          <p className="text-white/60 mb-6 italic">의견을 남기려면 로그인이 필요합니다.</p>
          <button
            onClick={() => signInWithGoogle()}
            className="px-8 py-3 bg-white text-black font-black italic tracking-tighter rounded-full hover:bg-[#D4AF37] transition-all"
          >
            SIGN IN WITH GOOGLE
          </button>
        </div>
      )}

      {/* 댓글 리스트 */}
      <div className="space-y-10">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white/5 border border-white/5">
                <img 
                  src={comment.user_image || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_name || 'U')}&background=random`} 
                  alt={comment.user_name} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white/80">{comment.user_name}</span>
                    {(isAdmin || user?.id === comment.user_id) && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-white/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">
                    {new Date(comment.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light not-italic">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-white/20 italic font-light tracking-widest">
            NO COMMENTS YET.
          </div>
        )}
      </div>
    </div>
  );
}
