import { StatsDetails, streak } from "./StatsDetails";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import {
  BookOpen,
  ArrowRight,
  Layers,
  RotateCcw,
  ChartNoAxesCombined,
  Settings,
  LayoutDashboard,
  Check,
  Copy,
  FlaskConical,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./style.css";
import { Store, useStore } from "./store";
import {
  answer,
  key,
  stats,
  start,
  rate,
  next,
  day,
  importData,
  replaceBank,
  initial,
  STORAGE,
  compare,
  type Config,
  type Question,
  type State,
  type Bank,
} from "./core";
function MathText({ text }: { text: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      skipHtml
    >
      {text}
    </Markdown>
  );
}
function download(name: string, data: unknown) {
  const url = URL.createObjectURL(
    new Blob(
      [typeof data === "string" ? data : JSON.stringify(data, null, 2)],
      { type: "application/json" },
    ),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Code({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code">
      <button
        className="copy"
        aria-label="复制程序"
        onClick={() => {
          navigator.clipboard
            .writeText(text)
            .then(() => setCopied(true))
            .catch(() => setCopied(false));
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <pre>{text}</pre>
    </div>
  );
}
function Reference({
  q,
  profile,
}: {
  q: Question;
  profile: "course" | "modern";
}) {
  const v = answer(q, profile);
  return (
    <>
      <div className="eyebrow">
        参考程序 ·{" "}
        {v.id === "common" ? "通用" : v.id === "course" ? "课程版" : "现代版"}
      </div>
      <Code text={v.program} />
      {v.note && (
        <div className="note">
          <MathText text={v.note} />
        </div>
      )}
      {v.solution && (
        <div className="solution">
          <MathText text={v.solution} />
        </div>
      )}
      <details>
        <summary>来源与原始答案</summary>
        <p>
          {q.source.file} · {q.source.section} 第 {q.source.item} 题 · 第{" "}
          {q.source.lineStart} 行
        </p>
        <p>核验状态：{v.verification}</p>
        <Code text={q.originalAnswer} />
        {q.originalSolution && <MathText text={q.originalSolution} />}
      </details>
    </>
  );
}
const defaults: Config = {
  profile: "course",
  mode: "input",
  filter: "all",
  category: "",
  tag: "",
  order: "random",
  length: 10,
};
function App() {
  const { state: s, update, error } = useStore();
  const [page, setPage] = useState(
    s.session && !s.session.finished ? "drill" : "overview",
  );
  const [config, setConfig] = useState<Config>(defaults);
  const [detail, setDetail] = useState<Question | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [wrongMode, setWrongMode] = useState(false);
  const [pending, setPending] = useState<ReturnType<typeof importData> | null>(
    null,
  );
  const st = stats(s);
  const nav = [
    ["overview", "总览", LayoutDashboard],
    ["drill", "快速训练", BookOpen],
    ["categories", "题库模块", Layers],
    ["wrong", "错题本", RotateCcw],
    ["statistics", "学习统计", ChartNoAxesCombined],
    ["settings", "设置与数据", Settings],
  ] as const;
  function launch(overrides: Partial<Config> = {}) {
    const cfg = { ...config, profile: s.settings.profile, ...overrides };
    const n = start(s, cfg);
    if (n === s) {
      setMessage("当前筛选没有可练习的题目。");
      return;
    }
    if (
      s.session &&
      !s.session.finished &&
      !confirm("开始新训练将结束当前会话，已完成记录会保留。")
    )
      return;
    update(() => n);
    setPage("drill");
    setMessage("");
  }
  const accuracy = st.attempts
    ? Math.round((100 * st.correct) / st.attempts) + "%"
    : "—";
  const session = s.session;
  const q = session
    ? s.bank.questions.find((q) => q.id === session.qid)
    : undefined;
  function updateSession(p: Partial<NonNullable<State["session"]>>) {
    update((x) => ({
      ...x,
      session: x.session ? { ...x.session, ...p } : null,
    }));
  }
  function questionRows(questions: Question[]) {
    return (
      <div className="rows">
        {questions.map((q) => {
          const p =
            s.progress[
              (wrongMode && page === "wrong" ? "syntax:" : "") +
                key(q, s.settings.profile)
            ];
          return (
            <div className="question-row" key={q.id}>
              <button className="question-title" onClick={() => setDetail(q)}>
                <small>
                  {q.id} ·{" "}
                  {s.bank.categories.find((c) => c.id === q.categoryId)?.name}
                </small>
                <MathText text={q.title} />
              </button>
              <div className="row-state">
                {p ? (
                  <>
                    <span>
                      {p.streak >= 3
                        ? "已掌握"
                        : p.result === "correct"
                          ? "练习中"
                          : "不熟悉"}
                    </span>
                    <small>
                      错误 {p.wrong} · 不确定 {p.uncertain} · 重做 {p.retries}
                    </small>
                    <small>{new Date(p.last).toLocaleString()}</small>
                  </>
                ) : (
                  <span>未练习</span>
                )}
              </div>
              {page === "wrong" && (
                <button
                  className="text-button"
                  onClick={() =>
                    update((x) => {
                      const k =
                        (wrongMode ? "syntax:" : "") +
                        key(q, x.settings.profile);
                      return {
                        ...x,
                        progress: {
                          ...x.progress,
                          [k]: { ...x.progress[k], active: false },
                        },
                      };
                    })
                  }
                >
                  移出
                </button>
              )}
            </div>
          );
        })}
        {!questions.length && (
          <div className="empty">
            这里还没有题目。完成一次训练后，记录会出现在这里。
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="app">
      <aside>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("overview");
          }}
        >
          <FlaskConical />
          <span>
            PhysDrill<small>COMPUTATIONAL PHYSICS</small>
          </span>
        </a>
        <div className="sidebar-label">学习空间</div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              className={page === id ? "active" : ""}
              onClick={() => {
                setPage(id);
                setMessage("");
              }}
              key={id}
            >
              <Icon size={19} />
              <span>{label}</span>
              {id === "wrong" && st.wrong > 0 && <b>{st.wrong}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="dot" /> 本地学习空间
          <small>专注每一次提取与回忆。</small>
        </div>
      </aside>
      <main>
        <header>
          <span>计算物理 / {nav.find((n) => n[0] === page)?.[1]}</span>
          <label className="profile">
            答案版本{" "}
            <select
              value={s.settings.profile}
              onChange={(e) =>
                update((x) => ({
                  ...x,
                  settings: {
                    ...x.settings,
                    profile: e.target.value as "course" | "modern",
                  },
                }))
              }
            >
              <option value="course">课程版</option>
              <option value="modern">现代版</option>
            </select>
          </label>
        </header>
        {error && (
          <div role="alert" className="alert">
            尚未保存：{error}{" "}
            <button onClick={() => download("physdrill-recovery.json", s)}>
              导出当前数据
            </button>
          </div>
        )}
        {message && (
          <div role="status" className="note">
            {message}
          </div>
        )}
        {page === "overview" && (
          <>
            <div className="page-heading">
              <div className="eyebrow">把知识写出来</div>
              <h1>下一次下笔，更有把握。</h1>
              <p>从一个命令开始，练到完整写出。今天也向熟练迈进一步。</p>
              <small>
                连续练习 {streak(s)} 天 · 错题 {st.wrong} 道
              </small>
            </div>
            <section className="hero">
              <div>
                <span className="eyebrow">QUICK DRILL</span>
                <h2>十道题，找回手感。</h2>
                <p>回忆 · 书写 · 对照 · 再练习</p>
                <button
                  className="primary"
                  onClick={() =>
                    session && !session.finished ? setPage("drill") : launch()
                  }
                >
                  {session && !session.finished ? "继续练习" : "开始速刷"}
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="hero-code">
                <span>01 / 回忆一个命令</span>
                <code>Integrate[f[x], {"{x, a, b}"}]</code>
                <small>方括号、花括号，每一次都写对。</small>
              </div>
            </section>
            <div className="metrics">
              {[
                ["题库总量", st.total],
                ["已练习", st.seen],
                ["今日练习", st.today],
                ["正确率", accuracy],
                ["待复习", st.due],
                ["已掌握", st.mastered],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="section-heading">
              <h2>按模块巩固</h2>
              <button
                className="text-button"
                onClick={() => setPage("categories")}
              >
                浏览全部题目 →
              </button>
            </div>
            <div className="modules">
              {s.bank.categories.map((c, i) => {
                const a = stats(s, c.id);
                return (
                  <button
                    className="module"
                    key={c.id}
                    onClick={() => {
                      launch({ category: c.id, tag: "", filter: "all" });
                    }}
                  >
                    <span className="module-num">0{i + 1}</span>
                    <h3>{c.name}</h3>
                    <p>
                      {a.total} 道题 · 已掌握 {a.mastered}
                    </p>
                    <div className="bar">
                      <i
                        style={{
                          width: `${a.total ? (100 * a.mastered) / a.total : 0}%`,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="bottom-note">
              <BookOpen size={20} />
              <span>纸笔考试，重点是写出完整程序。</span>
              <button onClick={() => launch({ mode: "paper" })}>
                进入默写训练 →
              </button>
            </div>
          </>
        )}
        {page === "drill" && (
          <>
            <div className="page-heading compact">
              <div className="eyebrow">RETRIEVAL PRACTICE</div>
              <h1>快速训练</h1>
              <p>先独立回忆，再查看参考答案。</p>
            </div>
            {session && !session.finished && q ? (
              <>
                <div className="session-meta">
                  <span>
                    {session.config.mode === "paper"
                      ? "纸笔默写"
                      : session.config.mode === "syntax"
                        ? "程序辨析"
                        : "输入速刷"}{" "}
                    ·{" "}
                    {session.config.profile === "course" ? "课程版" : "现代版"}
                  </span>
                  <span>
                    {session.done} / {session.config.length || "∞"} 已完成{" "}
                    <button
                      className="text-button"
                      onClick={() => {
                        if (confirm("结束本轮训练？已完成记录会保留。"))
                          update((x) => ({ ...x, session: null }));
                      }}
                    >
                      结束
                    </button>
                  </span>
                </div>
                <article className="practice">
                  <div className="eyebrow">
                    {q.id} /{" "}
                    {s.bank.categories.find((c) => c.id === q.categoryId)?.name}
                  </div>
                  <div className="prompt">
                    <MathText text={q.prompt} />
                  </div>
                  {session.config.mode === "input" && (
                    <>
                      <label htmlFor="answer-input">你的程序 / 作答</label>
                      <textarea
                        id="answer-input"
                        spellCheck={false}
                        value={session.draft}
                        onChange={(e) =>
                          updateSession({ draft: e.target.value })
                        }
                        placeholder="在这里写下程序，也可以直接在纸上完成……"
                        disabled={session.revealed}
                      />
                    </>
                  )}
                  {session.config.mode === "paper" && (
                    <div className="paper-note">
                      在纸上写出完整答案。准备好后，展开参考程序。
                    </div>
                  )}
                  {session.config.mode === "syntax" && (
                    <>
                      <p>这段程序是否符合本题参考写法？</p>
                      <Code text={session.snippet} />
                      <div className="actions">
                        <button
                          disabled={session.revealed}
                          className={session.choice === true ? "selected" : ""}
                          onClick={() => updateSession({ choice: true })}
                        >
                          符合
                        </button>
                        <button
                          disabled={session.revealed}
                          className={session.choice === false ? "selected" : ""}
                          onClick={() => updateSession({ choice: false })}
                        >
                          有问题
                        </button>
                      </div>
                    </>
                  )}
                  <div className="answer-zone">
                    {!session.revealed ? (
                      <button
                        className="primary"
                        disabled={
                          session.config.mode === "syntax" &&
                          session.choice === null
                        }
                        onClick={() => updateSession({ revealed: true })}
                      >
                        显示参考答案 <ArrowRight size={16} />
                      </button>
                    ) : (
                      <>
                        {session.config.mode === "syntax" ? (
                          <div className="note">
                            {session.choice === session.isOriginal
                              ? "判断正确"
                              : "判断有差异"}{" "}
                            · {session.syntaxReason}
                          </div>
                        ) : (
                          session.draft &&
                          q.answerType === "mathematica" && (
                            <div className="note">
                              {compare(
                                session.draft,
                                answer(q, session.config.profile).program,
                                s.settings.strict,
                              )
                                ? "与参考程序匹配"
                                : "与参考程序有差异，请对照后自评。"}
                            </div>
                          )
                        )}
                        <Reference q={q} profile={session.config.profile} />
                        {!session.rated ? (
                          <div className="assessment">
                            <p>这次掌握得怎样？</p>
                            <div className="actions">
                              <button
                                className="primary"
                                onClick={() =>
                                  update((x) => rate(x, "correct"))
                                }
                              >
                                掌握了
                              </button>
                              <button
                                onClick={() =>
                                  update((x) => rate(x, "uncertain"))
                                }
                              >
                                不确定
                              </button>
                              <button
                                className="danger-text"
                                onClick={() => update((x) => rate(x, "wrong"))}
                              >
                                答错了
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="primary"
                            onClick={() => update(next)}
                          >
                            下一题 <ArrowRight size={16} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </article>
              </>
            ) : (
              <>
                {session?.finished && (
                  <div className="note">
                    本轮已完成 {session.done} 次练习，记录已保存。继续巩固吧。
                  </div>
                )}
                <section className="panel">
                  <h2>安排这一轮练习</h2>
                  <div className="form-grid">
                    <label>
                      训练方式
                      <select
                        value={config.mode}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            mode: e.target.value as Config["mode"],
                          })
                        }
                      >
                        <option value="input">输入速刷</option>
                        <option value="paper">纸笔默写</option>
                        <option value="syntax">程序辨析</option>
                      </select>
                    </label>
                    <label>
                      题目范围
                      <select
                        value={config.filter}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            filter: e.target.value as Config["filter"],
                          })
                        }
                      >
                        {[
                          ["all", "全部题目"],
                          ["wrong", "只刷错题"],
                          ["unseen", "尚未练习"],
                          ["due", "到期复习"],
                        ].map(([v, t]) => (
                          <option value={v} key={v}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      模块
                      <select
                        value={config.category}
                        onChange={(e) =>
                          setConfig({ ...config, category: e.target.value })
                        }
                      >
                        <option value="">全部模块</option>
                        {s.bank.categories.map((c) => (
                          <option value={c.id} key={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      命令标签
                      <select
                        value={config.tag}
                        onChange={(e) =>
                          setConfig({ ...config, tag: e.target.value })
                        }
                      >
                        <option value="">全部标签</option>
                        {[...new Set(s.bank.questions.flatMap((q) => q.tags))]
                          .sort()
                          .map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                      </select>
                    </label>
                    <label>
                      顺序
                      <select
                        value={config.order}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            order: e.target.value as Config["order"],
                          })
                        }
                      >
                        <option value="random">加权随机</option>
                        <option value="source">原题顺序</option>
                      </select>
                    </label>
                    <label>
                      题量（0 为无限）
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={config.length}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            length: Math.min(
                              10000,
                              Math.max(0, Math.floor(+e.target.value)),
                            ),
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className="actions">
                    {[10, 20, 50, 0].map((n) => (
                      <button
                        key={n}
                        className={config.length === n ? "selected" : ""}
                        onClick={() => setConfig({ ...config, length: n })}
                      >
                        {n || "无限"}
                      </button>
                    ))}
                  </div>
                  <button className="primary" onClick={() => launch()}>
                    开始这一轮 <ArrowRight size={18} />
                  </button>
                </section>
                <details className="panel">
                  <summary>考试书写规范</summary>
                  <MathText text={s.bank.rules} />
                </details>
              </>
            )}
          </>
        )}
        {page === "categories" && (
          <>
            <div className="page-heading compact">
              <h1>题库模块</h1>
              <p>每一道题，都能追溯到课程原稿。</p>
            </div>
            <div className="actions">
              <input
                aria-label="搜索题目"
                placeholder="搜索题目或命令……"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {s.bank.categories.map((c) => (
              <section key={c.id}>
                <div className="section-heading">
                  <h2>
                    {c.id} / {c.name}
                  </h2>
                  <button
                    className="text-button"
                    onClick={() =>
                      launch({ category: c.id, tag: "", filter: "all" })
                    }
                  >
                    练习本模块 →
                  </button>
                </div>
                {questionRows(
                  s.bank.questions.filter(
                    (q) =>
                      q.categoryId === c.id &&
                      (q.prompt + q.tags.join(" "))
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                  ),
                )}
              </section>
            ))}
          </>
        )}
        {page === "wrong" && (
          <>
            <div className="page-heading compact">
              <h1>错题本</h1>
              <p>留下薄弱点，让下一次练习更有针对性。</p>
            </div>
            <div className="actions">
              <button
                className={!wrongMode ? "selected" : ""}
                onClick={() => setWrongMode(false)}
              >
                整题练习
              </button>
              <button
                className={wrongMode ? "selected" : ""}
                onClick={() => setWrongMode(true)}
              >
                程序辨析
              </button>
              <button
                className="primary"
                onClick={() =>
                  launch({
                    filter: "wrong",
                    category: "",
                    tag: "",
                    mode: wrongMode ? "syntax" : "input",
                    length: 0,
                  })
                }
              >
                错题回炉
              </button>
              <button
                onClick={() =>
                  launch({
                    filter: "wrong",
                    category: "",
                    tag: "",
                    mode: wrongMode ? "syntax" : "input",
                    length: 10,
                  })
                }
              >
                随机 10 题
              </button>
            </div>
            {questionRows(
              s.bank.questions.filter(
                (q) =>
                  s.progress[
                    (wrongMode ? "syntax:" : "") + key(q, s.settings.profile)
                  ]?.active,
              ),
            )}
          </>
        )}
        {page === "statistics" && (
          <>
            <div className="page-heading compact">
              <h1>学习统计</h1>
              <p>来自每一次真实完成的练习。</p>
            </div>
            <div className="metrics">
              {[
                ["完成次数", st.attempts],
                ["正确率", accuracy],
                ["已掌握", st.mastered],
                ["待复习", st.due],
              ].map(([l, v]) => (
                <div key={l}>
                  <span>{l}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
            <section className="panel">
              <h2>模块表现</h2>
              {s.bank.categories.map((c) => {
                const t = stats(s, c.id);
                return (
                  <div className="stat-row" key={c.id}>
                    <span>{c.name}</span>
                    <div className="bar">
                      <i
                        style={{
                          width: `${t.attempts ? (100 * t.correct) / t.attempts : 0}%`,
                        }}
                      />
                    </div>
                    <span>
                      {t.attempts
                        ? Math.round((100 * t.correct) / t.attempts) + "%"
                        : "—"}{" "}
                      · {t.attempts} 次
                    </span>
                  </div>
                );
              })}
            </section>
            <section className="panel">
              <h2>每日练习</h2>
              {!s.attempts.length ? (
                <p>完成第一轮训练后，查看每日记录。</p>
              ) : (
                [...new Set(s.attempts.map((a) => a.day))]
                  .sort()
                  .reverse()
                  .slice(0, 14)
                  .map((d) => (
                    <div className="stat-row" key={d}>
                      <span>{d}</span>
                      <span>
                        {s.attempts.filter((a) => a.day === d).length}{" "}
                        次（含辨析）
                      </span>
                    </div>
                  ))
              )}
            </section>
            <StatsDetails state={s} />
            <section className="panel">
              <h2>最近记录</h2>
              <p>
                程序辨析：{s.attempts.filter((a) => a.mode === "syntax").length}{" "}
                次 · 正确{" "}
                {
                  s.attempts.filter(
                    (a) => a.mode === "syntax" && a.result === "correct",
                  ).length
                }{" "}
                次
              </p>
              {s.attempts
                .slice(-20)
                .reverse()
                .map((a) => (
                  <div className="stat-row" key={a.id}>
                    <span>
                      {a.qid} ·{" "}
                      {a.mode === "syntax"
                        ? "辨析"
                        : a.mode === "paper"
                          ? "默写"
                          : "输入"}
                    </span>
                    <span>
                      {a.result === "correct"
                        ? "掌握了"
                        : a.result === "wrong"
                          ? "答错了"
                          : "不确定"}
                    </span>
                    <small>{new Date(a.time).toLocaleString()}</small>
                  </div>
                ))}
            </section>
          </>
        )}
        {page === "settings" && (
          <>
            <div className="page-heading compact">
              <h1>设置与数据</h1>
              <p>学习记录保存在当前浏览器，定期备份，让进度始终在手。</p>
            </div>
            <section className="panel">
              <h2>训练偏好</h2>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={s.settings.strict}
                  onChange={(e) =>
                    update((x) => ({
                      ...x,
                      settings: { ...x.settings, strict: e.target.checked },
                    }))
                  }
                />
                严格比较（保留内部空白）
              </label>
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={s.settings.autoNext}
                  onChange={(e) =>
                    update((x) => ({
                      ...x,
                      settings: { ...x.settings, autoNext: e.target.checked },
                    }))
                  }
                />
                自评后自动进入下一题
              </label>
              <p>课程版与现代版在右上角切换。已开始的会话继续使用原版本。</p>
            </section>
            <section className="panel">
              <h2>备份与恢复</h2>
              <p>
                备份包含题库、全部练习历史、设置和当前会话。同一浏览器的不同地址或端口拥有独立数据。
              </p>
              <div className="actions">
                <button
                  className="primary"
                  onClick={() =>
                    download("physdrill-backup-" + day() + ".json", s)
                  }
                >
                  导出完整备份
                </button>
                <button onClick={() => download("physdrill-bank.json", s.bank)}>
                  导出题库
                </button>
              </div>
              <label>
                导入题库或完整备份
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={async (e) => {
                    try {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 20 * 1024 * 1024)
                        throw Error("文件超过 20 MB");
                      setPending(importData(await f.text()));
                      setMessage("");
                    } catch (err) {
                      setMessage(
                        "导入失败：" +
                          (err instanceof Error ? err.message : "文件无效"),
                      );
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              {pending && (
                <div className="note">
                  <p>
                    将导入
                    {pending.type === "backup"
                      ? "完整备份（替换所有当前记录）"
                      : "题库（保留历史并结束当前会话）"}
                    ，共{" "}
                    {pending.type === "bank"
                      ? (pending.data as Bank).questions.length
                      : (pending.data as State).bank.questions.length}{" "}
                    题。
                  </p>
                  <div className="actions">
                    <button
                      className="primary"
                      onClick={() => {
                        update((x) =>
                          pending.type === "backup"
                            ? (pending.data as State)
                            : replaceBank(x, pending.data as Bank),
                        );
                        setPending(null);
                        setMessage("导入完成。");
                      }}
                    >
                      确认导入
                    </button>
                    <button onClick={() => setPending(null)}>取消</button>
                  </div>
                </div>
              )}
            </section>
            <section className="panel">
              <h2>数据维护</h2>
              <button
                className="danger-text"
                onClick={() => {
                  if (confirm("清除所有练习记录与当前会话？题库和设置保留。"))
                    update((x) => ({
                      ...initial(),
                      bank: x.bank,
                      settings: x.settings,
                    }));
                }}
              >
                重置练习数据
              </button>
              {error && (
                <div className="actions">
                  <button
                    onClick={() =>
                      download(
                        "physdrill-original-storage.json",
                        localStorage.getItem(STORAGE) || "",
                      )
                    }
                  >
                    导出原存储内容
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "请先导出原始数据。确认清除损坏存储并重新加载？",
                        )
                      ) {
                        localStorage.removeItem(STORAGE);
                        location.reload();
                      }
                    }}
                  >
                    清除损坏数据并刷新
                  </button>
                </div>
              )}
            </section>
          </>
        )}
        <footer>
          PhysDrill · Computational Physics Drill Platform{" "}
          <span>本地保存 · 题库 v{s.bank.bankVersion}</span>
        </footer>
      </main>
      {detail && (
        <div className="modal-backdrop" onClick={() => setDetail(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-label="题目详情"
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setDetail(null)}>
              关闭 ×
            </button>
            <small>{detail.id}</small>
            <div className="prompt">
              <MathText text={detail.prompt} />
            </div>
            <Reference q={detail} profile={s.settings.profile} />
            <button
              className="primary"
              onClick={() => {
                const n = start(s, {
                  ...defaults,
                  profile: s.settings.profile,
                  length: 1,
                });
                if (n.session) {
                  n.session.pool = [detail.id];
                  n.session.remaining = [];
                  n.session.qid = detail.id;
                }
                update(() => n);
                setDetail(null);
                setPage("drill");
              }}
            >
              练习这一题
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <Store>
    <App />
  </Store>,
);
