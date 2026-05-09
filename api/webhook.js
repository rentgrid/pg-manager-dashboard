import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const PROPERTY_ID = 'f64d76cd-71d1-489d-a4ab-9556e33fb60c';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { full_name, phone_number, aadhaar_number, native_place, occupation, check_in_date } = req.body;

    if (!full_name || !phone_number) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('tenants')
      .insert([{
        property_id: PROPERTY_ID,
        room_id: null,
        full_name,
        phone_number,
        aadhaar_number,
        native_place,
        occupation,
        check_in_date: check_in_date || new Date().toISOString(),
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Send Slack
    const slackMessage = {
      text: "🏢 *NEW TENANT REGISTERED!*",
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "👤 New Tenant Registration", emoji: true }
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Name:*\n${full_name}` },
            { type: "mrkdwn", text: `*Phone:*\n${phone_number}` },
            { type: "mrkdwn", text: `*Occupation:*\n${occupation || 'N/A'}` },
            { type: "mrkdwn", text: `*Check-in:*\n${check_in_date || 'Today'}` }
          ]
        },
        { type: "divider" },
        { type: "context", elements: [{ type: "mrkdwn", text: "🏢 Yash Stayz Kondapur" }] }
      ]
    };

    await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    });

    return res.status(200).json({ success: true, tenant_id: data[0].id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
