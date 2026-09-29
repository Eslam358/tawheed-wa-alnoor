import { adminOffice, branches, telHref } from "@/lib/branches";

export const metadata = {
  title: "فروعنا | التوحيد والنور",
};

export default function BranchesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl font-extrabold text-brand-900 mb-1">
        فروعنا
      </h1>
      <p className="text-ink/60 mb-8">تقدر تزورنا أو تتواصل معانا في أي فرع من فروعنا</p>

      {/* الإدارة */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5 mb-6">
        <h2 className="font-semibold text-brand-900 mb-2">🏢 {adminOffice.name}</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink/80">
          <span>
            📞 التليفون:{" "}
            {adminOffice.phones.map((p, i) => (
              <a key={p} href={telHref(p)} className="text-brand-700 hover:underline">
                {p}{i < adminOffice.phones.length - 1 ? " - " : ""}
              </a>
            ))}
          </span>
          <span>📠 فاكس: {adminOffice.fax}</span>
        </div>
      </div>

      {/* الفروع */}
      <div className="grid sm:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div
            key={branch.name}
            className="rounded-xl border border-sand-200 bg-white p-5"
          >
            <h2 className="font-semibold text-brand-900 mb-2">📍 {branch.name}</h2>
            <p className="text-sm text-ink/70 mb-3 leading-relaxed">{branch.address}</p>
            <div className="space-y-1 text-sm">
              {branch.phones?.map((p) => (
                <p key={p}>
                  ☎️ تليفون:{" "}
                  <a href={telHref(p)} className="text-brand-700 font-medium hover:underline">
                    {p}
                  </a>
                </p>
              ))}
              {branch.mobiles?.map((m) => (
                <p key={m}>
                  📱 موبايل:{" "}
                  <a href={telHref(m)} className="text-brand-700 font-medium hover:underline">
                    {m}
                  </a>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
