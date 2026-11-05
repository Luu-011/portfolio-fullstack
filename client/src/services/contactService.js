// SIMULADO. Reemplazar por: api.post('/contacts', data)
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms))

export async function sendContact(data) {
  await wait()
  const prev = JSON.parse(localStorage.getItem('mock_contacts') || '[]')
  localStorage.setItem(
    'mock_contacts',
    JSON.stringify([...prev, { ...data, id: Date.now(), createdAt: new Date().toISOString() }])
  )
  return { ok: true }
}
