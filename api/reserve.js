import nodemailer from 'nodemailer';
import twilio from 'twilio';

let cachedTransporter = null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, date, time, guests, notes } = req.body;

  // 1. Configuration (These come from Environment Variables)
  const EMAIL_USER = process.env.EMAIL_USER; // Your Gmail address
  const EMAIL_PASS = process.env.EMAIL_PASS; // Your Gmail App Password
  
  // Twilio Config - Supports both Phone Number and Messaging Service
  const TWILIO_SID = process.env.TWILIO_SID;
  const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
  const TWILIO_PHONE = process.env.TWILIO_PHONE;
  const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID;
  
  // Owner Contact Info
  const OWNER_EMAIL = 'thecajunmenu@gmail.com';
  const OWNER_PHONE = '+16788997404';

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({ error: 'Missing EMAIL_USER or EMAIL_PASS in environment variables.' });
  }

  // Helper to format phone number to E.164 (assuming US)
  const formatPhone = (p) => {
    const cleaned = ('' + p).replace(/\D/g, '');
    return cleaned.length === 10 ? `+1${cleaned}` : p.startsWith('+') ? p : `+1${cleaned}`;
  };

  const customerPhone = formatPhone(phone);

  // 2. Generate ICS File Content (Calendar Event)
  // Format date/time for ICS (YYYYMMDDTHHMMSS)
  const startDateTime = new Date(`${date}T${time}`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const endDateTime = new Date(new Date(`${date}T${time}`).getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'; // 1 hour duration

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Cajun Menu//Reservations//EN
BEGIN:VEVENT
UID:${Date.now()}@thecajunmenu.site
DTSTAMP:${startDateTime}
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:Reservation: ${name} (${guests} Guests)
DESCRIPTION:Reservation for ${name}.\nPhone: ${phone}\nEmail: ${email}\nGuests: ${guests}\nNotes: ${notes || 'None'}
LOCATION:The Cajun Menu, 140 Keith Dr, Canton, GA 30114
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  try {
    const results = {
      email: { success: false, error: null },
      sms: { success: false, error: null }
    };

    // 3. Send Emails (Owner & Customer)
    try {
      if (!cachedTransporter) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
          },
        });
        cachedTransporter = transporter;
      }

      // Email to Owner and Customer (Parallel)
      await Promise.all([
        cachedTransporter.sendMail({
          from: `"Cajun Menu Bot" <${EMAIL_USER}>`,
          to: OWNER_EMAIL,
          subject: `🍽️ New Reservation: ${name} - ${date} @ ${time}`,
          text: `New reservation received!\n\nName: ${name}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nPhone: ${phone}\nEmail: ${email}\nNotes: ${notes || 'None'}\n\nAn event file (.ics) is attached. Click it to add to your calendar.`,
          attachments: [
            {
              filename: 'reservation.ics',
              content: icsContent,
              contentType: 'text/calendar',
            },
          ],
        }),
        cachedTransporter.sendMail({
          from: `"The Cajun Menu" <${EMAIL_USER}>`,
          to: email,
          subject: `✅ Reservation Confirmed: The Cajun Menu`,
          text: `Hi ${name},\n\nYour reservation for ${guests} people on ${date} at ${time} is confirmed!\n\nWe look forward to seeing you.\n\n📍 Location: 140 Keith Dr, Canton, GA 30114\n📞 Contact: (678) 899-7404\n\nWe've attached a calendar invite for your convenience.\n\nNotes: ${notes || 'None'}`,
          attachments: [
            {
              filename: 'reservation.ics',
              content: icsContent,
              contentType: 'text/calendar',
            },
          ],
        })
      ]);
      
      console.log('Emails sent successfully');
      results.email.success = true;
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      results.email.error = emailError.message;
    }

    // 4. Send SMS (Owner & Customer)
    if (TWILIO_SID && TWILIO_TOKEN && (TWILIO_PHONE || TWILIO_MESSAGING_SERVICE_SID)) {
      try {
        const client = twilio(TWILIO_SID, TWILIO_TOKEN);
        
        // Determine sender (Messaging Service takes priority if available)
        const messageOptions = {};
        if (TWILIO_MESSAGING_SERVICE_SID) {
            messageOptions.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
        } else {
            messageOptions.from = TWILIO_PHONE;
        }

        // SMS to Owner & Customer (Parallel)
        await Promise.all([
          client.messages.create({
            ...messageOptions,
            body: `🔥 New Reservation: ${name} (${guests} ppl) @ ${date} ${time}. Phone: ${phone}`,
            to: OWNER_PHONE,
          }),
          client.messages.create({
            ...messageOptions,
            body: `✅ The Cajun Menu: Your reservation for ${guests} on ${date} at ${time} is confirmed! See you soon! 🐊`,
            to: customerPhone,
          })
        ]);

        console.log('SMS sent successfully');
        results.sms.success = true;
      } catch (smsError) {
        console.error('SMS sending failed:', smsError);
        results.sms.error = smsError.message;
      }
    } else {
      console.log('Skipping SMS: Missing Twilio credentials');
      results.sms.error = 'Missing Environment Variables: TWILIO_SID, TWILIO_TOKEN, or TWILIO_PHONE/MESSAGING_SERVICE_SID';
    }

    return res.status(results.email.success || results.sms.success ? 200 : 500).json({ 
      success: results.email.success || results.sms.success, 
      message: 'Reservation processed',
      details: results 
    });

  } catch (error) {
    console.error('Error processing reservation:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
