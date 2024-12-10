from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

import os

default_args = {
    "owner": "airflow",
    "start_date": datetime(2024,10,10),
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

def kafka_producer():
    os.system("python3 ../../Desktop/seismic_project/kafka_code/kafka_seismic_producer.py")

def kafka_consumer():
    os.system("python3 ../../Desktop/seismic_project/kafka_code/kafka_seismic_consumer.py")

with DAG(
    dag_id="seismic_dag",
    default_args=default_args,
    description="Dag that use kafka and spark to transform and load seismic data",
    schedule_interval="40 * * * *",
    catchup=False
    ) as dag:

    run_seismic_producer = PythonOperator(
        task_id="run_kafka_producer", python_callable=kafka_producer
    )

    run_seismic_consumer = PythonOperator(
        task_id="run_kafka_consumer", python_callable=kafka_consumer
    )

    spark_seismic_job = BashOperator(
        task_id="run_spark_seismic_job", bash_command="spark-submit --packages org.postgresql:postgresql:42.7.3 /home/david-carvalhido/Desktop/seismic_project/spark_job_code/spark_seismic_job.py"
    )

run_seismic_producer >> run_seismic_consumer >> spark_seismic_job
