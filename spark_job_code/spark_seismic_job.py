# Libraries for Spark session as well pySpark, and data transformation
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when

# Spark session configuration
spark = SparkSession.builder \
    .appName("ProcessamentoSismosFinal") \
    .config("spark.jars", "/home/david-carvalhido/data_workspace/spark/jars/postgresql-42.7.3.jar") \
    .getOrCreate()

# PostgreSQL connection
jdbc_url = "jdbc:postgresql://localhost:5432/seismic_ipma_db"
properties = {
    "user": "postgres",
    "password": "postgres",
    "driver": "org.postgresql.Driver"
}

# Define uniqueness based on significant columns
unique_columns = ["time", "lon", "lat", "magnitud", "depth", "obsregion", "source"]

# Load existing data from the target table in PostgreSQL
try:
    existing_df = spark.read.jdbc(url=jdbc_url, table="enr.seismic_events_transformed", properties=properties)
    existing_df_unique = existing_df.select(unique_columns).dropDuplicates()
except:
    # If the target table does not exist yet, create an empty DataFrame with the same structure as the unique columns
    existing_df_unique = spark.createDataFrame([], schema=df.schema).select(unique_columns)

# Read the data of stg.seismic_events table
df = spark.read.jdbc(url=jdbc_url, table="stg.seismic_events", properties=properties)

# Data seismic processing.
# This part clean and remove rows of data that have the magnitud val bellow 0.1
df_filtered = df.filter(col("magnitud") > 0.1)

# Remove duplicates based on unique columns
df_unique = df_filtered.dropDuplicates(unique_columns)

# Add classification column based on the magnitude
df_classified = df_unique.withColumn(
    "classification",
    when(col("magnitud") < 3.9, "Minor")
    .when((col("magnitud") >= 4.0) & (col("magnitud") < 4.9), "Light")
    .when((col("magnitud") >= 5.0) & (col("magnitud") < 5.9), "Moderate")
    .when((col("magnitud") >= 6.0) & (col("magnitud") < 6.9), "Strong")
    .when((col("magnitud") >= 7.0) & (col("magnitud") < 7.9), "Major")
    .when((col("magnitud") >= 8.0) & (col("magnitud") < 9.9), "Great")
    .otherwise("Extreme")
)

# Find only new rows that are not in the stg.seismic_event table
new_rows = df_classified.join(existing_df_unique, on=unique_columns, how="left_anti")

# Write the processed data into PostgreSQL, avoiding duplicates
new_rows.write.jdbc(url=jdbc_url, table="enr.seismic_events_transformed", mode="append", properties=properties)