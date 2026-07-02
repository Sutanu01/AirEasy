interface BookingConfirmationData {
  bookingId: number;
  pnr: string;
  flightId: number;
  noOfSeats: number;
  totalCost: number;
}

export function getBookingConfirmationTemplate(data: BookingConfirmationData): string {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; margin-bottom: 20px;">
        <h2 style="color: #4CAF50; margin: 0; font-size: 24px;">Booking Confirmed!</h2>
        <p style="color: #666; margin: 5px 0 0 0;">Thank you for choosing Airline Services</p>
      </div>
      <p style="font-size: 16px; color: #333; line-height: 1.5;">Dear Customer,</p>
      <p style="font-size: 15px; color: #555; line-height: 1.5;">We are pleased to confirm your flight reservation. Your ticket summary is outlined below:</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <th style="padding: 8px 0; text-align: left; color: #777; font-size: 14px; border-bottom: 1px solid #eee;">PNR Code</th>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; font-size: 15px; border-bottom: 1px solid #eee;">${data.pnr}</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; text-align: left; color: #777; font-size: 14px; border-bottom: 1px solid #eee;">Booking ID</th>
            <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px; border-bottom: 1px solid #eee;">#${data.bookingId}</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; text-align: left; color: #777; font-size: 14px; border-bottom: 1px solid #eee;">Flight ID</th>
            <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px; border-bottom: 1px solid #eee;">${data.flightId}</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; text-align: left; color: #777; font-size: 14px; border-bottom: 1px solid #eee;">Seats Reserved</th>
            <td style="padding: 8px 0; text-align: right; color: #333; font-size: 14px; border-bottom: 1px solid #eee;">${data.noOfSeats}</td>
          </tr>
          <tr>
            <th style="padding: 8px 0; text-align: left; color: #777; font-size: 14px; padding-top: 12px;">Total Charge</th>
            <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #2196F3; font-size: 18px; padding-top: 12px;">INR ${data.totalCost}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
        This is an automated transaction confirmation. Please do not reply directly to this email.
      </div>
    </div>
  `;
}
