function Home() {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/github'
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '20px'
        }}>

            {/* Logo */}
            <h1 style={{ fontSize: '3rem', color: '#58a6ff' }}>
                DevPulse
            </h1>

            {/* Tagline */}
            <p style={{ color: '#8b949e', fontSize: '1.1rem' }}>
                Track your GitHub productivity. Get AI insights.
            </p>

            {/* Login Button */}
            <button
                onClick={handleLogin}
                style={{
                    backgroundColor: '#238636',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginTop: '10px'
                }}
            >
                Login with GitHub
            </button>

        </div>
    )
}

export default Home