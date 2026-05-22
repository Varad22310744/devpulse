import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'
function Report({ user }) {
    const [report, setReport] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailLoading, setEmailLoading] = useState(false)
    const [emailMsg, setEmailMsg] = useState('')

    const handleGetReport = async () => {
        setLoading(true)
        setReport('')
        try {
            const res = await axios.get(
                `${API}/api/report/weekly`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            setReport(res.data.report)
        } catch (error) {
            setReport('Failed to generate report. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSendEmail = async () => {
        setEmailLoading(true)
        setEmailMsg('')
        try {
            const res = await axios.post(
                `${API}/api/report/email`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            setEmailMsg(res.data.message)
        } catch (error) {
            setEmailMsg('Failed to send email. Try again.')
        } finally {
            setEmailLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#0d1117' }}>
            <Navbar user={user} />

            <div style={{
                padding: '30px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>

                {/* Header */}
                <h2 style={{ color: '#e6edf3', marginBottom: '8px' }}>
                    Weekly AI Report
                </h2>
                <p style={{ color: '#8b949e', marginBottom: '30px' }}>
                    AI generated summary of your GitHub activity this week.
                </p>

                {/* Generate Button */}
                <button
                    onClick={handleGetReport}
                    disabled={loading}
                    style={{
                        backgroundColor: '#1f6feb',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        fontSize: '0.95rem',
                        marginRight: '12px'
                    }}
                >
                    {loading ? 'Generating...' : 'Generate Report'}
                </button>

                {/* Email Button — only show after report generated */}
                {report && (
                    <button
                        onClick={handleSendEmail}
                        disabled={emailLoading}
                        style={{
                            backgroundColor: '#238636',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: emailLoading ? 'not-allowed' : 'pointer',
                            opacity: emailLoading ? 0.7 : 1,
                            fontSize: '0.95rem'
                        }}
                    >
                        {emailLoading ? 'Sending...' : 'Send to Email'}
                    </button>
                )}

                {/* Email status message */}
                {emailMsg && (
                    <p style={{
                        marginTop: '12px',
                        color: emailMsg.includes('Failed') ? '#f78166' : '#3fb950',
                        fontSize: '0.9rem'
                    }}>
                        {emailMsg}
                    </p>
                )}

                {/* Report Display */}
                {loading && (
                    <div style={{
                        marginTop: '30px',
                        color: '#8b949e',
                        fontSize: '0.95rem'
                    }}>
                        Analyzing your GitHub activity...
                    </div>
                )}

                {report && (
                    <div style={{
                        marginTop: '30px',
                        backgroundColor: '#161b22',
                        border: '1px solid #30363d',
                        borderLeft: '4px solid #1f6feb',
                        borderRadius: '10px',
                        padding: '24px',
                        color: '#e6edf3',
                        lineHeight: '1.8',
                        fontSize: '0.95rem',
                        whiteSpace: 'pre-wrap'
                    }}>
                        <p style={{
                            color: '#8b949e',
                            fontSize: '0.8rem',
                            marginBottom: '16px'
                        }}>
                            🤖 Generated by Gemini AI
                        </p>
                        {report}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Report