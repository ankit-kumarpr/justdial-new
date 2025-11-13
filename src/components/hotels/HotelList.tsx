
import { hotelListData } from '@/lib/hotel-data';
import { HotelListItem } from './HotelListItem';

export function HotelList() {
    return (
        <div className="space-y-4">
            {hotelListData.map(hotel => (
                <HotelListItem key={hotel.id} hotel={hotel} />
            ))}
        </div>
    );
}
