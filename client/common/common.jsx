const f = async (method, url, callback) => {
  try {
    const a = await fetch(url, { method: method })
    const b = await a.json()
    callback(b)
  } catch (err) {
    throw err
  }
}

const common = {
  f: f
}

export default common
