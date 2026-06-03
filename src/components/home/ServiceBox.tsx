"use client";

type ServiceItem = {
  i: string;
  n: string;
};

type ServiceBoxProps = {
  title: string;
  data: ServiceItem[];
};

export default function ServiceBox({ title, data }: ServiceBoxProps) {
  return (
    <div className="svwrap">
      <div className="svttl">{title}</div>
      <div className="sgrid">
        {data.map((it, i) => (
          <div key={i} className="sit">
            <div className="sico">{it.i}</div>
            <span className="snm">{it.n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
