// API Endpoint: /api/room-services
// Handles complaint reports and rent payment submissions

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
    // Extract form data
    const {
      room_number,
      your_name,
      action_type, // "Report an Issue" or "Submit Rent Payment"
      
      // Issue fields
      issue_type,
      priority,
      description,
      
      // Payment fields
      rent_amount,
      payment_date,
      payment_screenshot_url
    } = req.body;

    console.log('📥 Room service request:', { room_number, action_type });

    // Validate required fields
    if (!room_number || !your_name || !action_type) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['room_number', 'your_name', 'action_type']
      });
    }

    // Fixed property ID
    const property_id = 'f64d76cd-71d1-489d-a4ab-9556e33fb60c';

    // Look up room_id from room number
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('id')
      .eq('room_number', room_number)
      .eq('property_id', property_id)
      .single();

    if (roomError || !roomData) {
      console.error('❌ Room not found:', room_number);
      return res.status(404).json({ error: `Room ${room_number} not found` });
    }

    const room_id = roomData.id;

    // Branch based on action type
    if (action_type.includes('Report an Issue') || action_type.includes('Report')) {
      return await handleComplaint(req, res, {
        room_id,
        room_number,
        property_id,
        your_name,
        issue_type,
        priority,
        description
      });
    } 
    else if (action_type.includes('Submit Rent Payment') || action_type.includes('Payment')) {
      return await handlePayment(req, res, {
        room_id,
        room_number,
        property_id,
        your_name,
        rent_amount,
        payment_date,
        payment_screenshot_url
      });
    }
    else {
      return res.status(400).json({ error: 'Invalid action type' });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

// Handle complaint submission
async function handleComplaint(req, res, data) {
  const { room_id, room_number, property_id, your_name, issue_type, priority, description } = data;

  console.log('🔧 Processing complaint:', { room_number, issue_type });

  // Validate complaint fields
  if (!issue_type || !priority || !description) {
    return res.status(400).json({ 
      error: 'Missing complaint fields',
      required: ['issue_type', 'priority', 'description']
    });
  }

  // Insert complaint into Supabase
  const { data: complaintData, error: complaintError } = await supabase
    .from('complaints')
    .insert([{
      property_id,
      room_id,
      issue_type,
      priority,
      description,
      status: 'Open',
      reported_by: your_name
    }])
    .select();

  if (complaintError) {
    console.error('❌ Supabase insert error:', complaintError);
    return res.status(500).json({ error: 'Failed to save complaint' });
  }

  console.log('✅ Complaint saved to Supabase');

  // Send Slack notification
  await sendSlackNotification({
    type: 'complaint',
    room_number,
    your_name,
    issue_type,
    priority,
    description
  });

  return res.status(200).json({
    success: true,
    message: 'Complaint registered successfully',
    complaint_id: complaintData[0].id
  });
}

// Handle payment submission
async function handlePayment(req, res, data) {
  const { room_id, room_number, property_id, your_name, rent_amount, payment_date, payment_screenshot_url } = data;

  console.log('💰 Processing payment:', { room_number, rent_amount });

  // Validate payment fields
  if (!rent_amount || !payment_date) {
    return res.status(400).json({ 
      error: 'Missing payment fields',
      required: ['rent_amount', 'payment_date']
    });
  }

  // Insert payment into Supabase
  const { data: paymentData, error: paymentError } = await supabase
    .from('payments')
    .insert([{
      property_id,
      room_id,
      amount: parseFloat(rent_amount),
      payment_date,
      screenshot_url: payment_screenshot_url,
      status: 'Pending',
      submitted_by: your_name
    }])
    .select();

  if (paymentError) {
    console.error('❌ Supabase insert error:', paymentError);
    return res.status(500).json({ error: 'Failed to save payment' });
  }

  console.log('✅ Payment saved to Supabase');

  // Send Slack notification
  await sendSlackNotification({
    type: 'payment',
    room_number,
    your_name,
    rent_amount,
    payment_date,
    payment_screenshot_url
  });

  return res.status(200).json({
    success: true,
    message: 'Payment submitted successfully',
    payment_id: paymentData[0].id
  });
}

// Send Slack notifications
async function sendSlackNotification(data) {
  const slackWebhook = process.env.SLACK_WEBHOOK_URL;
  
  if (!slackWebhook) {
    console.log('⚠️ Slack webhook not configured');
    return;
  }

  let slackMessage;

  if (data.type === 'complaint') {
    // Determine priority emoji
    let priorityEmoji = '🟢';
    if (data.priority.includes('High') || data.priority.includes('high')) priorityEmoji = '🟠';
    if (data.priority.includes('Urgent') || data.priority.includes('urgent')) priorityEmoji = '🔴';
    if (data.priority.includes('Medium') || data.priority.includes('medium')) priorityEmoji = '🟡';

    slackMessage = {
      text: "🔧 *New Issue Reported!*",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `🔧 Issue Reported - Room ${data.room_number}`,
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Room:*\n${data.room_number}`
            },
            {
              type: "mrkdwn",
              text: `*Issue Type:*\n${data.issue_type}`
            },
            {
              type: "mrkdwn",
              text: `*Priority:*\n${priorityEmoji} ${data.priority}`
            },
            {
              type: "mrkdwn",
              text: `*Reported By:*\n${data.your_name}`
            }
          ]
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Description:*\n${data.description}`
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
              text: "🏢 Yash Stayz Kondapur | Issue Tracking System"
            }
          ]
        }
      ]
    };
  } else if (data.type === 'payment') {
    slackMessage = {
      text: "💰 *Rent Payment Submitted!*",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `💰 Payment Submitted - Room ${data.room_number}`,
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Room:*\n${data.room_number}`
            },
            {
              type: "mrkdwn",
              text: `*Amount:*\n₹${data.rent_amount}`
            },
            {
              type: "mrkdwn",
              text: `*Date:*\n${data.payment_date}`
            },
            {
              type: "mrkdwn",
              text: `*Submitted By:*\n${data.your_name}`
            }
          ]
        }
      ]
    };

    // Add screenshot link if available
    if (data.payment_screenshot_url) {
      slackMessage.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `🔗 <${data.payment_screenshot_url}|View Payment Screenshot>`
        }
      });
    }

    slackMessage.blocks.push(
      {
        type: "divider"
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "⚠️ *Action Required:* Please verify the payment screenshot | 🏢 Yash Stayz Kondapur"
          }
        ]
      }
    );
  }

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
  } catch (error) {
    console.error('❌ Slack error:', error);
  }
}
