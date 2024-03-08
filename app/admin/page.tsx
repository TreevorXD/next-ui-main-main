// pages/protect.js
import { Protect } from "@clerk/nextjs";
 
export default function ProtectPage() {
  return (
    <Protect
      role="org:admin"
      fallback={<p>Only an admin can access this content.</p>}
    >
      {/* Your protected content goes here */}
      <div>
        <h1>Protected Content</h1>
        <p>This content is only accessible to users with the 'org:admin' role.</p>
      </div>
    </Protect>
  );
}
