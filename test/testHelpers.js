export async function withSuppressedStderr (fn) {
  const write = process.stderr.write.bind(process.stderr)
  process.stderr.write = () => true
  try {
    return await fn()
  } finally {
    process.stderr.write = write
  }
}
