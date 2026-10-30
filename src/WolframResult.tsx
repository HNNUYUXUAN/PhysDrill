import audit from "./data/wolfram.json";
import type { Question } from "./core";

export function WolframResult({
  q,
  variant,
}: {
  q: Question;
  variant: Question["variants"][number];
}) {
  const record = audit.records.find(
    (r) =>
      r.qid === q.id &&
      r.variant === variant.id &&
      r.revision === variant.revision &&
      r.program === variant.program,
  );
  if (!record) return null;
  const modern = audit.records.find(
    (r) =>
      r.qid === q.id &&
      r.variant === "modern" &&
      q.variants.some(
        (v) =>
          v.id === "modern" &&
          v.program === r.program &&
          v.revision === r.revision,
      ),
  );
  const illustration = record.image ? record : modern?.image ? modern : null;
  return (
    <details className="wolfram-result">
      <summary>展开 Wolfram {illustration ? "图形与" : ""}运行结果</summary>
      <p className="note">
        {record.status === "evaluated"
          ? "内核已运行，无诊断消息。"
          : "本版本运行产生诊断，请查看下方记录。"}{" "}
        运行输出用于理解与核对，纸笔复习优先记忆上方程序。
      </p>
      {illustration && (
        <figure>
          <img
            loading="lazy"
            src={illustration.image}
            alt={`${q.id} ${illustration.variant === "modern" ? "现代版" : "参考程序"} Wolfram 导出图形`}
            width="900"
          />
          <figcaption>
            {illustration !== record
              ? "对应现代版的导出图形；课程版旧包诊断保留如下。"
              : "由本题程序在 Wolfram 内核中实际导出。"}
          </figcaption>
        </figure>
      )}
      <p>运行输出{q.id === "D-001" ? "（依次为 v2、a2）" : ""}</p>
      <pre className="kernel-output">{record.result}</pre>
      {record.messages.length > 0 && (
        <pre className="kernel-output diagnostic">
          {record.messages.join("\n\n")}
        </pre>
      )}
      <small>
        {audit.kernel} · {audit.generatedAt}
      </small>
      <p>
        <a
          href={`https://github.com/HNNUYUXUAN/PhysDrill/blob/main/${record.source}`}
          target="_blank"
          rel="noreferrer"
        >
          查看本题 .wl 源文件
        </a>
        {" · "}
        <a href="wolfram/audit.json" target="_blank" rel="noreferrer">
          完整运行记录
        </a>
      </p>
    </details>
  );
}
