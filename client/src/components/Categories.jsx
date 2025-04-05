import React, { useEffect, useState } from 'react';
import CategoryTree from './CategoryTree';

function Categories() {
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => {
        if (!res.ok) throw new Error('폴더 구조를 가져오는데 실패했습니다.');
        return res.json();
      })
      .then(data => {
        console.log('Received structure:', data);
        setStructure(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading structure:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-center">로딩 중...</div>;
  if (error) return <div className="p-4 text-center text-red-500">에러: {error}</div>;
  if (!structure) return <div className="p-4 text-center">데이터가 없습니다.</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md categories">
      <h2 className="pb-2 mb-6 text-2xl font-bold border-b border-gray-200">카테고리</h2>
      <CategoryTree items={structure.children || []} />
    </div>
  );
}

export default Categories; 