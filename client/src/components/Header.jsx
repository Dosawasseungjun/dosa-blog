// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full p-4 bg-white shadow">
      <div className="flex flex-row items-center justify-between max-w-6xl mx-auto">
        {/* 왼쪽: 블로그 이름 */}
        <h1 className="text-xl font-bold">
          <Link to="/" className="text-gray-900 hover:text-gray-700">도사였다의 기록</Link>
        </h1>

        {/* 오른쪽: 네비게이션 + 검색바 */}
        <div className="flex items-center space-x-8">
          <Link to="/posts" className="text-gray-600 hover:text-gray-900">최근 글 보기</Link>
          <Link to="/categories" className="text-gray-600 hover:text-gray-900">주제별로 보기</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">나에 대해서</Link>
          <div className="w-64">
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;