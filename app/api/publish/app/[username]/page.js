export default function UserPage({ params }) {
  // For now, just show a placeholder
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
        Picks by {params.username}
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {/* Later we'll show actual picks here */}
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ccc',
          borderRadius: '8px'
        }}>
          Picks will appear here
        </div>
      </div>
    </div>
  );
}
