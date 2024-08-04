export async function debug(m: string, f: Promise<any>) {
  const res = await f
  console.log("\n========================================\n")
  console.log(m)
  console.log(JSON.stringify(res, null, 2))
}
