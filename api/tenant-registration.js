// API Endpoint: /api/tenant-registration
// Handles new tenant registration form submissions
// Room number removed - tenant assigned to room later

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract form data from request body
    const {
      full_name,
      phone_number,
      aadhaar_number,
      native_place,
      occupation,
      check_in_date
    } = req.body;

    console.log('📥 New tenant registration:', { full_name, phone_number });

    // Validate required fields
    if (!full_name || !phone_number) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['full_name', 'phone_number']
      });
    }

    // Fixed property ID for Yash Stayz
    const property_id = 'f64d76cd-71d1-489d-a4ab-9556e33fb60c';

    // Room will be assigned later by admin, so room_id is null
    const room_id = null;

    // Insert tenant into Supabase
    const { data: tenantData, error: tenantError } = await supabase
      .from('tenants')
      .insert([{
        property_id,
        room_id,
        full_name,
        phone_number,
        aadhaar_number,
        native_place,
        occupation,
        check_in_date: check_in_date || new Date().toISOString(),
        status: 'pending'
      }])
      .select();

    if (tenantError) {
      console.error('❌ Supabase insert error:', tenantError);
      return res.status(500).json({ error: 'Failed to save tenant data' });
    }

    console.log('✅ Tenant saved to Supabase:', tenantData);

    // Send Slack notification
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    
    if (slackWebhook) {
      const slackMessage = {
        text: "🏢 *New Tenant Registered!*",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "👤 New Tenant Registration",
              emoji: true
            }
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Name:*\n${full_name}`
              },
              {
                type: "mrkdwn",
                text: `*Phone:*\n${phone_number}`
              },
              {
                type: "mrkdwn",
                text: `*Occupation:*\n${occupation || 'Not provided'}`
              },
              {
                type: "mrkdwn",
                text: `*Check-in:*\n${check_in_date || 'Today'}`
              }
            ]
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Aadhaar:* ${aadhaar_number || 'Not provided'}\n*Native Place:* ${native_place || 'Not provided'}`
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "📍 *Status:* Pending Room Assignment"
            }
          },
          {
            type: "divider"
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "🏢 Yash Stayz Kondapur | Automated Registration System"
              }
            ]
          }
        ]
      };

      try {
        const slackResponse = await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackMessage)
        });

        if (slackResponse.ok) {
          console.log('✅ Slack notification sent');
        } else {
          console.error('❌ Slack notification failed:', slackResponse.status);
        }
      } catch (slackError) {
        console.error('❌ Slack error:', slackError);
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Tenant registered successfully',
      tenant_id: tenantData[0].id,
      status: 'pending_room_assignment'
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
