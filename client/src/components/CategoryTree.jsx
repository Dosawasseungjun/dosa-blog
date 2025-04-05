import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CategoryTree({ items, level = 0 }) {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (path) => {
    setOpenFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // 모든 폴더를 닫고 초기 상태로 되돌리는 함수
  const resetFolders = () => {
    setOpenFolders({});
  };

  const formatPath = (path) => {
    // 전체 경로에서 posts 디렉토리 이후의 경로만 추출
    const postsIndex = path.indexOf('/posts/');
    if (postsIndex !== -1) {
      path = path.substring(postsIndex + 7); // '/posts/' 이후의 경로
    }
    
    // .md 확장자 제거
    path = path.replace(/\.md$/, '');
    
    // URL 인코딩 처리
    const encodedPath = path.split('/').map(segment => 
      encodeURIComponent(segment.trim())
    ).join('/');
    
    return encodedPath;
  };

  return (
    <div>
      {level === 0 && (
        <div className="mb-4">
          <button
            onClick={resetFolders}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            모든 폴더 닫기
          </button>
        </div>
      )}
      <ul className={`space-y-2 ${level > 0 ? 'ml-6' : ''}`}>
        {items.map((item) => (
          <li key={item.path} className="overflow-hidden transition-shadow border rounded-lg shadow-sm hover:shadow-md">
            {item.type === 'directory' ? (
              <div>
                <button
                  onClick={() => toggleFolder(item.path)}
                  className="flex items-center w-full p-3 transition-colors bg-gray-50 hover:bg-gray-100"
                >
                  <span className="mr-3 text-2xl">
                    {openFolders[item.path] ? '📂' : '📁'}
                  </span>
                  <span className="text-lg font-medium text-gray-800">{item.name}</span>
                </button>
                {openFolders[item.path] && item.children && (
                  <div className="p-2 bg-white">
                    <CategoryTree items={item.children} level={level + 1} />
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={`/posts/${formatPath(item.path)}`}
                className="flex items-center p-3 transition-colors bg-white hover:bg-gray-50"
              >
                <span className="mr-3 text-xl">📄</span>
                <span className="text-lg text-gray-700">{item.name}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryTree; 