'use client'
import { useEffect } from 'react';
import { redirect } from 'next/navigation'

const RedirectPage = () => {

  useEffect(() => {

    redirect('https://documenter.getpostman.com/view/33096435/2sA2rCV2oq#intro')

  },);

  return (
    <div>
      <p>Redirecting...</p>
      {/* You can add a loader or any other content here */}
    </div>
  );
};

export default RedirectPage;
