import React from 'react';

function Profile() {
  return (
    <div className="sticky top-28">
      <div className="text-center">
        <img src="/api/images/profile.png" alt="프로필" className="w-24 h-24 mx-auto mb-4 rounded-full" />
        <h2 className="font-semibold">한승준</h2>
        <p className="text-sm text-gray-500">멋진 개발자가 되자!</p>
      </div>
    </div>
  );
}

export default Profile;
