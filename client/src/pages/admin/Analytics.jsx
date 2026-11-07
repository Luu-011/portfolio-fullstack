import { useState } from 'react'
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { useFetch } from '../../hooks/useFetch'
import { getSummary, getVisitsByDay, getRegistrations, getContactsByType, getTopPages } from '../../services/analyticsService'
import ChartCard from '../../components/admin/ChartCard'
import '../../styles/admin-panel.css'

// Colores del manual de marca
const C = { mocha: '#433633', stone: '#5C5552', olive: '#8F857D', oak: '#DECBB7' }
const axis = { tick: { fill: C.stone, fontSize: 12 }, stroke: C.olive }
const tooltip = {
  contentStyle: { background: '#F7F0F5', border: `1px solid ${C.oak}`, borderRadius: 10, color: C.mocha },
  cursor: { fill: 'rgba(222,203,183,.35)' },
}

const shortDate = (iso) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`
const monthLabel = (ym) => new Date(`${ym}-01T00:00:00`).toLocaleDateString('es-AR', { month: 'short', year: '2-digit' })
const sum = (rows, key) => rows.reduce((acc, r) => acc + r[key], 0)

function Stat({ value, label }) {
  return (
    <div className="card-soft stat">
      <span className="stat-num">{value}</span>
      <span>{label}</span>
    </div>
  )
}

export default function Analytics() {
  const [days, setDays] = useState(30)
  const [months, setMonths] = useState(6)

  const summary = useFetch(getSummary)
  const visits = useFetch(() => getVisitsByDay(days), [days])
  const types = useFetch(() => getContactsByType(days), [days])
  const regs = useFetch(() => getRegistrations(months), [months])
  const pages = useFetch(() => getTopPages(5))

  const s = summary.data

  return (
    <>
      <h1 className="admin-title">Estadísticas</h1>
      <p>Tráfico del sitio, registros y consultas.</p>

      <div className="toolbar">
        <label>
          Período
          <select className="form-select form-select-sm" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
        </label>
        <label>
          Registros
          <select className="form-select form-select-sm" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Últimos 12 meses</option>
          </select>
        </label>
      </div>

      {summary.error && <p role="alert" className="form-note is-error">{summary.error}</p>}
      {s && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3"><Stat value={s.visits.total} label="Visitas totales" /></div>
          <div className="col-6 col-lg-3"><Stat value={s.visits.anonymous} label="Visitantes sin cuenta" /></div>
          <div className="col-6 col-lg-3"><Stat value={s.visits.registered} label="Accesos de usuarios registrados" /></div>
          <div className="col-6 col-lg-3"><Stat value={s.users} label="Cuentas creadas" /></div>
        </div>
      )}

      <div className="chart-grid">
        <ChartCard title="Tráfico del sitio" caption={`Visitas por día, últimos ${days} días`} state={visits} wide>
          {(rows) =>
            sum(rows, 'total') === 0 ? (
              <p className="mb-0">Todavía no hay visitas en este período.</p>
            ) : (
              <div role="img" aria-label={`Visitas por día: ${sum(rows, 'total')} en total, ${sum(rows, 'registered')} de usuarios registrados`}>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke={C.oak} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={shortDate} minTickGap={24} {...axis} />
                    <YAxis allowDecimals={false} {...axis} />
                    <Tooltip labelFormatter={shortDate} {...tooltip} />
                    <Legend />
                    <Line type="monotone" dataKey="total" name="Visitas" stroke={C.mocha} strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="registered" name="Usuarios registrados" stroke={C.olive} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          }
        </ChartCard>

        <ChartCard title="Flujo de registros" caption={`Cuentas nuevas por mes, últimos ${months} meses`} state={regs}>
          {(rows) =>
            sum(rows, 'count') === 0 ? (
              <p className="mb-0">Todavía no hay registros en este período.</p>
            ) : (
              <div role="img" aria-label={`Registros por mes: ${sum(rows, 'count')} en total`}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke={C.oak} strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickFormatter={monthLabel} {...axis} />
                    <YAxis allowDecimals={false} {...axis} />
                    <Tooltip labelFormatter={monthLabel} {...tooltip} />
                    <Bar dataKey="count" name="Registros" fill={C.stone} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          }
        </ChartCard>

        <ChartCard title="Tipos de consulta" caption={`Más frecuentes, últimos ${days} días`} state={types}>
          {(rows) =>
            sum(rows, 'count') === 0 ? (
              <p className="mb-0">Todavía no hay consultas en este período.</p>
            ) : (
              <div role="img" aria-label={`Consultas por tipo: ${rows.map((r) => `${r.type} ${r.count}`).join(', ')}`}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
                    <CartesianGrid stroke={C.oak} strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} {...axis} />
                    <YAxis type="category" dataKey="type" width={150} {...axis} />
                    <Tooltip {...tooltip} />
                    <Bar dataKey="count" name="Consultas" fill={C.olive} radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          }
        </ChartCard>

        <ChartCard title="Páginas de entrada" caption="Por dónde ingresa la gente al sitio" state={pages}>
          {(rows) =>
            rows.length === 0 ? (
              <p className="mb-0">Todavía no hay visitas registradas.</p>
            ) : (
              <ol className="type-list ranking">
                {rows.map((r) => (
                  <li key={r.path}><code>{r.path}</code><strong>{r.count}</strong></li>
                ))}
              </ol>
            )
          }
        </ChartCard>
      </div>
    </>
  )
}
