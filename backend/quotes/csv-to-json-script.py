import csv
import json

# Set the minimum and maximum length for the quotes
# This can be used to create different categories of quotes (e.g. short, medium, long) that we might want to use in the future
min_length = 100
max_length = 140

# Read the CSV content from a file
with open("quotes.csv", mode="r") as in_file:
    reader = csv.DictReader(in_file, delimiter=';')

    # Filter and transform the CSV rows into the desired JSON format
    json_quotes = [
        {"content": row["QUOTE"], "author": row["AUTHOR"]}
        for row in reader
        if min_length <= len(row["QUOTE"]) <= max_length
    ]

# Write the JSON to a file
with open("quotes.json", "w") as outfile:
    json.dump(json_quotes, outfile, indent=2)

# Print the JSON
print(json.dumps(json_quotes, indent=2))
