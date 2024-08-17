#!/bin/bash

#Make it pretty
ENDCOLOR="\e[0m"
RED="\e[1;31m"
GREEN="\e[1;32m"
echo -e "${RED}==================${GREEN}Linkstash${RED}==================${ENDCOLOR}"


# Path to the file
FILE_PATH="./config/.migrated"

# Fixed version to compare against
CURRENT_VERSION=$(node -e "console.log(require('./package.json').version);")

run_migration(){
  eval node ./dist/migrate
  if [[ $? -eq 0 ]]; then
    echo "Migration done."
    echo "$CURRENT_VERSION" > "$FILE_PATH"
  else
    echo "Migration failed, app might not run properly"
    exit 1
  fi

}
# Function to compare two versions
version_lt() {
    local v1=$1 v2=$2
    # Split versions into arrays of numbers and suffixes
    IFS='.' read -r -a v1_parts <<< "$v1"
    IFS='.' read -r -a v2_parts <<< "$v2"

    # Compare each part of the version
    for ((i=0; i<${#v1_parts[@]}; i++)); do
        # Split numeric and non-numeric parts
        v1_num=$(echo "${v1_parts[i]}" | sed -E 's/[^0-9].*//')
        v2_num=$(echo "${v2_parts[i]:-0}" | sed -E 's/[^0-9].*//')

        if [[ "$v1_num" -lt "$v2_num" ]]; then
            return 0 # v1 is less than v2
        elif [[ "$v1_num" -gt "$v2_num" ]]; then
            return 1 # v1 is greater than v2
        fi

        # Compare the non-numeric parts if numbers are equal
        v1_suffix=$(echo "${v1_parts[i]}" | sed -E 's/[0-9]*//')
        v2_suffix=$(echo "${v2_parts[i]:-}" | sed -E 's/[0-9]*//')

        if [[ "$v1_suffix" < "$v2_suffix" ]]; then
            return 0 # v1 is less than v2
        elif [[ "$v1_suffix" > "$v2_suffix" ]]; then
            return 1 # v1 is greater than v2
        fi
    done
    return 1 # Versions are equal or v1 is greater than v2
}


# Check if the file exists
if [[ -f "$FILE_PATH" ]]; then
    # Read the version from the file
    MIGRATED_VERSION=$(<"$FILE_PATH")
    echo "DB schema version='$MIGRATED_VERSION'. Current app version='$CURRENT_VERSION'"
    # Compare versions using semver logic
    if  version_lt "$MIGRATED_VERSION" "$CURRENT_VERSION"; then
        # Run the command if the version is lower
        # Command to run if the version is lower
        echo "Running migration..."
        run_migration

    else
        echo "DB schema is current. Skipping migration..."
    fi
else
    echo "First run. Running DB migration."
    run_migration
fi

echo "Starting server..."
node .
