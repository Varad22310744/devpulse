function TopRepos({ stats }) {
    // Count commits per repo across all days
    const getTopRepos = () => {
        const repoCounts = {}

        stats.forEach(day => {
            if (day.reposActive && day.reposActive.length > 0) {
                day.reposActive.forEach(repo => {
                    repoCounts[repo] = (repoCounts[repo] || 0) + 1  // count active days not commits
                })
            }
        })

        return Object.entries(repoCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, activeDays]) => ({ name, activeDays }))
    }
    const topRepos = getTopRepos()

    if (topRepos.length === 0) return null

    const maxCommits = topRepos[0]?.activeDays || 1

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
                Most Active Repos
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {topRepos.map((repo, index) => (
                    <div key={index}>

                        {/* Repo name + commit count */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '6px'
                        }}>
                            <a
                                href={`https://github.com/Varad22310744/${repo.name}`}
                                target='_blank'
                                rel='noreferrer'
                                style={{
                                    color: '#58a6ff',
                                    fontSize: '0.9rem',
                                    textDecoration: 'none'
                                }}
                            >
                                {repo.name}
                            </a>
                            <span style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                                {repo.activeDays} active {repo.activeDays === 1 ? 'day' : 'days'}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div style={{
                            backgroundColor: '#21262d',
                            borderRadius: '4px',
                            height: '6px',
                            width: '100%'
                        }}>
                            <div style={{
                                backgroundColor: '#238636',
                                borderRadius: '4px',
                                height: '6px',
                                width: `${(repo.activeDays / maxCommits) * 100}%`,
                                transition: 'width 0.3s ease'
                            }} />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopRepos