interface Trip {
    pickups: string[];
    drops: string[];
    warehouse?: string;
}

const validateTrips = (pickups: Set<string>, drops: Set<string>, trips: Trip[]): boolean => {
    const pickupState = new Map<string, boolean>();
    const dropState = new Map<string, boolean>();

    // Initialize pickup and drop states
    pickups.forEach(pickup => pickupState.set(pickup, false));
    drops.forEach(drop => dropState.set(drop, false));
    
    for (const trip of trips) {
        // Validate and mark pickups
        for (const pickup of trip.pickups) {
            if (!pickupState.has(pickup) || pickupState.get(pickup)) {
                return false; // Invalid trip: pickup point is either not defined or already picked up
            }
            pickupState.set(pickup, true);
        }

        // Validate drops
        for (const drop of trip.drops) {
            if (!dropState.has(drop)) {
                return false; // Invalid trip: drop point is not defined
            }
            // Ensure that the drop point corresponds to a picked-up point
            let validDrop = false;
            for (const pickup of trip.pickups) {
                if (pickupState.get(pickup)) {
                    validDrop = true;
                    break;
                }
            }
            if (!validDrop) {
                return false; // Invalid trip: drop point does not correspond to a valid pickup
            }
            dropState.set(drop, true);
        }
    }

    // Check if all pickup points are picked up exactly once and all drop points are reached
    if (Array.from(pickupState.values()).includes(false) || Array.from(dropState.values()).includes(false)) {
        return false; // Not all pickups are used or not all drops are reached
    }

    return true;
};
