async (page) => {
  await page.goto("http://127.0.0.1:5173/PhysDrill/")
  await page.getByRole("button", { name: "快速训练", exact: true }).click()
  const before = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem("physdrill.v1"))
    if (!s.session || !s.attempts.length) throw Error("Run browser-marking first")
    s.bank.bankVersion = 2
    for (const q of s.bank.questions) q.source.file = "计算物理基础课程复习题库.md"
    localStorage.setItem("physdrill.v1", JSON.stringify(s))
    return s
  })
  await page.reload()
  await page.getByRole("button", { name: "快速训练", exact: true }).click()
  if (await page.getByLabel("你的程序 / 作答").inputValue() !== before.session.draft) throw Error("Migration lost draft")
  await page.getByRole("button", { name: "设置与数据", exact: true }).click()
  // A settings update persists the restored in-memory state.
  await page.getByRole("combobox", { name: "答案版本" }).selectOption(before.settings.profile === "course" ? "modern" : "course")
  await page.getByRole("combobox", { name: "答案版本" }).selectOption(before.settings.profile)
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("physdrill.v1")))
  if (after.bank.bankVersion !== 3 || after.bank.questions.some(q => q.source.file !== "sources/questions.md")) throw Error("Source migration")
  for (const key of ["attempts", "progress", "session"]) {
    if (JSON.stringify(after[key]) !== JSON.stringify(before[key])) throw Error("Changed " + key)
  }
  return { passed: ["v2 to v3", "draft", "revealed state", "session", "wrong history", "progress"], attempts: after.attempts.length }
}
