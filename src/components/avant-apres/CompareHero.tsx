import Link from "next/link";
import SplitHero from "@/components/SplitHero";
import BeforeAfter from "@/components/BeforeAfter";
import type { Comparison } from "@/content/types";

// The opener is the comparator itself: drag across the picture right away.
export default function CompareHero({ comparison }: { comparison: Comparison }) {
  return (
    <SplitHero
      eyebrow="Le projet et la réalité"
      title="Avant / Après."
      text={<p>Le projet et le chantier, sous le même angle : faites glisser le curseur, superposez, comparez.</p>}
      footer={
        <Link href="#points-de-vue" className="pill h-[60px] w-[217px] bg-menthe text-[15px] text-foret hover:bg-blanc">
          Les points de vue
        </Link>
      }
    >
      <BeforeAfter comparison={comparison} className="absolute inset-0" frameClass="h-full rounded-none" />
    </SplitHero>
  );
}
