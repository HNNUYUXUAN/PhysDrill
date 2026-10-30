async (page) => {
  page.on("dialog", (d) => d.accept())
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole("button", { name: "设置与数据", exact: true }).click()
  await page.getByRole("button", { name: "重置练习数据", exact: true }).click()
  await page.getByRole("combobox", { name: "答案版本" }).selectOption("course")
  await page.getByRole("button", { name: "总览", exact: true }).click()
  await page.screenshot({ path: "docs/assets/overview.png", fullPage: true })
  await page.getByRole("button", { name: "进入默写训练 →" }).click()
  if (await page.locator("textarea").count())
    throw Error("Paper mode forces input")
  await page.getByRole("button", { name: "显示参考答案" }).click()
  await page.getByRole("button", { name: "不确定", exact: true }).click()
  await page.reload()
  if (!(await page.locator(".session-meta").innerText()).includes("1 / 10"))
    throw Error("Paper progress lost")
  await page.getByRole("button", { name: "结束", exact: true }).click()
  await page.getByLabel("训练方式").selectOption("syntax")
  await page.getByRole("button", { name: "开始这一轮" }).click()
  await page.getByRole("button", { name: "有问题", exact: true }).click()
  await page.getByRole("button", { name: "显示参考答案" }).click()
  await page.getByRole("button", { name: "答错了", exact: true }).click()
  await page.getByRole("button", { name: /^错题本/ }).click()
  await page.getByRole("button", { name: "程序辨析", exact: true }).click()
  if ((await page.locator(".question-row").count()) !== 1)
    throw Error("Syntax wrong book missing")
  await page.getByRole("button", { name: "移出", exact: true }).click()
  if (await page.locator(".question-row").count()) throw Error("Removal failed")
  await page.getByRole("button", { name: "学习统计", exact: true }).click()
  if (!(await page.locator("main").innerText()).includes("程序辨析：1 次"))
    throw Error("History lost")
  await page.getByRole("button", { name: "设置与数据", exact: true }).click()
  await page.getByLabel("导入题库或完整备份").setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from("{"),
  })
  if (!(await page.getByRole("status").innerText()).includes("导入失败"))
    throw Error("Bad import accepted")
  return {
    passed: [
      "paper without typing",
      "paper refresh",
      "syntax exercise",
      "syntax wrong book",
      "remove retains history",
      "invalid import rejected",
    ],
  }
}
