export const mapData = {
    ngawonggo: {
        bounds: {
            north: -7.4850,
            south: -7.5000,
            east: 110.2300,
            west: 110.2150
        },
        center: { lat: -7.4912, lng: 110.2223 },
        maxDistance: 5 // km
    },
    kaliangkrik: {
        bounds: {
            north: -7.4000,
            south: -7.5000,
            east: 110.2000,
            west: 110.1000
        },
        center: { lat: -7.4658, lng: 110.1555 },
        maxDistance: 20 // km
    },
    magelang: {
        bounds: {
            north: -7.3000,
            south: -7.7000,
            east: 110.4000,
            west: 110.1000
        },
        center: { lat: -7.5028, lng: 110.2245 },
        maxDistance: 50 // km
    },
    jateng: {
        bounds: {
            north: -6.5000,
            south: -8.3000,
            east: 111.7000,
            west: 108.5000
        },
        center: { lat: -7.1509, lng: 110.1402 },
        maxDistance: 500 // km
    }
};

export const getRandomLocationInBounds = (bounds) => {
    const lat = Math.random() * (bounds.north - bounds.south) + bounds.south;
    const lng = Math.random() * (bounds.east - bounds.west) + bounds.west;
    return { lat, lng };
};
