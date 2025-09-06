"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  parent_comment_id: string | null;
  user: {
    id: string;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
    clerk_user_id: string;
  } | null;
  replies?: Comment[];
}

interface CommentSectionProps {
  patchLogId: string;
}

// 댓글을 부모-자식 관계로 구조화하는 함수
const organizeComments = (comments: Comment[]): Comment[] => {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];

  // 모든 댓글을 맵에 저장하고 replies 배열 초기화
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 부모-자식 관계 설정
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parent_comment_id) {
      // 대댓글인 경우 부모 댓글의 replies에 추가
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.replies!.push(commentWithReplies);
      }
    } else {
      // 최상위 댓글인 경우 rootComments에 추가
      rootComments.push(commentWithReplies);
    }
  });

  // 대댓글을 생성일시순으로 정렬
  rootComments.forEach((comment) => {
    comment.replies!.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  });

  return rootComments;
};

// 전체 댓글 개수를 계산하는 함수 (최상위 댓글 + 대댓글)
const getTotalCommentCount = (organizedComments: Comment[]): number => {
  return organizedComments.reduce((total, comment) => {
    return total + 1 + (comment.replies?.length || 0);
  }, 0);
};

export default function CommentSection({ patchLogId }: CommentSectionProps) {
  const { user, isSignedIn } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [organizedComments, setOrganizedComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [patchLogId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?patch_log_id=${patchLogId}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.data);
        setOrganizedComments(organizeComments(data.data));
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !isSignedIn) {
      console.log("Comment submission blocked:", {
        hasContent: !!newComment.trim(),
        isSignedIn,
      });
      return;
    }

    setSubmitting(true);
    console.log("Submitting comment:", {
      patchLogId,
      content: newComment.trim(),
    });

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patch_log_id: patchLogId,
          content: newComment.trim(),
        }),
      });

      const data = await response.json();
      console.log("Comment response status:", response.status);
      console.log("Comment response data:", data);

      if (response.ok && data.success) {
        const updatedComments = [...comments, data.data];
        setComments(updatedComments);
        setOrganizedComments(organizeComments(updatedComments));
        setNewComment("");
        console.log("Comment added successfully");
      } else {
        console.error("Comment submission failed:");
        console.error("Response status:", response.status);
        console.error("Response data:", data);
        alert(
          `댓글 작성에 실패했습니다 (${response.status}): ${
            data.error || "알 수 없는 오류"
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();

    if (!replyContent.trim() || !isSignedIn) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patch_log_id: patchLogId,
          content: replyContent.trim(),
          parent_comment_id: parentId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedComments = [...comments, data.data];
        setComments(updatedComments);
        setOrganizedComments(organizeComments(updatedComments));
        setReplyContent("");
        setReplyingTo(null);
      } else {
        alert(
          `답글 작성에 실패했습니다 (${response.status}): ${
            data.error || "알 수 없는 오류"
          }`
        );
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("답글 작성 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 댓글 목록에서 수정된 댓글 업데이트
        const updatedComments = comments.map((comment) =>
          comment.id === commentId ? data.data : comment
        );
        setComments(updatedComments);
        setOrganizedComments(organizeComments(updatedComments));
        setEditingComment(null);
        setEditContent("");
      } else {
        alert(`댓글 수정에 실패했습니다: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      alert("댓글 수정 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 댓글 목록에서 삭제된 댓글 제거
        const updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
        setComments(updatedComments);
        setOrganizedComments(organizeComments(updatedComments));
      } else {
        alert(`댓글 삭제에 실패했습니다: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const isOwner = (comment: Comment): boolean => {
    return user?.id === comment.user?.clerk_user_id || false;
  };

  const getDisplayName = (comment: Comment) => {
    const { user: commentUser } = comment;
    if (!commentUser) return "익명";
    if (commentUser.username) return commentUser.username;
    if (commentUser.first_name && commentUser.last_name) {
      return `${commentUser.first_name} ${commentUser.last_name}`;
    }
    if (commentUser.first_name) return commentUser.first_name;
    return "익명";
  };

  const renderUserAvatar = (
    user: Comment["user"] | null,
    size: "small" | "medium" = "medium"
  ) => {
    const sizeClasses = size === "small" ? "w-6 h-6" : "w-8 h-8";
    const textSizeClasses = size === "small" ? "text-xs" : "text-sm";

    // user가 null인 경우 기본 아바타 반환
    if (!user) {
      const bgColorClass = size === "small" ? "bg-slate-100" : "bg-blue-100";
      const textColorClass = size === "small" ? "text-slate-600" : "text-blue-600";
      
      return (
        <div
          className={`${sizeClasses} ${bgColorClass} rounded-full flex items-center justify-center`}
        >
          <span className={`${textSizeClasses} font-medium ${textColorClass}`}>
            ?
          </span>
        </div>
      );
    }

    if (user.profile_image_url) {
      return (
        <img
          src={user.profile_image_url}
          alt={getDisplayName({ user } as Comment)}
          className={`${sizeClasses} rounded-full object-cover border-2 border-white`}
        />
      );
    }

    // 프로필 이미지가 없는 경우 기본 아바타
    const displayName = getDisplayName({ user } as Comment);
    const bgColorClass = size === "small" ? "bg-slate-100" : "bg-blue-100";
    const textColorClass =
      size === "small" ? "text-slate-600" : "text-blue-600";

    return (
      <div
        className={`${sizeClasses} ${bgColorClass} rounded-full flex items-center justify-center`}
      >
        <span className={`${textSizeClasses} font-medium ${textColorClass}`}>
          {displayName.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  };

  const renderContentWithMentions = (content: string) => {
    const mentionRegex = /@(\S+)/g;
    const parts = content.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // 멘션 부분
        return (
          <span key={index} className="text-blue-600 font-medium">
            @{part}
          </span>
        );
      }
      // 일반 텍스트 부분 - 줄바꿈 처리
      return part.split('\n').map((line, lineIndex, lines) => (
        <span key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      ));
    });
  };

  if (loading) {
    return (
      <div>
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        커뮤니티 ({getTotalCommentCount(organizedComments)})
      </h3>

      {/* 댓글 작성 폼 */}
      {isSignedIn ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="패치에 대한 의견을 남겨보세요."
              className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-3 py-1.5 bg-slate-600 text-white rounded text-sm hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "작성 중..." : "작성하기"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 bg-slate-50 rounded-lg mb-8">
          <p className="text-slate-600 mb-3">
            로그인하고 커뮤니티에 참여해보세요!
          </p>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              로그인하기
            </button>
          </SignInButton>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {organizedComments.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </div>
        ) : (
          organizedComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* 최상위 댓글 */}
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  {renderUserAvatar(comment.user, "medium")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">
                        {getDisplayName(comment)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {format(
                          new Date(comment.created_at),
                          "yyyy년 MM월 dd일 HH:mm",
                          {
                            locale: ko,
                          }
                        )}
                      </span>
                    </div>
                    {/* 댓글 내용 또는 수정 폼 */}
                    {editingComment === comment.id ? (
                      <div className="mb-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 text-sm border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300"
                          rows={3}
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent("");
                            }}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            disabled={!editContent.trim() || submitting}
                            className="px-3 py-1.5 bg-slate-600 text-white rounded text-xs hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? "수정 중..." : "수정하기"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed mb-2">
                        {renderContentWithMentions(comment.content)}
                      </p>
                    )}

                    {/* 액션 버튼들 */}
                    <div className="flex items-center space-x-3 text-xs">
                      {isSignedIn && !editingComment && (
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment.id ? null : comment.id
                            )
                          }
                          className="text-slate-500 hover:text-slate-700 font-medium"
                        >
                          답글
                        </button>
                      )}

                      {isOwner(comment) && !editingComment && (
                        <>
                          <button
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditContent(comment.content);
                            }}
                            className="text-slate-500 hover:text-slate-700 font-medium"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 font-medium"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 답글 작성 폼 */}
                  {replyingTo === comment.id && isSignedIn && (
                    <form
                      onSubmit={(e) => handleSubmitReply(e, comment.id)}
                      className="mt-3 ml-4"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0">
                          {user?.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt={user.firstName || user.username || "User"}
                              className="w-6 h-6 rounded-full object-cover border-2 border-white"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {user?.firstName?.charAt(0) ||
                                  user?.username?.charAt(0) ||
                                  "U"}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`@${getDisplayName(comment)} `}
                            className="w-full p-2 text-sm border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300"
                            rows={2}
                            onFocus={(e) => {
                              if (!replyContent) {
                                setReplyContent(`@${getDisplayName(comment)} `);
                              }
                            }}
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent("");
                              }}
                              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              disabled={!replyContent.trim() || submitting}
                              className="px-3 py-1.5 bg-slate-600 text-white rounded text-xs hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? "작성 중..." : "작성하기"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* 대댓글 목록 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 ml-4 relative">
                      {/* 연결선 */}
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                      <div className="space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="relative">
                            {/* 가로 연결선 */}
                            <div className="absolute left-3 top-3 w-4 h-0.5 bg-slate-200"></div>
                            <div className="flex space-x-3 relative z-10">
                              <div className="flex-shrink-0">
                                {renderUserAvatar(reply.user, "small")}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="bg-slate-50 rounded-lg p-2">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-xs font-medium text-slate-900">
                                      {getDisplayName(reply)}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {format(
                                        new Date(reply.created_at),
                                        "MM월 dd일 HH:mm",
                                        {
                                          locale: ko,
                                        }
                                      )}
                                    </span>
                                  </div>

                                  {/* 대댓글 내용 또는 수정 폼 */}
                                  {editingComment === reply.id ? (
                                    <div className="mb-1">
                                      <textarea
                                        value={editContent}
                                        onChange={(e) =>
                                          setEditContent(e.target.value)
                                        }
                                        className="w-full p-2 text-xs border border-slate-300 rounded resize-none focus:outline-none focus:ring-1 focus:ring-slate-300 focus:border-slate-300"
                                        rows={2}
                                      />
                                      <div className="mt-1 flex justify-end space-x-1">
                                        <button
                                          onClick={() => {
                                            setEditingComment(null);
                                            setEditContent("");
                                          }}
                                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                                        >
                                          취소
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleEditComment(reply.id)
                                          }
                                          disabled={
                                            !editContent.trim() || submitting
                                          }
                                          className="px-3 py-1.5 bg-slate-600 text-white rounded text-xs hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {submitting ? "수정 중..." : "수정하기"}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-xs text-slate-700 leading-relaxed mb-1">
                                        {renderContentWithMentions(
                                          reply.content
                                        )}
                                      </p>

                                      {/* 대댓글 액션 버튼들 */}
                                      {isOwner(reply) && !editingComment && (
                                        <div className="flex items-center space-x-2 text-xs">
                                          <button
                                            onClick={() => {
                                              setEditingComment(reply.id);
                                              setEditContent(reply.content);
                                            }}
                                            className="text-slate-400 hover:text-slate-600"
                                          >
                                            수정
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteComment(reply.id)
                                            }
                                            className="text-red-400 hover:text-red-600"
                                          >
                                            삭제
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
