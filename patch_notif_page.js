const fs = require('fs');
let content = fs.readFileSync('src/views/PortalPage/NotifikasiPage/index.js', 'utf8');

// Add a test notification button that actually triggers a push notification
content = content.replace('Aktifkan Push Notif\n                </Button>', 'Aktifkan Push Notif\n                </Button>\n                <Button size="sm" colorScheme="purple" variant="outline" onClick={() => {\n                    if (Notification.permission === "granted") {\n                        new Notification("Test Notifikasi", { body: "Push notifikasi kamu berfungsi dengan baik!" });\n                    } else {\n                        alert("Izinkan notifikasi terlebih dahulu!");\n                    }\n                }}>\n                    Test Push Notif\n                </Button>');

fs.writeFileSync('src/views/PortalPage/NotifikasiPage/index.js', content);
