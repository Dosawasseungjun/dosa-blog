import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Categories from '../components/Categories';
import About from '../pages/About';
import SearchPage from '../pages/SearchPage';
import RecentPosts from '../components/RecentPosts';
import PostPage from '../pages/PostPage';
import NotFound from '../pages/NotFound';
function AppRouter() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/posts" element={<RecentPosts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/posts/*" element={<PostPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
  );
}

export default AppRouter;