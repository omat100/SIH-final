import random

from backend.db.client import get_client

TABLE = "Sensor_record"
ROW_COUNT = 15


def build_sample_rows(n=ROW_COUNT):
    return [
        {
            "temp_c": round(random.uniform(25, 35), 2),
            "humidity_pct": round(random.uniform(50, 80), 2),
            "dist_mm": round(random.uniform(1, 8), 2),
            "tilt_deg": round(random.uniform(0, 5), 2),
        }
        for _ in range(n)
    ]


def main():
    client = get_client()
    rows = build_sample_rows()
    res = client.table(TABLE).insert(rows).execute()
    print(f"Inserted {len(res.data)} rows into {TABLE}")
    for row in res.data:
        print(row)


if __name__ == "__main__":
    main()
