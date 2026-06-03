"use client";

type CategoryItem = {
  i: string;
  n: string;
  c: string;
};

type CategorySectionProps = {
  title: string;
  data: CategoryItem[];
  bg: string;
  doSearch: (query?: string) => void;
};

export default function CategorySection({ title, data, bg, doSearch }: CategorySectionProps) {
  return (
    <div style={{ background: bg, padding: "28px 0" }}>
      <div className="wrap">
        <div className="shdr">
          <div className="sttl">{title}</div>
          <span className="sall">See All →</span>
        </div>

        <div className="cgrid">
          {data.map((it, i) => (
            <div key={i} className="ccard" onClick={() => doSearch(it.n)}>
              <div className="cci">{it.i}</div>
              <div className="ccn">{it.n}</div>
              <div className="ccc">{it.c} listings</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
