echo "[" $(git log v1.0.0..HEAD --pretty=format:'{"hash": "%H", "message": "%s"},') "]" | sed 's/, ]/]/' | jq .

git log v1.0.0..v2.0.0 --pretty=format:'{"hash": "%H", "author": "%an", "date": "%ad", "message": "%s"},' --date=iso

echo "[" $(git log v1.0.0..HEAD --pretty=format:'{"hash": "https://github.com/ahmadfarhan1981/linkstash/commit/%H", "author": "%an", "date": "%ad", "message": "%s"},' --date=iso) "]" | sed 's/, ]/]/' | jq .


echo "[" $(git log v1.0.0 --pretty=format:'{ %n "hash": "%h", "author": "%an", "date": "%ad", "subejct": "%s", "body": "%b"  %n },%n' --date=iso) "]" | sed 's/, ]/]/'
printf "[\n%s\n]\n" "$(git log v1.0.0 --pretty=format:'{%n  "hash": "%h",%n  "author": "%an",%n  "date": "%ad",%n  "subject": "%s"%n},' --date=iso)" | sed '$s/},/}/' > test.json
