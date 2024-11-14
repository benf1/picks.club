export default function UserPage({ params }) {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '24px',
        marginBottom: '20px'
      }}>
        Picks by {params.username}
      </h1>
      
      <div style={{ 
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        <div style={{ 
          padding: '20px',
          border: '1px solid #333',
          borderRadius: '8px',
          backgroundColor: '#111'
        }}>
          Picks will appear here soon
        </div>
      </div>
    </div>
  );
}
