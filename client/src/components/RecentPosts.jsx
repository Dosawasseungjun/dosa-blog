import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function RecentPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    // console.log('Fetching posts...');
    fetch('/api/recent-posts')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        // console.log('API Response:', data); // 디버깅용 로그
        // data가 배열이 아닌 경우 처리
        const postsArray = Array.isArray(data) ? data : [];
        // console.log('Total posts:', postsArray.length); // 전체 포스트 수 로그
        setPosts(postsArray);
        const calculatedTotalPages = Math.ceil(postsArray.length / postsPerPage);
        // console.log('Total pages:', calculatedTotalPages); // 전체 페이지 수 로그
        setTotalPages(calculatedTotalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading recent posts:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatPath = (path) => {
    if (!path) return '';
    
    // .md 확장자 제거
    path = path.replace(/\.md$/, '');
    
    // 전체 경로에서 posts 디렉토리 이후의 경로만 추출
    const postsIndex = path.indexOf('/posts/');
    if (postsIndex !== -1) {
      path = path.substring(postsIndex + 7); // '/posts/' 이후의 경로
    }
    
    // URL 인코딩 처리
    const encodedPath = path.split('/').map(segment => 
      encodeURIComponent(segment.trim())
    ).join('/');
    
    return encodedPath;
  };

  // 현재 페이지에 표시할 포스트 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  // console.log('Current page:', currentPage); // 현재 페이지 로그
  // console.log('Showing posts from', indexOfFirstPost, 'to', indexOfLastPost); // 표시할 포스트 범위 로그
  // console.log('Current posts:', currentPosts.length); // 현재 표시할 포스트 수 로그

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    // console.log('Changing to page:', pageNumber); // 페이지 변경 로그
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
  };

  // 페이지네이션 버튼 생성
  const renderPagination = () => {
    // console.log('Rendering pagination for', totalPages, 'pages'); // 페이지네이션 렌더링 로그
    
    if (totalPages <= 1) return null; // 페이지가 1개 이하면 페이지네이션 표시하지 않음
    
    const pageNumbers = [];
    const maxPagesToShow = 5; // 한 번에 보여줄 페이지 번호 수
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // 시작 페이지 조정
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          이전
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded ${
              currentPage === number
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          다음
        </button>
      </div>
    );
  };

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">에러: {error}</div>;
  if (!posts || posts.length === 0) return <div className="p-4">포스트가 없습니다.</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-xl font-bold">포스트 목록 ({posts.length}개)</h2>
      <ul className="space-y-4">
        {currentPosts.map((post, index) => {
          if (!post || !post.path) return null;
          return (
            <li key={index} className="pb-4 border-b last:border-b-0 last:pb-0">
              <Link 
                to={`/posts/${formatPath(post.path)}`}
                className="block p-2 rounded hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900 hover:text-blue-600">{post.title}</h3>
                <p className="text-sm text-gray-500">{post.date}</p>
              </Link>
            </li>
          );
        })}
      </ul>
      
      {renderPagination()}
    </div>
  );
}

export default RecentPosts; 