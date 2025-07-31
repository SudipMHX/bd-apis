# BD APIs – Bangladesh Geo Location API (v2)

A blazing fast, open-source REST API for accessing up-to-date administrative and geographical data of Bangladesh, including all divisions, districts, and upazilas (sub-districts). Ideal for developers building location-based apps, data explorers, or mapping tools.

---

## 🚀 Features

- **All Bangladesh Geo Data:** Divisions, districts, upazilas (495), unions (4550+ as of 2025)
- **Filter Support:** Get districts by division, upazilas by district, unions by upazila
- **Bilingual:** English and Bengali names for all entities
- **Developer Friendly:** Clean JSON responses, CORS enabled
- **Performance:** Built-in caching, rate limiting, and monitoring
- **Live API Explorer UI:** Test endpoints instantly in your browser
- **Open Source:** Free for personal and commercial use

### <p align="center"><a target="_blank" href="https://bdapis.vercel.app">VISIT BDAPIS</a></p>

## 📦 API Endpoints

All endpoints are prefixed with `/geo/v2.0`.

| Endpoint                         | Description                                |
| -------------------------------- | ------------------------------------------ |
| `/geo/v2.0/divisions`            | Get all divisions                          |
| `/geo/v2.0/districts`            | Get all districts                          |
| `/geo/v2.0/districts/{division}` | Get districts by division with ID          |
| `/geo/v2.0/upazilas`             | Get all upazilas (495 upazilas as of 2025) |
| `/geo/v2.0/upazilas/{district}`  | Get upazilas by district with ID           |
| `/geo/v2.0/unions/{upazila}`     | Get unions by upazila with ID              |
| `/geo/v2.0/search/{query}`       | Search divisions, districts, or upazilas   |

---

## 📝 Example Usage

Get all districts in the "Mymensingh" division:

```
GET /geo/v2.0/districts/8
```

Get all upazilas in the "Jamalpur" district:

```
GET /geo/v2.0/upazilas/63
```

Search for upazilas containing "jamal":

```
GET /geo/v2.0/search/jamal?type=upazilas
```

---

## 🗂️ Project Structure

```
bd-apis/
├── public/                     # Frontend (API Explorer UI)
│   ├── index.html
│   └── style.css
├── src/
│   ├── database/               # Data files (JSON, JS)
│   │   ├── data.js
│   │   └── json data
│   └── routes/
│   │   └── geo/
|   │      ├── geo              # v1 API routes
│   │      └── geo-v2.js        # v2 API routes
│   └── config/
│       └── indexes.js          # MongoDB indexes
├── index.js                    # Express server entry point
├── package.json
├── OPTIMIZATION.md             # Performance & deployment tips
└── README.md
```

---

## 📚 Data Sources

- All geo data is included in [`src/database/`](src/database/).
- Data includes both English and Bengali names.
- Upazila data is updated to include all **495 upazilas** of Bangladesh.
- Union data is updated to include all **4550+ unions** of Bangladesh.

---

## ⚡ Performance & Deployment

- Built with [Express.js](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/)
- Caching with [node-cache](https://www.npmjs.com/package/node-cache) and optional [Redis](https://redis.io/)
- Rate limiting, monitoring, and health endpoints included
- See [`OPTIMIZATION.md`](OPTIMIZATION.md) for best practices and troubleshooting

---

## 👤 Author

- [Mahatab Hossen Sudip](https://github.com/SudipMHX)

---

<div align="center">
    <img src="https://visitor-badge.laobi.icu/badge?page_id=bdapis.vercel.app">
    <p>Made with ❤️ | Always up-to-date with Bangladesh's administrative and geographical data</p>
</div>
