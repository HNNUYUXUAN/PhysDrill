async (page) => {
  await page.goto('http://127.0.0.1:5173/PhysDrill/')
  await page.evaluate(() => localStorage.setItem('physdrill.v1','{'))
  await page.reload()
  if(!(await page.getByRole('alert').innerText()).includes('读取失败'))throw Error('Corruption not reported')
  await page.getByRole('button',{name:'设置与数据',exact:true}).click()
  await page.getByLabel('导入题库或完整备份').setInputFiles('.local/browser-backup.json')
  await page.getByRole('button',{name:'确认导入',exact:true}).click()
  await page.reload()
  if(await page.getByRole('alert').count())throw Error('Backup recovery failed')
  const n=await page.evaluate(()=>JSON.parse(localStorage.getItem('physdrill.v1')).attempts.length)
  if(n!==1)throw Error('Recovered attempt history changed')
  return {passed:['corrupt data detected','confirmed backup replaces corrupt storage','recovered history survives reload']}
}
