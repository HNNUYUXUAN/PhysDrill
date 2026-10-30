async (page) => {
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto("http://127.0.0.1:5173/PhysDrill/")
  await page.screenshot({ path: "docs/assets/overview.png", fullPage: true })
  await page.getByRole("button", { name: "开始速刷", exact: true }).click()
  await page.getByLabel("你的程序 / 作答").fill("sin[x]")
  await page.reload()
  if ((await page.getByLabel("你的程序 / 作答").inputValue()) !== "sin[x]")
    throw Error("Draft lost")
  await page.screenshot({ path: ".local/frame1.png" })
  await page.getByRole("button", { name: "提交并检查" }).click()
  await page.screenshot({ path: "docs/assets/drill.png", fullPage: true })
  await page.screenshot({ path: ".local/frame2.png" })
  await page.getByRole("button", { name: "答错了", exact: true }).click()
  await page.screenshot({ path: ".local/frame3.png" })
  await page.getByRole("button", { name: /^错题本/ }).click()
  if ((await page.locator(".question-row").count()) !== 1)
    throw Error("Wrong book failed")
  await page.screenshot({ path: ".local/frame4.png" })
  await page.getByRole("button", { name: "设置与数据", exact: true }).click()
  const pending = page.waitForEvent("download")
  await page.getByRole("button", { name: "导出完整备份" }).click()
  const dl = await pending
  await dl.saveAs(".local/browser-backup.json")
  await page
    .getByLabel("导入题库或完整备份")
    .setInputFiles(".local/browser-backup.json")
  await page.getByRole("button", { name: "确认导入" }).click()
  await page.getByRole("combobox", { name: "答案版本" }).selectOption("modern")
  await page.getByRole("button", { name: "学习统计", exact: true }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "总览", exact: true }).click()
  await page.screenshot({ path: "docs/assets/mobile.png", fullPage: true })
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Mobile overflow")
  await page.getByRole("button", { name: "继续练习", exact: true }).click()
  await page.screenshot({
    path: "docs/assets/mobile-drill.png",
    fullPage: true,
  })
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("Drill overflow")
  if (errors.length) throw Error(errors.join("\n"))
  return {
    passed: [
      "draft refresh",
      "answer reveal",
      "rating",
      "wrong book",
      "backup export/import",
      "profile setting",
      "desktop",
      "mobile overflow",
    ],
    errors,
  }
}
