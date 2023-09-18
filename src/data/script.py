# This one-time script generates a json file of prerequisites for CIS courses
# This is used for "graph view" on the web app
# Output data is structured like this:
# [
#    { source: 102, target: 201 },
#    ...
# ]
# The above example would mean: CIS 102 is a prerequisite for CIS 201

import json

# Read the input file
with open('courses.json', 'r') as infile:
    courses = json.load(infile)

# Prepare the output data structure
prerequisite_links = []

for course in courses:
    if 'prereqs' in course:
        for prereq in course['prereqs']:
            # If does not contain "CIS", skip
            if "CIS" not in prereq:
                continue

            # Assuming 'prereqs' always follows the format "CIS XXX"
            source_number = int(prereq.split()[1])
            target_number = course['number']

            link = {
                "source": source_number,
                "target": target_number
            }

            prerequisite_links.append(link)

# Write the output to a new file
with open('prerequisites.json', 'w') as outfile:
    json.dump(prerequisite_links, outfile, indent=4)

print("Prerequisites JSON generated!")
