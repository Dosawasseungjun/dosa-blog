import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Profile from './Profile';
import Navigation from './Navigation';
import SearchBar from './SearchBar';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Content + Sidebars */}
      <div className="flex flex-col flex-1 w-full max-w-6xl px-4 mx-auto mt-8 md:flex-row md:space-x-8">
        {/* 왼쪽 사이드 프로필 */}
        <div className="w-full mb-8 md:w-1/6 md:mb-0">
          <Profile />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="w-full px-0 md:w-2/3 md:px-6">
          <main className="w-full">
            <Outlet />
          </main>
        </div>

        {/* 오른쪽 사이드 - 네비게이션 */}
        <div className="w-full mt-8 md:w-1/6 md:mt-0">
          <Navigation />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
