import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

const COLORS = [
    '#58a6ff', '#3fb950', '#f78166',
    '#d2a8ff', '#ffa657', '#79c0ff'
]

function LanguageChart({ data }) {
    // Convert { JavaScript: 70, Python: 30 } to recharts format
    const chartData = Object.entries(data).map(([name, value]) => ({
        name,
        value
    }))

    return (
        <div style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '10px',
            padding: '24px',
            marginTop: '24px'
        }}>
            <h3 style={{
                color: '#e6edf3',
                marginBottom: '20px',
                fontSize: '1rem'
            }}>
                Language Breakdown
            </h3>

            <ResponsiveContainer width='100%' height={250}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx='50%'
                        cy='50%'
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey='value'
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1c2128',
                            border: '1px solid #30363d',
                            borderRadius: '6px',
                            color: '#e6edf3'
                        }}
                        formatter={(value) => [`${value}%`, 'Usage']}
                    />
                    <Legend
                        formatter={(value) => (
                            <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default LanguageChart