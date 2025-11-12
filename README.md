# AR Statistics Visualization

Aplikasi Web AR untuk visualisasi data statistik dalam 3D menggunakan A-Frame dan WebXR.

## 🚀 Features

- ✨ Markerless AR (WebXR)
- 📊 Bar Chart 3D
- 🥧 Pie Chart 3D
- 📈 Histogram 3D
- 📱 Mobile-friendly
- 🎮 Interactive gestures
- 🐳 Docker ready

## 📋 Prerequisites

- Docker & Docker Compose
- Modern browser dengan WebXR support:
  - Chrome/Edge di Android (ARCore devices)
  - Safari di iOS 13+ (ARKit devices)

## 🛠️ Installation & Usage

### Menggunakan Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone <repository-url>
cd ar-stats-simple

# 2. Build dan run container
docker-compose up -d

# 3. Akses aplikasi
# Browser: http://localhost:8080
```

### Menggunakan Docker (Manual)

```bash
# 1. Build image
docker build -t ar-stats-app .

# 2. Run container
docker run -d -p 8080:80 --name ar-stats ar-stats-app

# 3. Akses aplikasi
# Browser: http://localhost:8080
```

### Development Mode (dengan hot reload)

```bash
# Run dengan volume mounting untuk auto-reload
docker-compose up

# Edit file index.html, ar.html, style.css, atau app.js
# Refresh browser untuk lihat perubahan
```

## 📱 Cara Menggunakan Aplikasi

1. **Input Data**
   - Buka http://localhost:8080
   - Pilih jenis chart (Bar/Pie/Histogram)
   - Masukkan data (labels dan values)
   - Klik "Launch AR"

2. **AR View**
   - Izinkan akses kamera
   - Arahkan kamera ke permukaan datar
   - Lihat reticle (lingkaran putih)
   - Tap untuk place chart
   - Gunakan gestures untuk interaksi

3. **Gestures**
   - **Pinch**: Scale chart
   - **Swipe**: Rotate chart
   - **Tap**: Select/interact
   - **Double tap**: Reset

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after changes
docker-compose up -d --build

# Remove volumes
docker-compose down -v
```

## 🔧 Configuration

Edit `nginx.conf` untuk konfigurasi server atau security headers.

Edit `docker-compose.yml` untuk:
- Change port: ubah `"8080:80"` ke port yang diinginkan
- Add environment variables
- Modify volume mappings

## 📊 Sample Data Format

```json
{
  "type": "bar",
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "values": [45, 67, 82, 91],
  "colors": ["#4A90E2", "#E94B3C", "#6BCF7F", "#F5A623"]
}
```

## 🌐 Browser Compatibility

| Browser | Platform | Support |
|---------|----------|---------|
| Chrome 79+ | Android (ARCore) | ✅ Full |
| Safari 13+ | iOS (ARKit) | ✅ Full |
| Firefox | Mobile | ⚠️ Limited |
| Desktop Browsers | All | ❌ No AR |

## 🔒 Security Notes

- HTTPS required untuk WebXR di production
- Camera permission diperlukan
- CORS headers sudah dikonfigurasi
- Permissions Policy untuk sensor access

## 📝 License

MIT License

## 👨‍💻 Author

Your Name

## 🤝 Contributing

Pull requests are welcome!

## 📧 Support

Jika ada masalah, buat issue di repository ini.