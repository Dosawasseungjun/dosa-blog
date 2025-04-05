import React, { useState, useEffect } from 'react';
import '../styles/comments.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
console.log('API_URL:', API_URL); // 디버깅용 로그

const Comment = ({ comment, onReply, onDelete }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyPassword, setReplyPassword] = useState('');

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyAuthor.trim() || !replyPassword.trim()) {
      alert('이름, 비밀번호, 내용을 모두 입력해주세요.');
      return;
    }
    onReply(comment.id, replyAuthor, replyContent, replyPassword);
    setReplyContent('');
    setReplyAuthor('');
    setReplyPassword('');
    setShowReplyForm(false);
  };

  const isReply = comment.parentId !== null;

  return (
    <div className={`comment ${isReply ? 'reply' : ''}`}>
      <div className="comment-header">
        <div className="comment-info">
          <span className="comment-author">{comment.author}</span>
          {isReply && (
            <span className="reply-to">
              → {comment.parentAuthor}님에게 답글
            </span>
          )}
        </div>
        <span className="comment-date">
          {new Date(comment.date).toLocaleString()}
        </span>
        <div className="comment-actions">
          <button 
            className="reply-button"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            답글
          </button>
          <button 
            className="delete-button"
            onClick={() => onDelete(comment.id)}
          >
            삭제
          </button>
        </div>
      </div>
      <div className="comment-content">{comment.content}</div>
      
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <div className="form-group">
            <input
              type="text"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              placeholder="이름"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={replyPassword}
              onChange={(e) => setReplyPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`${comment.author}님에게 답글 작성`}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">답글 작성</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setShowReplyForm(false)}
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const Comments = ({ postPath }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState(() => {
    return localStorage.getItem('commentAuthor') || '';
  });
  const [password, setPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postPath]);

  useEffect(() => {
    if (author) {
      localStorage.setItem('commentAuthor', author);
    }
  }, [author]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/comments/${postPath}`);
      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setComments(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !author.trim() || !password.trim()) {
      alert('이름, 비밀번호, 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postPath,
          author,
          content: newComment,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.');
      }

      const data = await response.json();
      setComments([...comments, data]);
      setNewComment('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReply = async (parentId, replyAuthor, replyContent, replyPassword) => {
    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postPath,
          author: replyAuthor,
          content: replyContent,
          password: replyPassword,
          parentId: parentId.toString(),
        }),
      });

      if (!response.ok) {
        throw new Error('답글 작성에 실패했습니다.');
      }

      const data = await response.json();
      setComments([...comments, data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/comments/${commentToDelete}?password=${encodeURIComponent(deletePassword)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 403) {
          setDeleteError('비밀번호가 일치하지 않습니다.');
          return;
        }
        throw new Error('댓글 삭제에 실패했습니다.');
      }

      setComments(comments.filter(comment => comment.id !== commentToDelete));
      setCommentToDelete(null);
      setDeletePassword('');
      setDeleteError(null);
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  const handleDeleteCancel = () => {
    setCommentToDelete(null);
    setDeletePassword('');
    setDeleteError(null);
  };

  if (isLoading) return <div className="comments-loading">댓글을 불러오는 중...</div>;
  if (error) return <div className="comments-error">오류: {error}</div>;

  return (
    <div className="comments-section">
      <h3>댓글</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="이름"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
        </div>
        <div className="form-group">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
          />
        </div>
        <button type="submit" className="submit-button">댓글 작성</button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">아직 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <Comment 
              key={comment.id} 
              comment={comment} 
              onReply={handleReply}
              onDelete={handleDeleteClick}
            />
          ))
        )}
      </div>

      {commentToDelete && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h4>댓글 삭제</h4>
            <p>댓글을 삭제하려면 비밀번호를 입력하세요.</p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="비밀번호"
            />
            {deleteError && <p className="delete-error">{deleteError}</p>}
            <div className="delete-modal-buttons">
              <button onClick={handleDeleteConfirm} className="delete-confirm-button">삭제</button>
              <button onClick={handleDeleteCancel} className="delete-cancel-button">취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments; 