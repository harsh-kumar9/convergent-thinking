import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import sem

# Load the CSV file
df = pd.read_csv("responses_66bcb3acc2bf9a8a4fb322dd.csv")

# Normalize the response and item_name columns to lower case to ignore capitalization
df["response_normalized"] = df["response"].str.lower()
df["item_name_normalized"] = df["item_name"].str.lower()

# Determine correctness
df["correct"] = df["response_normalized"] == df["item_name_normalized"]

# Group by participant and task order to ensure each participant's data is treated sequentially
df["order"] = df.groupby("workerid").cumcount() + 1

# Split into individual practice rounds and test set
practice1_df = df[(df["phase"] == "practice") & (df["order"] == 1)]
practice2_df = df[(df["phase"] == "practice") & (df["order"] == 2)]
practice3_df = df[(df["phase"] == "practice") & (df["order"] == 3)]
test_df = df[(df["phase"] == "test")]


# Calculate mean accuracy and SEM for each practice round and test round
def calculate_means_and_sems(df, phase_name):
    means = df.groupby("condition")["correct"].mean().reset_index()
    sems = df.groupby("condition")["correct"].apply(sem).reset_index()
    means["phase"] = phase_name
    means["sem"] = sems["correct"]
    return means


practice1_mean = calculate_means_and_sems(practice1_df, "Practice 1")
practice2_mean = calculate_means_and_sems(practice2_df, "Practice 2")
practice3_mean = calculate_means_and_sems(practice3_df, "Practice 3")
test_mean = calculate_means_and_sems(test_df, "Test")

# Combine means and SEMs
combined_means = pd.concat([practice1_mean, practice2_mean, practice3_mean, test_mean])

# Plotting each condition separately
conditions = combined_means["condition"].unique()

for condition in conditions:
    plt.figure(figsize=(10, 6))
    subset = combined_means[combined_means["condition"] == condition]
    plt.errorbar(
        subset["phase"], subset["correct"], yerr=subset["sem"], marker="o", capsize=5
    )

    plt.title(
        f"Mean Accuracy for Each Practice Round and Test ({condition.capitalize()} Condition)"
    )
    plt.xlabel("Phase")
    plt.ylabel("Mean Accuracy")
    plt.ylim(0, 1)
    plt.grid(True)

    # Save each plot as a separate PNG file
    plt.savefig(f"mean_accuracy_plot_{condition}.png")
    plt.close()  # Close the plot to avoid displaying it when not needed
