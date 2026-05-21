function HeatMap({ stats }) {
    // Build last 30 days array
    const getDays = () => {
        const days = []
        for (let i = 29; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)

            // Find matching stat
            const stat = stats.find(s => {
                const statDate = new Date(s.date)
                statDate.setHours(0, 0, 0, 0)
                return statDate.getTime() === date.getTime()
            })

            days.push({
                date: date,
                commits: stat?.commits || 0
            })
        }
        return days
    }

    // Color based on commit count
    const getColor = (commits) => {
        if (commits === 0) return '#161b22'
        if (commits <= 2) return '#0e4429'
        if (commits <= 5) return '#006d32'
        if (commits <= 10) return '#26a641'
        return '#39d353'
    }

    const days = getDays()

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
                marginBottom: '16px',
                fontSize: '1rem'
            }}>
                Contribution Activity
            </h3>

            {/* Heatmap grid */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px'
            }}>
                {days.map((day, index) => (
                    <div
                        key={index}
                        title={`${day.date.toDateString()} — ${day.commits} commits`}
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '2px',
                            backgroundColor: getColor(day.commits),
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '12px'
            }}>
                <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                    Less
                </span>
                {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map(
                    (color, i) => (
                        <div
                            key={i}
                            style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: '2px',
                                backgroundColor: color
                            }}
                        />
                    )
                )}
                <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                    More
                </span>
            </div>

        </div>
    )
}

export default HeatMap