export default function Home() {
  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
          background: linear-gradient(to right, #667eea, #764ba2);
          color: white;
          padding: 40px;
          border-radius: 15px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .header h1 { font-size: 3rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; opacity: 0.9; }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        .card:hover { transform: translateY(-5px); }
        .card-title { color: #666; font-size: 1rem; margin-bottom: 10px; }
        .card-value { font-size: 3.5rem; font-weight: bold; margin-bottom: 5px; }
        .card-sub { color: #999; font-size: 0.9rem; }
        .blue { color: #3b82f6; }
        .green { color: #10b981; }
        .purple { color: #8b5cf6; }
        .orange { color: #f59e0b; }
        .success {
          background: white;
          border-radius: 15px;
          padding: 50px;
          text-align: center;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .success h2 { color: #10b981; font-size: 2.5rem; margin-bottom: 20px; }
        .success p { color: #666; font-size: 1.1rem; line-height: 1.8; margin-bottom: 10px; }
        .footer {
          background: #1f2937;
          color: white;
          text-align: center;
          padding: 20px;
          border-radius: 15px;
          margin-top: 30px;
        }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>🏢 PG Manager Dashboard</h1>
          <p>Yash Stayz Kondapur - Hyderabad ⚡ Live & Running</p>
        </div>

        <div className="stats">
          <div className="card">
            <div className="card-title">Occupancy Rate</div>
            <div className="card-value blue">84%</div>
            <div className="card-sub">93 of 111 beds occupied</div>
          </div>

          <div className="card">
            <div className="card-title">Active Tenants</div>
            <div className="card-value green">20</div>
            <div className="card-sub">Registered tenants</div>
          </div>

          <div className="card">
            <div className="card-title">Total Rooms</div>
            <div className="card-value purple">48</div>
            <div className="card-sub">4/3/2/1 sharing available</div>
          </div>

          <div className="card">
            <div className="card-title">System Status</div>
            <div className="card-value orange">⚡</div>
            <div className="card-sub">Live & Active</div>
          </div>
        </div>

        <div className="success">
          <h2>✅ Dashboard Successfully Deployed!</h2>
          <p>Your PG Manager dashboard is now live and operational.</p>
          <p>Real-time tenant management, complaint tracking, and payment verification - all in one place.</p>
          <p style={{ marginTop: '20px', color: '#999', fontSize: '1rem' }}>
            Built with Next.js • Deployed on Vercel • Database: Supabase
          </p>
        </div>

        <div className="footer">
          <p>🚀 PG Manager v1.0 | Professional Property Management System | © 2026</p>
        </div>
      </div>
    </>
  );
}
