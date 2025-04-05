import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, useLocation } from 'react-router-dom';
import Comments from '../components/Comments';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import '../styles/markdown.css';
import '../styles/post-page.css';

function PostPage() {
  const location = useLocation();
  const [post, setPost] = useState({ content: '', date: '', title: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // location.pathname에서 /posts/ 이후의 경로를 추출
    const path = location.pathname.substring('/posts/'.length);
    console.log('Fetching post with path:', path); // 디버깅용 로그

    fetch(`/api/posts/${path}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Received post data:', data); // 디버깅용 로그
        const contentWithImagePaths = data.content.replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          (match, alt, src) => {
            const imageName = src.split('/').pop();
            return `![${alt}](/api/images/${imageName})`;
          }
        );
        setPost({ ...data, content: contentWithImagePaths });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading post:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [location.pathname]);

  if (loading) return <div className="post-loading">포스트를 불러오는 중...</div>;
  if (error) return <div className="post-error">{error}</div>;
  if (!post.content) return <div className="post-not-found">포스트를 찾을 수 없습니다.</div>;

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      {post.date && <div className="post-date">{post.date}</div>}
      <div className="markdown-content">
        <ReactMarkdown
          children={post.content}
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight, rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              return !inline ? (
                <pre className={className}>
                  <code {...props}>{children}</code>
                </pre>
              ) : (
                <code {...props}>
                  {children}
                </code>
              );
            },
            img: ({ node, ...props }) => (
              <img {...props} />
            ),
            h1: ({ node, ...props }) => <h1 {...props} />,
            h2: ({ node, ...props }) => <h2 {...props} />,
            h3: ({ node, ...props }) => <h3 {...props} />,
            h4: ({ node, ...props }) => <h4 {...props} />,
            p: ({ node, ...props }) => <p {...props} />,
            ul: ({ node, ...props }) => <ul {...props} />,
            ol: ({ node, ...props }) => <ol {...props} />,
            li: ({ node, ...props }) => <li {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote {...props} />
            ),
            table: ({ children }) => (
              <table>
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th>{children}</th>
            ),
            td: ({ children }) => (
              <td>{children}</td>
            ),
          }}
        />
      </div>
      <Comments postPath={location.pathname.substring('/posts/'.length)} />
    </div>
  );
}

export default PostPage;