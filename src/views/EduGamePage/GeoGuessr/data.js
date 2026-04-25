// Mock data with free 360 panorama images and coordinates
export const mapData = {
    ngawonggo: {
        center: { lat: -7.4912, lng: 110.2223 },
        maxDistance: 5,
        locations: [
            { lat: -7.4912, lng: 110.2223, pano: 'https://images.unsplash.com/photo-1557971370-e7298ea473fc?q=80&w=2560&auto=format&fit=crop' },
            { lat: -7.4890, lng: 110.2200, pano: 'https://images.unsplash.com/photo-1623345805780-8f01f714e65f?q=80&w=2560&auto=format&fit=crop' }
        ]
    },
    kaliangkrik: {
        center: { lat: -7.4658, lng: 110.1555 },
        maxDistance: 20,
        locations: [
            { lat: -7.4658, lng: 110.1555, pano: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?q=80&w=2560&auto=format&fit=crop' }
        ]
    },
    magelang: {
        center: { lat: -7.5028, lng: 110.2245 },
        maxDistance: 50,
        locations: [
            { lat: -7.6056, lng: 110.2038, pano: 'https://images.unsplash.com/photo-1600804889194-e6fbf08ddb39?q=80&w=2560&auto=format&fit=crop' }
        ]
    },
    jateng: {
        center: { lat: -7.1509, lng: 110.1402 },
        maxDistance: 500,
        locations: [
            { lat: -6.9932, lng: 110.4203, pano: 'https://images.unsplash.com/photo-1574581297585-644917b1fb79?q=80&w=2560&auto=format&fit=crop' }
        ]
    }
};

export const getRandomLocation = (mapId) => {
    const map = mapData[mapId] || mapData['ngawonggo'];
    const locs = map.locations;
    return locs[Math.floor(Math.random() * locs.length)];
};
