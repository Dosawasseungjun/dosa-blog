import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Search results:', data); // 디버깅용 로그
      
      // data가 배열이 아닌 경우 빈 배열로 처리
      const searchResults = Array.isArray(data) ? data : [];
      setResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">검색</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="검색어를 입력하세요..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? '검색 중...' : '검색'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 text-red-500 rounded bg-red-50">
          에러: {error}
        </div>
      )}

      {loading ? (
        <div className="p-4">검색 중...</div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <h2 className="mb-4 text-xl font-semibold">검색 결과</h2>
          <ul className="space-y-4">
            {results.map((result, index) => (
              <li key={index} className="p-4 border rounded hover:bg-gray-50">
                <Link 
                  to={`/posts/${formatPath(result.path)}`}
                  className="block"
                >
                  <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800">
                    {result.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{result.date}</p>
                  {result.excerpt && (
                    <p className="mt-2 text-gray-600">{result.excerpt}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : query && !loading && (
        <div className="p-4 text-gray-500">검색 결과가 없습니다.</div>
      )}
    </div>
  );
}

export default SearchPage; 