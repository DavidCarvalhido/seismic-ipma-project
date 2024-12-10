# Data Engineering Project - IPMA Seismic Data Analysis (Iberian Peninsula and Sea Coast)

This project is a data analysis platform designed to process, store, and visualize earthquake data from the Iberian Peninsula and part of Atlantic ocean. Managing powerful tools such as Apache Airflow, Kafka, PySpark, PostgreSQL, and an HTML-based dashboard, this platform offers a robust pipeline for analyzing seismic activity.

<br>

---

## Architecture Overview

1. **Data Ingestion**: Iberian peninsula earthquake data is streamed using Apache Kafka.
2. **ETL Pipeline**: Apache PySpark processes the data for transformation and analysis.
3. **Orchestration**: Apache Airflow schedules and manages the workflow.
4. **Data Storage**: Processed data is stored in a PostgreSQL database.
5. **Visualization**: An interactive HTML dashboard displays insights from the data.

<br>

---

## Features

- **Data Streaming**: Allow ingesting earthquake data continuously with Kafka.
- **Scalable Data Processing**: PySpark ensures the transformation of large datasets.
- **Workflow Automation**: Airflow handles job scheduling, dependencies, and retries.
- **Centralized Data Storage**: PostgreSQL database for reliable storage and querying.
- **Interactive Dashboard**: User-friendly HTML-based interface for data exploration and visualization.

<br>

---

## Technologies Used

- **Data Orchestration**: [Apache Airflow](https://airflow.apache.org/)
- **Data Streaming**: [Apache Kafka](https://kafka.apache.org/)
- **Data Processing**: [Apache PySpark](https://spark.apache.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Frontend**: HTML, CSS, JavaScript