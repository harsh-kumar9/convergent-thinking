import pandas as pd
import matplotlib.pyplot as plt

# Load the CSV file
df = pd.read_csv("responses_66bcb3acc2bf9a8a4fb322dd.csv")

# Normalize the response and item_name columns to lower case to ignore capitalization
df["response_normalized"] = df["response"].str.lower()
df["item_name_normalized"] = df["item_name"].str.lower()

# Determine correctness
df["correct"] = df["response_normalized"] == df["item_name_normalized"]

# Calculate mean accuracy for each item_name
item_means = df.groupby("item_name_normalized")["correct"].mean().reset_index()

# Sort by item_name for a cleaner plot
item_means = item_means.sort_values(by="item_name_normalized")

# Plotting
plt.figure(figsize=(12, 6))
plt.bar(item_means["item_name_normalized"], item_means["correct"], color="skyblue")

plt.title("Mean Accuracy Across Different Items")
plt.xlabel("Item Name")
plt.ylabel("Mean Accuracy")
plt.ylim(0, 1)
plt.xticks(rotation=90)
plt.grid(True, axis="y")

# Save the plot as a PNG file
plt.savefig("mean_accuracy_per_item.png")

# If running in a Jupyter notebook, use this to display the image inline
# from IPython.display import Image
# Image(filename='mean_accuracy_per_item.png')
