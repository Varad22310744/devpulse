import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import StatsCard from '../components/StatsCard'
import CommitChart from '../components/CommitChart'
import LanguageChart from '../components/LanguageChart'
import HeatMap from '../components/HeatMap'
import TopRepos from '../components/TopRepos'

const API = 'http://localhost:5000'

function Dashboard({ user }) {
    const [dashboard, setDashboard] = useState(null)
    const [commits, setCommits] = useState([])
    const [languages, setLanguages] = useState({})
    const [loading, setLoading] = useState(true)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        try {
            // Fetch all data in parallel
            const [dashRes, commitRes, langRes] = await Promise.all([
                axios.get(`${API}/api/stats/dashboard`, { withCredentials: true }),
                axios.get(`${API}/api/stats/commits`, { withCredentials: true }),
                axios.get(`${API}/api/stats/languages`, { withCredentials: true })
            ])

            setDashboard(dashRes.data)
            setCommits(commitRes.data)
            setLanguages(langRes.data)
        } catch (error) {
            console.error('Dashboard load error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFetch = async () => {
        setFetching(true)
        try {
            await axios.post(
                `${API}/api/stats/fetch`,
                {},
                { withCredentials: true }
            )
            await loadDashboard()
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setFetching(false)
        }
    }

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                color: '#8b949e'
            }}>
                Loading dashboard...
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0d1117' }}>
            <Navbar user={user} />

            <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <h2 style={{ color: '#e6edf3' }}>
                        Welcome back, {user.username} 👋
                    </h2>
                    <button
                        onClick={handleFetch}
                        disabled={fetching}
                        style={{
                            backgroundColor: '#238636',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: fetching ? 'not-allowed' : 'pointer',
                            opacity: fetching ? 0.7 : 1,
                            fontSize: '0.9rem'
                        }}
                    >
                        {fetching ? 'Fetching...' : 'Fetch Latest Stats'}
                    </button>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <StatsCard
                        title='Total Commits (30 days)'
                        value={dashboard?.totalCommits || 0}
                        color='#58a6ff'
                    />
                    <StatsCard
                        title='Current Streak'
                        value={`${dashboard?.streak || 0} days`}
                        color='#3fb950'
                    />
                    <StatsCard
                        title='Active Days'
                        value={`${dashboard?.activeDays || 0}/30`}
                        color='#f78166'
                    />
                    <StatsCard
                        title='PRs Opened'
                        value={dashboard?.totalPRs || 0}
                        color='#d2a8ff'
                    />
                </div>

                {/* Best Day */}
                {dashboard?.bestDay && (
                    <div style={{
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderRadius: '10px',
                        padding: '16px 24px',
                        marginTop: '24px',
                        color: '#8b949e',
                        fontSize: '0.9rem'
                    }}>
                        🏆 Best day —
                        <strong style={{ color: '#e6edf3' }}>
                            {' '}{new Date(dashboard.bestDay.date).toDateString()}
                        </strong>
                        {' '}with
                        <strong style={{ color: '#58a6ff' }}>
                            {' '}{dashboard.bestDay.commits} commits
                        </strong>
                    </div>
                )}
                {dashboard?.recentStats?.length > 0 && (
                    <HeatMap stats={dashboard.recentStats} />
                )}
                {dashboard?.recentStats?.length > 0 && (
                    <TopRepos stats={dashboard.recentStats} />
                )}
                {/* Charts */}
                {commits.length > 0 && <CommitChart data={commits} />}

                {Object.keys(languages).length > 0 && (
                    <LanguageChart data={languages} />
                )}

                {/* Empty state */}
                {commits.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '60px',
                        color: '#8b949e'
                    }}>
                        <p style={{ fontSize: '1.1rem' }}>No stats yet.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>
                            Click "Fetch Latest Stats" to load your GitHub activity.
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Dashboard