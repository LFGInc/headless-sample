export async function debug(m: string, f: Promise<any>) {
  try {
    const res = await f;
    console.error(`[${m}] Success:`, JSON.stringify(res, null, 2));
  } catch (e) {
    console.error(`[${m}] Got an error:`, JSON.stringify(e, null, 2));
  }
  console.info("\n========================================\n");
}
