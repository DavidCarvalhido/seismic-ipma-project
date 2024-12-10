from kafka import KafkaProducer
import requests
import json

API_URL = "https://api.ipma.pt/open-data/observation/seismic/7.json"
KAFKA_TOPIC = "seismic-ipma-events"

def fetch_seismic_data():
    response = requests.get(API_URL)
    return response.json()

def exec_producer_seism():
    producer = KafkaProducer(bootstrap_servers='localhost:9092', value_serializer=lambda v: json.dumps(v).encode('utf-8'))

    data = fetch_seismic_data()

    for event in data.get('data', []):
        producer.send(KAFKA_TOPIC, event)
    producer.flush()

if __name__ == "__main__":
    exec_producer_seism()