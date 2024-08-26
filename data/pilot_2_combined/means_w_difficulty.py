import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load the CSV file
df = pd.read_csv("responses_66bcb3acc2bf9a8a4fb322dd.csv")
pf = pd.read_csv("participants_66bcb3acc2bf9a8a4fb322dd.csv")

# Normalize the response and item_name columns to lower case to ignore capitalization
df["response_normalized"] = df["response"].str.lower()
df["item_name_normalized"] = df["item_name"].str.lower()

# Determine correctness
df["correct"] = df["response_normalized"] == df["item_name_normalized"]

# Map the categorical responses in "q1" to numerical values
q1_mapping = {
    "Very easy": 1,
    "Somewhat easy": 2,
    "Somewhat difficult": 3,
    "Very difficult": 4,
}
df["q1_numeric"] = pf["q1"].map(q1_mapping)

# Filter the data for test rounds only
test_df = df[df["phase"] == "test"]

# Calculate the overall participant accuracy for each condition during the test rounds
condition_participant_accuracy_means = (
    test_df.groupby("condition")["correct"].mean().reset_index()
)
condition_participant_accuracy_means.columns = [
    "condition",
    "average_participant_accuracy",
]

# Calculate the average perceived difficulty for each condition
condition_difficulty_means = df.groupby("condition")["q1_numeric"].mean().reset_index()

# Merge the data into one DataFrame for plotting
combined_df = pd.merge(
    condition_participant_accuracy_means, condition_difficulty_means, on="condition"
)

# Plotting
fig, ax1 = plt.subplots(figsize=(10, 6))

# Plotting average participant accuracy
ax1.bar(
    combined_df["condition"],
    combined_df["average_participant_accuracy"],
    color="lightgreen",
    label="Average Participant Accuracy",
)

# Creating a secondary y-axis for perceived difficulty
ax2 = ax1.twinx()
ax2.plot(
    combined_df["condition"],
    combined_df["q1_numeric"],
    color="orange",
    marker="o",
    label="Average Perceived Difficulty",
)

# Set axis labels and title
ax1.set_xlabel("Condition")
ax1.set_ylabel("Accuracy")
ax2.set_ylabel("Average Perceived Difficulty")
ax1.set_ylim(0, 1)
ax2.set_ylim(1, 4)
ax1.set_title("Average Participant Accuracy and Perceived Difficulty by Condition")

# Add grid lines and legends
ax1.grid(True)
ax1.legend(loc="upper left")
ax2.legend(loc="upper right")

# Show the plot
plt.tight_layout()
plt.savefig(f"mean_accuracy_w_difficulty.png")

# If running in a Jupyter notebook, use this to display the image inline
# from IPython.display import Image
# Image(filename='average_participant_accuracy_difficulty_conditions.png')
