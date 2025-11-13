
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { getLegalContent } from "@/app/super-admin/legal/actions";
import PolicyClientPage from "./PolicyClientPage";

export default async function PolicyPage() {
  const { privacy_policy } = await getLegalContent();

  return (
    <div>
      <JustdialHeader />
      <PolicyClientPage content={privacy_policy.content} />
      <JustdialFooter />
    </div>
  );
}
