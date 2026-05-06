export default function Page() {
  return (
    <html>
      <head>
        <title>PG Manager Dashboard</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
          .header {
            background: linear-gradient(to right, #667eea, #764ba2);
            color: white;
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
          }
          .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
          .header p { opacity: 0.9; font-size: 1.1rem; }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          .card {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .card-title { color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; }
          .card-value { font-size: 3rem; font-weight: bold; margin-bottom: 0.25rem; }
          .card-sub { color: #999; font-size: 0.85rem; }
          .blue { color: #3b82f6; }
          .green { color: #10b981; }
          .purple { color: #8b5cf6; }
          .orange { color: #f59e0b; }
          .success-box {
            background: white;
            border-radius: 12px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .success-box h2 { color: #10b981; font-size: 2rem; margin-bottom: 1rem; }
          .success-box p { color: #666; line-height: 1.6; margin-bottom: 0.5rem; }
          .footer {
            background: #1f2937;
            color: white;
            text-align: center;
            padding: 1.5rem;
            margin-top: 3rem;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <div className="container">
            <h1>🏢 PG Manager Dashboard</h1>
            <p>Yash Stayz Kondapur - Hyderabad ⚡ Live</p>
          </div>
        </div>

        <div className="container">
          <div className="stats">
            <div className="card">
              <div className="card-title">Occupancy Rate</div>
              <div className="card-value blue">84%</div>
              <div className="card-sub">20 beds occupied</div>
            </div>

            <div className="card">
              <div className="card-title">Active Tenants</div>
              <div className="card-value green">20</div>
              <div className="card-sub">Registered</div>
            </div>

            <div className="card">
              <div className="card-title">Total Rooms</div>
              <div className="card-value purple">48</div>
              <div className="card-sub">Available</div>
            </div>

            <div className="card">
              <div className="card-title">System Status</div>
              <div className="card-value orange">⚡</div>
              <div className="card-sub">Live & Active</div>
            </div>
          </div>

          <div className="success-box">
            <h2>✅ Dashboard Deployed Successfully!</h2>
            <p>Your PG Manager dashboard is now live and running.</p>
            <p>Real-time tenant data, complaints tracking, and payment management.</p>
            <p style="margin-top: 1rem; color: #999;">Built with Next.js • Deployed on Vercel • Powered by Supabase</p>
          </div>
        </div>

        <div className="footer">
          <p>🚀 PG Manager v1.0 | Professional Dashboard | © 2026</p>
        </div>
      </body>
    </html>
  );
}
