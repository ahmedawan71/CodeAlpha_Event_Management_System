import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Create axios instance with proper configuration
    const api = React.useMemo(() => {
        const instance = axios.create({
            baseURL: 'http://localhost:5000/api',
        });

        // Add request interceptor to include token
        instance.interceptors.request.use((config) => {
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                config.headers.Authorization = currentToken;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        // Add response interceptor to handle token expiration
        instance.interceptors.response.use((response) => {
            return response;
        }, (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setToken(null);
                setMessage('Session expired. Please login again.');
            }
            return Promise.reject(error);
        });

        return instance;
    }, []);

    useEffect(() => {
        if (token) {
            fetchEvents();
            fetchRegistrations();
        }
    }, [token]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error('Error fetching events:', err);
            setMessage('Error fetching events: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            // FIXED: Updated the API endpoint path
            const res = await api.get('/events/registrations/my');
            setRegistrations(res.data);
        } catch (err) {
            console.error('Error fetching registrations:', err);
            setMessage('Error fetching registrations: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setMessage('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/auth/login', { 
                email, 
                password 
            });
            
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            setMessage('Successfully logged in!');
            setEmail('');
            setPassword('');
        } catch (err) {
            console.error('Login error:', err);
            setMessage('Login failed: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterEvent = async (eventId) => {
        try {
            setLoading(true);
            // FIXED: Updated the API endpoint path
            await api.post(`/events/${eventId}/register`);
            setMessage('Successfully registered for event!');
            fetchRegistrations(); // Refresh registrations
        } catch (err) {
            console.error('Registration error:', err);
            setMessage('Registration failed: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (regId) => {
        try {
            setLoading(true);
            // FIXED: Updated the API endpoint path
            await api.delete(`/events/registrations/${regId}`);
            setMessage('Registration cancelled successfully!');
            fetchRegistrations(); // Refresh registrations
        } catch (err) {
            console.error('Cancel error:', err);
            setMessage('Cancel failed: ' + (err.response?.data?.msg || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setEvents([]);
        setRegistrations([]);
        setMessage('Logged out successfully');
    };

    if (!token) {
        return (
            <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <h2>Event Registration System</h2>
                <h3>Login</h3>
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email"
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password"
                            required
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                {message && (
                    <p style={{ 
                        color: message.includes('Success') ? 'green' : 'red',
                        marginTop: '10px'
                    }}>
                        {message}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Event Registration System</h2>
                <button 
                    onClick={handleLogout}
                    style={{ 
                        padding: '8px 16px', 
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>

            <h3>Available Events</h3>
            {loading && <p>Loading...</p>}
            {events.length === 0 ? (
                <p>No events available.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {events.map(event => (
                        <li key={event._id} style={{ 
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            marginBottom: '10px',
                            borderRadius: '4px'
                        }}>
                            <h4>{event.title}</h4>
                            {event.description && <p>{event.description}</p>}
                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                            <button 
                                onClick={() => handleRegisterEvent(event._id)}
                                disabled={loading}
                                style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Register
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <h3>My Registrations</h3>
            {registrations.length === 0 ? (
                <p>No registrations found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {registrations.map(reg => (
                        <li key={reg._id} style={{ 
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            marginBottom: '10px',
                            borderRadius: '4px',
                            backgroundColor: '#f8f9fa'
                        }}>
                            <h4>{reg.event?.title || 'Event Title Not Available'}</h4>
                            {reg.event?.description && <p>{reg.event.description}</p>}
                            {reg.event?.date && (
                                <p><strong>Date:</strong> {new Date(reg.event.date).toLocaleDateString()}</p>
                            )}
                            <button 
                                onClick={() => handleCancel(reg._id)}
                                disabled={loading}
                                style={{ 
                                    padding: '8px 16px', 
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Cancel Registration
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {message && (
                <div style={{ 
                    padding: '10px', 
                    margin: '10px 0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: message.includes('Success') || message.includes('successfully') ? '#d4edda' : '#f8d7da',
                    color: message.includes('Success') || message.includes('successfully') ? '#155724' : '#721c24'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default App;