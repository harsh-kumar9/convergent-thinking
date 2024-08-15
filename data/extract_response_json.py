import csv
import json

# Input and output file paths
input_csv = 'input.csv'
output_json = 'output2.json'

# Dictionary to hold the transformed data
result = {}

# Read the CSV file
with open(input_csv, mode='r', newline='', encoding='utf-8') as csvfile:
    csvreader = csv.DictReader(csvfile)
    
    for row in csvreader:
        band = row['item4']
        gpt_4 = row['gpt-4']
        gpt_4_coach = row['gpt-4-coach-v2']
        
        # Add the entry to the result dictionary
        result[band] = {
            "gpt-4": gpt_4,
            "gpt-4-coach": gpt_4_coach
        }

# Write the result to a JSON file
with open(output_json, mode='w', encoding='utf-8') as jsonfile:
    json.dump(result, jsonfile, indent=4)

print(f"Data successfully written to {output_json}")
