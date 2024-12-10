from kafka import KafkaConsumer
import json
import psycopg2

KAFKA_TOPIC = "seismic-ipma-events"
POSTGRES_CONNECTION = "dbname=seismic_ipma_db user=postgres password=postgres host=localhost port=5432"

def store_data_postgres(event):
    conn = psycopg2.connect(POSTGRES_CONNECTION)
    cursor = conn.cursor()

    query_insert = """INSERT INTO stg.seismic_events (googlemapref, degree, sismoId, dataUpdate, magType, obsRegion, lon, source, depth, tensorRef, sensed, shakemapid, time, lat, shakemapref, local, magnitud)
                        VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
    
    cursor.execute(query_insert, (
        event['googlemapref'],event['degree'],
        event['sismoId'],event['dataUpdate'],
        event['magType'],event['obsRegion'],
        event['lon'],event['source'],event['depth'],
        event['tensorRef'],event['sensed'],
        event['shakemapid'],event['time'],
        event['lat'],event['shakemapref'],
        event['local'],event['magnitud']
    ))

    conn.commit()
    cursor.close()
    conn.close()

def exec_consumer_seism():
    consumer = KafkaConsumer(KAFKA_TOPIC, bootstrap_servers='localhost:9092', auto_offset_reset='earliest', enable_auto_commit=True, value_deserializer=lambda x: json.loads(x.decode('utf-8')))

    for message in consumer:
        event = message.value
        store_data_postgres(event)

if __name__ == "__main__":
    exec_consumer_seism()