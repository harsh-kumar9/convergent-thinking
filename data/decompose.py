import pandas as pd
import requests
import json
import statistics

# Load the CSV file
file_path = 'data/data_371QPA24DLEDRRL0LAYMTU3Q4Z0T1V.csv'
df = pd.read_csv(file_path)

# Filter the DataFrame to keep only the rows with the 'data' variable
data_rows = df[df['variable'] == 'data']

# Define responses dataframe (missing originality)
response_columns = ['assignment_id', 'hit_id', 'worker_id',
                    'condition', 'phase', 'item_name', 'response', 'on_time']
responses_df = pd.DataFrame(columns=response_columns)

fluency_columns = ['assignment_id', 'hit_id',
                   'worker_id', 'start_time', 'response', 'response_order']
fluency_df = pd.DataFrame(columns=fluency_columns)
# Define participants dataframe
participants_columns = ['assignment_id', 'hit_id', 'worker_id', 'condition']
participants_df = pd.DataFrame(columns=participants_columns)

for row_id in data_rows.index:
    hit_id = data_rows['hit_id'][row_id]
    assignment_id = data_rows['assignment_id'][row_id]
    worker_id = data_rows['worker_id'][row_id]

    data_value = data_rows['value'][row_id]

    # Convert the provided JSON string into a Python dictionary
    data_dict = json.loads(data_value)
    fluency_list = data_dict['2']["FluencyInput"]
    condition = data_dict['5']
    pre_survey = data_dict['6']
    post_survey = data_dict['feedback']
    start_time = "N/A"
    if len(fluency_list) > 0:
        start_time = fluency_list[0]["time"]
    # Get the fluency inputs
    for r in fluency_list:
        response_order = r['iid']
        response = r['name']
        d = {
            'assignment_id': assignment_id,
            'hit_id': hit_id,
            'worker_id': worker_id,
            'start_time': start_time,
            'response': response,
            'response_order': response_order,
        }
        df_dictionary = pd.DataFrame([d])
        fluency_df = pd.concat(
            [fluency_df, df_dictionary], ignore_index=True)

    for i in range(9, 18):
        response_data = data_dict[str(i)]
        phase = response_data["Round"]
        item_name = response_data["Prompt"]
        response = response_data["Response"]
        on_time = response_data["on_time"]
        d = {
            'assignment_id': assignment_id,
            'hit_id': hit_id,
            'worker_id': worker_id,
            'condition': condition,
            'phase': phase,
            'item_name': item_name,
            'response': response,
            'on_time': on_time,
        }
        df_dictionary = pd.DataFrame([d])
        responses_df = pd.concat(
            [responses_df, df_dictionary], ignore_index=True)
        # Miscellaneous Data
    page_load = data_dict['2']
    hide_time = data_dict['7']

    # Survey & Feedback Answers, Idea Diversity
    survey_answers = data_dict['1']
    feedback_answers = data_dict['feedback']
    q = {
        'assignment_id': assignment_id,
        'hit_id': hit_id,
        'worker_id': worker_id,
        'condition': condition,
        'diversity': median_distance,
        'I am more creative than \% of humans (before)': survey_answers['How Creative?'],
        'Increased use of AI computer programs in daily life makes you feel (before)': survey_answers['Increased AI use makes you feel'],
        'How difficult was it to come up with uses for the last object?': feedback_answers['q1'],
        'Increased use of AI computer programs in daily life makes you feel (after)': feedback_answers['q2'],
        'How many total objects encountered?': feedback_answers['q3'],
        'I am more creative than \% of humans (after)': feedback_answers['q4'],
        'Hide Time': hide_time['HideTime'],
        'Page Load': page_load['PageLoad'],
        'Technical Issues?': feedback_answers['q5']
    }

    q_dictionary = pd.DataFrame([q])
    participants_df = pd.concat(
        [participants_df, q_dictionary], ignore_index=True)


# responses_df.to_csv("responses_{}.csv".format(hit_id), index=False)
participants_df.to_csv("participants_{}.csv".format(hit_id), index=False)
