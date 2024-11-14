export default function UserPage({ params }) {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Picks by {params.username}</h1>
      <div>Picks will appear here</div>
    </div>
  );
}
