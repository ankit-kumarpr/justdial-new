
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { getLegalContent } from "@/app/super-admin/legal/actions";
import TermsClientPage from "./TermsClientPage";

export default async function TermsAndConditionsPage() {
  const { terms_conditions } = await getLegalContent();

  return (
    <div>
      <JustdialHeader />
      <TermsClientPage content={terms_conditions.content} />
      <JustdialFooter />
    </div>
  );
}
