# BD APIs – Bangladesh Geo Location API

A simple and fast REST API to access all divisions, districts, and upazilas of Bangladesh. Perfect for developers building location-based tools, apps, or data explorers.

## Features

- Get all divisions, districts, and upazilas of Bangladesh
- Filter districts by division
- Filter upazilas by district
- Bengali and English names included
- Developer-friendly JSON responses
- Live API Explorer UI

## API Endpoints

All endpoints are prefixed with `/geo/v1.0`.

| Endpoint                         | Description               |
| -------------------------------- | ------------------------- |
| `/geo/v1.0/divisions`            | Get all divisions         |
| `/geo/v1.0/districts`            | Get all districts         |
| `/geo/v1.0/districts/{division}` | Get districts by division |
| `/geo/v1.0/upazilas`             | Get all upazilas          |
| `/geo/v1.0/upazilas/{district}`  | Get upazilas by district  |

### Example

Get all districts in the "Dhaka" division:

```
GET /geo/v1.0/districts/Dhaka
```

Get all upazilas in the "Gazipur" district:

```
GET /geo/v1.0/upazilas/Gazipur
```

## Project Structure

```
bd-apis/
├── public/                # Frontend (API Explorer UI)
│   ├── index.html
│   ├── main.js
│   └── style.css
├── src/
│   ├── database/          # Data files (JSON, JS)
│   │   ├── data.js
│   └── routes/
│       └── geo.js         # Main API routes
├── index.js               # Express server entry point
├── package.json
└── README.md
```

## Data Sources

- All geo data is included in the [`src/database/`](src/database/) folder.
- Data includes both English and Bengali names.

## Author

- [Mahatab Hossen Sudip](https://github.com/SudipMHX)

---

<div align="center">
    <img src="https://visitor-badge.laobi.icu/badge?page_id=bdapis.vercel.app">
    <p>Made with ❤️</p>
</div>
