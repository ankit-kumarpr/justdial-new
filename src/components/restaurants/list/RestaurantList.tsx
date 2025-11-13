
import { restaurantListData } from '@/lib/restaurant-list-data';
import { RestaurantListItem } from './RestaurantListItem';

export function RestaurantList() {
    return (
        <div className="space-y-4">
            {restaurantListData.map(restaurant => (
                <RestaurantListItem key={restaurant.id} restaurant={restaurant} />
            ))}
        </div>
    );
}
