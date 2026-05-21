function StatsCard({ title, value, subtitle, color }) {
    return (
        <div style={{
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '10px',
            padding: '24px',
            flex: 1,
            minWidth: '180px'
        }}>
            <p style={{
                color: '#8b949e',
                fontSize: '0.85rem',
                marginBottom: '8px'
            }}>
                {title}
            </p>
            <h2 style={{
                color: color || '#58a6ff',
                fontSize: '2rem',
                marginBottom: '4px'
            }}>
                {value}
            </h2>
            {subtitle && (
                <p style={{ color: '#8b949e', fontSize: '0.8rem' }}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}

export default StatsCard