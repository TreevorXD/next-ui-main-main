import { Protect } from "@clerk/nextjs";
 
export default function ProtectPage() {
  return (
    <Protect
      role="org:admin"
      fallback={<p>Only a admin can access this content.</p>}
    >
    </Protect>
  );
}