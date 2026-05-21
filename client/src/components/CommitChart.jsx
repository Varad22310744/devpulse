import {
    Line,
    LineChart,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts'

function CommitChart({ data }) {
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
                Commits — Last 30 Days
            </h3>

            <ResponsiveContainer width='100%' height={250}>
                <LineChart data={data}>
                    <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='#21262d'
                    />
                    <XAxis
                        dataKey='date'
                        stroke='#8b949e'
                        fontSize={11}
                        tickLine={false}
                    />
                    <YAxis
                        stroke='#8b949e'
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1c2128',
                            border: '1px solid #30363d',
                            borderRadius: '6px',
                            color: '#e6edf3'
                        }}
                    />
                    <Line
                        type='monotone'
                        dataKey='commits'
                        stroke='#58a6ff'
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#58a6ff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CommitChart