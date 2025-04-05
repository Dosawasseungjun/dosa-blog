import React, { useEffect, useState } from 'react';

function Navigation() {
  const [hasComments, setHasComments] = useState(false);
  const [isPostPage, setIsPostPage] = useState(false);

  useEffect(() => {
    // 현재 페이지가 포스트 페이지인지 확인
    const isPost = window.location.pathname.includes('/post/');
    setIsPostPage(isPost);

    // 댓글 섹션이 있는지 확인
    const checkForComments = () => {
      const commentsSection = document.getElementById('comments');
      setHasComments(!!commentsSection);
    };

    // 초기 확인
    checkForComments();

    // DOM 변경 감지를 위한 MutationObserver 설정
    const observer = new MutationObserver(checkForComments);
    observer.observe(document.body, { childList: true, subtree: true });

    // 클린업 함수
    return () => {
      observer.disconnect();
    };
  }, []);

  // 댓글 링크 클릭 핸들러
  const handleCommentsClick = (e) => {
    e.preventDefault();
    
    if (isPostPage && hasComments) {
      // 포스트 페이지이고 댓글 섹션이 있으면 댓글 섹션으로 이동
      const commentsSection = document.getElementById('comments');
      if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // 댓글이 없거나 포스트 페이지가 아니면 맨 아래로 이동
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // 맨 위로 이동 핸들러
  const handleTopClick = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 푸터로 이동 핸들러
  const handleFooterClick = (e) => {
    e.preventDefault();
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    } else {
      // 푸터가 없으면 맨 아래로 이동
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-28">
      <div className="flex flex-col text-sm text-gray-600">
        <a 
          href="#top" 
          className="mb-2 text-blue-600" 
          onClick={handleTopClick}
        >
          🔝 맨 위로
        </a>
        <a 
          href="#comments" 
          className="mb-2" 
          onClick={handleCommentsClick}
        >
          💬 댓글
        </a>
        <a 
          href="#footer" 
          onClick={handleFooterClick}
        >
          🔚 푸터로 이동
        </a>
      </div>
    </div>
  );
}

export default Navigation;