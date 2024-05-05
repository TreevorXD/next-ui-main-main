'use client'
import { useEffect } from 'react';
import { redirect } from 'next/navigation'

const RedirectPage = () => {

  useEffect(() => {

    redirect('https://discord.gg/antip2w')

  },);

  return (
    <div>
      <p>Redirecting...</p>
      {/* You can add a loader or any other content here */}
    </div>
  );
};

export default RedirectPage;
