import { useNavigate } from 'react-router-dom'

function Navbar({ user }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        window.location.href = 'http://localhost:5000/api/auth/logout'
    }

    return (
        <nav style={{
            backgroundColor: '#161b22',
            borderBottom: '1px solid #30363d',
            padding: '12px 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            {/* Logo */}
            <h2
                onClick={() => navigate('/dashboard')}
                style={{
                    color: '#58a6ff',
                    cursor: 'pointer',
                    fontSize: '1.4rem'
                }}
            >
                DevPulse
            </h2>

            {/* Right side */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
            }}>
                {/* Report link */}
                <span
                    onClick={() => navigate('/report')}
                    style={{
                        color: '#8b949e',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Weekly Report
                </span>

                {/* Avatar */}
                <img
                    src={user.avatar}
                    alt={user.username}
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%'
                    }}
                />

                {/* Username */}
                <span style={{ color: '#e6edf3', fontSize: '0.9rem' }}>
                    {user.username}
                </span>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #30363d',
                        color: '#8b949e',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}

export default Navbar