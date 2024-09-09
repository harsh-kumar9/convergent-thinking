import pandas as pd
import requests
import json
import statistics
from json_repair import repair_json

# Load the CSV file
file_path = "main_1.csv"
df = pd.read_csv(file_path)

# Filter the DataFrame to keep only the rows with the 'data' variable
data_rows = df
# Define responses dataframe (missing originality)
response_columns = [
    "workerid",
    "hitId",
    "condition",
    "phase",
    "item_name",
    "response",
    "onTime",
    "is_correct",
]
responses_df = pd.DataFrame(columns=response_columns)

fluency_columns = ["workerid", "hitId", "start_time", "response", "response_order"]
fluency_df = pd.DataFrame(columns=fluency_columns)
# Define participants dataframe
participants_columns = [
    "workerid",
    "hitId",
    "condition",
    "How Creative?-1",
    "Increased AI use makes you feel-1",
    "q1",
    "q2",
    "q3",
    "q4",
    "Hide Time",
    "Page Load",
    "q6",
    "q7",
    "How Creative?-2",
]
participants_df = pd.DataFrame(columns=participants_columns)

for row_id in data_rows.index:
    print(data_rows.keys())
    hitId = data_rows["hitid"][row_id]
    workerid = data_rows["workerid"][row_id]

    data_value = data_rows["raw_json"][row_id]

    # Convert the provided JSON string into a Python dictionary
    data_dict = json.loads(repair_json(data_value))
    print(data_dict)
    fluency_list = data_dict["1"]["FluencyInput"]
    condition = data_dict["3"]
    pre_survey = data_dict["4"]
    post_survey = data_dict["feedback"]
    start_time = "N/A"
    if len(fluency_list) > 0:
        start_time = fluency_list[0]["time"]
    # Get the fluency inputs
    for r in fluency_list:
        response_order = r["iid"]
        response = r["name"]
        d = {
            "workerid": workerid,
            "hitId": hitId,
            "start_time": start_time,
            "response": response,
            "response_order": response_order,
        }
        df_dictionary = pd.DataFrame([d])
        fluency_df = pd.concat([fluency_df, df_dictionary], ignore_index=True)

    for i in range(6, 11):
        response_data = data_dict[str(i)]
        phase = response_data["Round"]
        item_name = response_data["Prompt"]
        response = response_data["Response"]
        onTime = response_data["onTime"]
        d = {
            "workerid": workerid,
            "hitId": hitId,
            "condition": condition,
            "phase": phase,
            "item_name": item_name,
            "response": response,
            "onTime": onTime,
            "is_correct": item_name.lower() == response.lower(),
        }
        df_dictionary = pd.DataFrame([d])
        responses_df = pd.concat([responses_df, df_dictionary], ignore_index=True)
        # Miscellaneous Data
    page_load = data_dict["0"]
    hide_time = data_dict["2"]

    # Survey & Feedback Answers, Idea Diversity
    survey_answers = data_dict["4"]
    feedback_answers = data_dict["feedback"]
    q = {
        "workerid": workerid,
        "hitId": hitId,
        "condition": condition,
        "How Creative?-1": survey_answers["How Creative?"],
        "Increased AI use makes you feel-1": survey_answers[
            "Increased AI use makes you feel"
        ],
        "q1": feedback_answers["q1"],
        "q2": feedback_answers["q2"],
        "q3": feedback_answers["q3"],
        "q4": feedback_answers["q4"],
        "Hide Time": hide_time["HideTime"],
        "Page Load": page_load["PageLoad"],
        "q6": feedback_answers["q6"],
        "q7": feedback_answers["q7"],
        "How Creative?-2": feedback_answers["sliderValue"],
    }
    q_dictionary = pd.DataFrame([q])
    participants_df = pd.concat([participants_df, q_dictionary], ignore_index=True)

fluency_df.to_csv("fluency_{}.csv".format(hitId), index=False)
responses_df.to_csv("responses_{}.csv".format(hitId), index=False)
participants_df.to_csv("participants_{}.csv".format(hitId), index=False)
