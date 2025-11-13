
import { NextResponse } from 'next/server';
import ical from 'node-ical';

const ICAL_URL = 'https://calendar.google.com/calendar/ical/en.indian%23holiday%40group.v.calendar.google.com/public/basic.ics';
const NUMBER_OF_HOLIDAYS = 5;

// Keywords to identify official public holidays
const HOLIDAY_KEYWORDS = ['gazetted holiday', 'public holiday'];

export async function GET() {
  try {
    const events = await ical.async.fromURL(ICAL_URL);
    const now = new Date();
    
    const upcomingHolidays = Object.values(events)
      .filter(event => {
        if (event.type !== 'VEVENT' || !event.start || new Date(event.start) < now) {
          return false;
        }
        // The Google calendar doesn't have descriptions, so we'll treat all events as holidays for now.
        // If more filtering is needed, the logic can be adjusted here.
        return true;
      })
      .sort((a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime())
      .slice(0, NUMBER_OF_HOLIDAYS)
      .map(event => ({
        name: event.summary,
        date: new Date(event.start!).toISOString(),
      }));

    return NextResponse.json({ holidays: upcomingHolidays });
  } catch (error) {
    console.error('Failed to fetch or parse iCal data:', error);
    return NextResponse.json({ error: 'Failed to retrieve holiday data.' }, { status: 500 });
  }
}
