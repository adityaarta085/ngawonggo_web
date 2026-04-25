// Mock data for locations in different maps
// Would ideally come from Supabase or JSON file
export const mapData = {
    ngawonggo: {
        center: { lat: -7.4912, lng: 110.2223 },
        locations: [
            { lat: -7.4912, lng: 110.2223, desc: 'Balai Desa Ngawonggo' },
            { lat: -7.4890, lng: 110.2200, desc: 'Jalan Utama Dusun' }
        ]
    },
    kaliangkrik: {
        center: { lat: -7.4658, lng: 110.1555 },
        locations: [
            { lat: -7.4658, lng: 110.1555, desc: 'Pasar Kaliangkrik' },
            { lat: -7.4500, lng: 110.1600, desc: 'Nepal Van Java' }
        ]
    },
    magelang: {
        center: { lat: -7.5028, lng: 110.2245 },
        locations: [
            { lat: -7.6056, lng: 110.2038, desc: 'Candi Borobudur' },
            { lat: -7.5028, lng: 110.2245, desc: 'Alun-alun Magelang' }
        ]
    },
    jateng: {
        center: { lat: -7.1509, lng: 110.1402 },
        locations: [
            { lat: -6.9932, lng: 110.4203, desc: 'Lawang Sewu, Semarang' },
            { lat: -7.5816, lng: 110.8252, desc: 'Keraton Surakarta' }
        ]
    }
};

export const getRandomLocation = (mapId) => {
    const map = mapData[mapId] || mapData['ngawonggo'];
    const locs = map.locations;
    return locs[Math.floor(Math.random() * locs.length)];
};
