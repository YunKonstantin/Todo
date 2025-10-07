import { useState, useEffect } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(() => new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px ',
    
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #ddd'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  };

  const timeStyle = {
    fontSize: '0.9rem',
    color: '#666',
    fontFamily: 'Courier New, monospace'
  };

  return (
    <header style={headerStyle}>
      <h3 style={titleStyle}>TODO by YunKonstantin</h3>
      <span style={timeStyle}>
        now : {currentTime.toLocaleTimeString()}
      </span>
    </header>
  );
}